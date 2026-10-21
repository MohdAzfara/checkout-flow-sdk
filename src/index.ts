/**
 * @file checkout-flow-sdk/src/index.ts
 * @description Client-side checkout and payment tokenization SDK with multi-provider failover and idempotency enforcement.
 */

export interface CheckoutConfig {
  publicKey: string;
  environment: 'sandbox' | 'production';
  fallbackEnabled?: boolean;
  timeoutMs?: number;
}

export interface CheckoutSessionRequest {
  amount: number; // Stored in minor units (e.g., cents)
  currency: string;
  idempotencyKey: string;
  paymentMethod: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  status: 'SUCCEEDED' | 'FAILED' | 'FALLBACK_TRIGGERED';
  providerUsed: string;
  clientSecret?: string;
  processedAt: string;
}

export class CheckoutSDK {
  private config: CheckoutConfig;

  constructor(config: CheckoutConfig) {
    this.config = {
      fallbackEnabled: true,
      timeoutMs: 5000,
      ...config,
    };
  }

  /**
   * Creates a secure checkout session with automated multi-provider failover routing 
   * and mandatory idempotency key protection.
   */
  public async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    if (!request.idempotencyKey) {
      throw new Error('Idempotency-Key is mandatory for all secure payment mutation requests.');
    }

    console.info(`[CheckoutSDK] Initializing payment session for amount: ${request.amount} ${request.currency}`);

    try {
      // Simulate primary payment gateway execution
      return await this.executePrimaryGateway(request);
    } catch (primaryError) {
      console.warn('[CheckoutSDK] Primary payment gateway timeout or 5xx error detected.');

      if (this.config.fallbackEnabled) {
        console.info('[CheckoutSDK] Triggering circuit breaker and routing to secondary provider fallback...');
        return await this.executeFallbackGateway(request);
      }

      throw primaryError;
    }
  }

  private async executePrimaryGateway(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    // Simulated primary provider API integration
    return {
      sessionId: `cs_prim_${Math.random().toString(36).substring(2, 9)}`,
      status: 'SUCCEEDED',
      providerUsed: 'Stripe-Primary-Gateway',
      clientSecret: 'seti_secret_sample_abc123',
      processedAt: new Date().toISOString(),
    };
  }

  private async executeFallbackGateway(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    // Simulated secondary/fallback provider integration (e.g., Adyen / Braintree)
    return {
      sessionId: `cs_fall_${Math.random().toString(36).substring(2, 9)}`,
      status: 'FALLBACK_TRIGGERED',
      providerUsed: 'Adyen-Secondary-Fallback-Gateway',
      clientSecret: 'seti_secret_fallback_xyz789',
      processedAt: new Date().toISOString(),
    };
  }
}
