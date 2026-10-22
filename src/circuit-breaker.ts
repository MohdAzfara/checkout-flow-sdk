/**
 * @file checkout-flow-sdk/src/circuit-breaker.ts
 * @description Deterministic Finite State Machine (FSM) Circuit Breaker with Exponential Backoff & Full Jitter.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
  baseBackoffMs?: number;
  maxBackoffMs?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private readonly options: Required<CircuitBreakerOptions>;

  constructor(options: CircuitBreakerOptions) {
    this.options = {
      baseBackoffMs: 100,
      maxBackoffMs: 3000,
      ...options,
    };
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN' && this.lastFailureTime !== null) {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.options.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  public canExecute(): boolean {
    const currentState = this.getState();
    return currentState === 'CLOSED' || currentState === 'HALF_OPEN';
  }

  public recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  public recordFailure(): void {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.options.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
    }
  }

  /**
   * Computes AWS-style Full Jitter delay to prevent thundering herd cascading failures
   * across distributed client instances during PSP brownouts.
   */
  public computeJitterBackoff(attempt: number): number {
    const exponentialCap = Math.min(
      this.options.maxBackoffMs,
      this.options.baseBackoffMs * Math.pow(2, attempt)
    );
    return Math.floor(Math.random() * exponentialCap);
  }
}
