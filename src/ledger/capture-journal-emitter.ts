export interface CaptureJournalLine {
  readonly accountId: string;
  readonly direction: 'DEBIT' | 'CREDIT';
  readonly amountMinor: bigint;
  readonly currency: string;
}

export interface CaptureSettlementEnvelope {
  readonly captureId: string;
  readonly idempotencyKey: string;
  readonly currency: string;
  readonly grossCapturedMinor: bigint;
  readonly vendorNetPayableMinor: bigint;
  readonly platformFeeMinor: bigint;
  readonly journalLines: readonly CaptureJournalLine[];
}

/**
 * Double-Entry Capture Journal Emitter (ADR 0004)
 * Generates balanced BigInt journal batches for double-entry-ledger-core
 * and split settlement metadata for payout-gateway-service & automated-refund-worker.
 */
export class CaptureJournalEmitter {
  public buildCaptureEnvelope(params: {
    captureId: string;
    idempotencyKey: string;
    currency: string;
    grossCapturedMinor: bigint;
    platformFeeBps: bigint;
    pspClearingAccountId: string;
    vendorPayableAccountId: string;
    platformFeeAccountId: string;
  }): CaptureSettlementEnvelope {
    if (params.grossCapturedMinor <= 0n || params.platformFeeBps < 0n || params.platformFeeBps > 10_000n) {
      throw new Error('Invalid capture amount or basis-point fee parameters.');
    }

    const platformFeeMinor = (params.grossCapturedMinor * params.platformFeeBps) / 10_000n;
    const vendorNetPayableMinor = params.grossCapturedMinor - platformFeeMinor;
    const normCurrency = params.currency.trim().toUpperCase();

    const journalLines: CaptureJournalLine[] = [
      {
        accountId: params.pspClearingAccountId,
        direction: 'DEBIT',
        amountMinor: params.grossCapturedMinor,
        currency: normCurrency
      },
      {
        accountId: params.vendorPayableAccountId,
        direction: 'CREDIT',
        amountMinor: vendorNetPayableMinor,
        currency: normCurrency
      }
    ];

    if (platformFeeMinor > 0n) {
      journalLines.push({
        accountId: params.platformFeeAccountId,
        direction: 'CREDIT',
        amountMinor: platformFeeMinor,
        currency: normCurrency
      });
    }

    return {
      captureId: params.captureId,
      idempotencyKey: params.idempotencyKey,
      currency: normCurrency,
      grossCapturedMinor: params.grossCapturedMinor,
      vendorNetPayableMinor,
      platformFeeMinor,
      journalLines
    };
  }
}
