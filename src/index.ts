/**
 * @file checkout-flow-sdk/src/index.ts
 * @description Enterprise-grade client-side checkout and payment tokenization SDK
 * integrating strict idempotency, FSM circuit breaker, W3C telemetry, and cryptographic guards.
 */

// Export all sub-modules for public SDK consumption
export * from './errors';
export * from './crypto';
export * from './circuit-breaker';
export * from './telemetry';

import { IdempotencyError, GatewayTimeoutError } from './errors';
import { CryptoEngine } from './crypto';
import { CircuitBreaker } from './circuit-breaker';
import { TelemetryEngine } from './telemetry';

export interface CheckoutConfig {
  publicKey: string;
  environment: 'sandbox' | 'production';
  fallbackEnabled?: boolean;
  timeoutMs?: number;
  failureThreshold?: number;
  resetTimeoutMs?: number;
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
  traceparent: string;
  processedAt: string;
}

export class CheckoutSDK {
  private config: Required<CheckoutConfig>;
  private primaryCircuitBreaker: CircuitBreaker;

  constructor(config: CheckoutConfig) {
    this.config = {
      fallbackEnabled: true,
      timeoutMs: 5000,
      failureThreshold: 3,
      resetTimeoutMs: 10000,
      ...config,
    };

    // Initialize FSM Circuit Breaker for primary gateway resilience
    this.primaryCircuitBreaker = new CircuitBreaker({
      failureThreshold: this.config.failureThreshold,
      resetTimeoutMs: this.config.resetTimeoutMs,
    });
  }

  /**
   * Creates a secure checkout session with automated multi-provider failover routing,
   * FSM circuit breaker protection, cryptographic guards, and mandatory idempotency.
   */
  public async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    // 1. Strict Idempotency-Key validation
    if (!request.idempotencyKey || request.idempotencyKey.trim() === '') {
      throw new IdempotencyError();
    }

    // 2. Enforce PCI-DSS PAN Safeguards via CryptoEngine
    CryptoEngine.assertTokenizedInstrument(request.paymentMethod);

    // 3. Generate W3C Trace Context for end-to-end distributed tracing
    const traceparent = TelemetryEngine.generateTraceparent();
    const sanitizedPayload = TelemetryEngine.redactSensitivePayload({ ...request, traceparent });

    console.info(`[CheckoutSDK] Initializing payment session | traceparent: ${traceparent}`, sanitizedPayload);

    // 4. Evaluate Primary Circuit Breaker FSM State
    if (!this.primaryCircuitBreaker.canExecute()) {
      console.warn('[CheckoutSDK] Primary gateway circuit breaker is OPEN. Bypassing primary and routing straight to fallback...');
      if (this.config.fallbackEnabled) {
        return await this.executeFallbackGateway(request, traceparent);
      }
      throw new GatewayTimeoutError('Stripe-Primary-Gateway', this.config.timeoutMs);
    }

    try {
      // Execute primary gateway simulation
      const response = await this.executePrimaryGateway(request, traceparent);
      this.primaryCircuitBreaker.recordSuccess();
      return response;
    } catch (primaryError) {
      console.warn('[CheckoutSDK] Primary payment gateway failed or timed out. Recording failure in circuit breaker.');
      this.primaryCircuitBreaker.recordFailure();

      if (this.config.fallbackEnabled) {
        console.info('[CheckoutSDK] Triggering secondary provider fallback routing...');
        return await this.executeFallbackGateway(request, traceparent);
      }

      throw primaryError;
    }
  }

  private async executePrimaryGateway(request: CheckoutSessionRequest, traceparent: string): Promise<CheckoutSessionResponse> {
    return {
      sessionId: `cs_prim_${Math.random().toString(36).substring(2, 9)}`,
      status: 'SUCCEEDED',
      providerUsed: 'Stripe-Primary-Gateway',
      clientSecret: 'seti_secret_sample_abc123',
      traceparent,
      processedAt: new Date().toISOString(),
    };
  }

  private async executeFallbackGateway(request: CheckoutSessionRequest, traceparent: string): Promise<CheckoutSessionResponse> {
    return {
      sessionId: `cs_fall_${Math.random().toString(36).substring(2, 9)}`,
      status: 'FALLBACK_TRIGGERED',
      providerUsed: 'Adyen-Secondary-Fallback-Gateway',
      clientSecret: 'seti_secret_fallback_xyz789',
      traceparent,
      processedAt: new Date().toISOString(),
    };
  }
}
