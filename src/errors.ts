/**
 * @file checkout-flow-sdk/src/errors.ts
 * @description Standardized enterprise error hierarchy for deterministic fault handling.
 */

export type CheckoutErrorCode =
  | 'IDEMPOTENCY_KEY_MISSING'
  | 'INVALID_AMOUNT_MINOR_UNITS'
  | 'PRIMARY_GATEWAY_TIMEOUT'
  | 'FALLBACK_ROUTING_EXHAUSTED';

export class CheckoutSDKError extends Error {
  public readonly code: CheckoutErrorCode;
  public readonly retriable: boolean;
  public readonly timestamp: string;

  constructor(message: string, code: CheckoutErrorCode, retriable = false) {
    super(message);
    this.name = 'CheckoutSDKError';
    this.code = code;
    this.retriable = retriable;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, CheckoutSDKError.prototype);
  }
}

export class IdempotencyError extends CheckoutSDKError {
  constructor(message = 'Idempotency-Key is mandatory for all secure payment mutation requests.') {
    super(message, 'IDEMPOTENCY_KEY_MISSING', false);
    this.name = 'IdempotencyError';
    Object.setPrototypeOf(this, IdempotencyError.prototype);
  }
}

export class GatewayTimeoutError extends CheckoutSDKError {
  public readonly provider: string;

  constructor(provider: string, timeoutMs: number) {
    super(`Payment gateway [${provider}] timed out after ${timeoutMs}ms.`, 'PRIMARY_GATEWAY_TIMEOUT', true);
    this.name = 'GatewayTimeoutError';
    this.provider = provider;
    Object.setPrototypeOf(this, GatewayTimeoutError.prototype);
  }
}
