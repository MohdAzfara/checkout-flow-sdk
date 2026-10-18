/**
 * @file checkout-flow-sdk/src/index.ts
 * @description Lightweight client-side checkout and payment flow SDK with multi-provider fallback and tokenization.
 */

export type PaymentProvider = 'stripe' | 'adyen' | 'paypal' | 'local_gateway';

export interface CheckoutConfig {
  merchantId: string;
  environment: 'sandbox' | 'production';
  primaryProvider: PaymentProvider;
  fallbackProviders: PaymentProvider[];
  timeoutMs: number;
}

export interface PaymentPayload {
  amount: number;
  currency: string;
  idempotencyKey: string;
  sourceToken: string;
  metadata?: Record<string, string>;
}

export interface TransactionResult {
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'REQUIRES_ACTION';
  providerUsed: PaymentProvider;
  errorCode?: string;
  timestamp: string;
}

export class CheckoutSDK {
  private config: CheckoutConfig;

  constructor(config: CheckoutConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.merchantId) {
      throw new Error('Critical: Merchant ID is required for SDK initialization.');
    }
  }

  /**
   * Executes a secure payment flow with automatic multi-PSP failover.
   */
  public async processPayment(payload: PaymentPayload): Promise<TransactionResult> {
    const providersToTry = [this.config.primaryProvider, ...this.config.fallbackProviders];

    for (const provider of providersToTry) {
      try {
        console.info(`[CheckoutSDK] Attempting transaction via provider: ${provider} [Idempotency-Key: ${payload.idempotencyKey}]`);
        
        // Simulating robust network and tokenization handshake
        const result = await this.dispatchToGateway(provider, payload);
        if (result.status === 'SUCCESS') {
          return result;
        }
      } catch (error: unknown) {
        console.warn(`[CheckoutSDK] Provider ${provider} failed. Triggering circuit breaker / fallback route.`, error);
      }
    }

    throw new Error('All payment providers exhausted. Transaction failed across multi-PSP circuit.');
  }

  private async dispatchToGateway(provider: PaymentProvider, payload: PaymentPayload): Promise<TransactionResult> {
    // Simulated gateway execution layer
    return {
      idempotencyKey: payload.idempotencyKey,
      transactionId: `tx_${Math.random().toString(36).substring(2, 11)}`,
      status: 'SUCCESS',
      providerUsed: provider,
      timestamp: new Date().toISOString()
    } as TransactionResult;
  }
}
