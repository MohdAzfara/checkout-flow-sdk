export interface PspEndpointHealth {
  readonly providerId: string;
  readonly circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  readonly p99LatencyMs: number;
  readonly successRateBps: number;
}

export interface CheckoutRouteSelection {
  readonly selectedProviderId: string;
  readonly failoverTriggered: boolean;
  readonly derivedIdempotencyKey: string;
}

/**
 * Deterministic Multi-PSP Failover & Latency-Aware Router (ADR 0003)
 * Selects healthy acquiring gateways and derives provider-scoped idempotency keys.
 */
export class AdaptivePspRouter {
  public selectOptimalProvider(
    baseIdempotencyKey: string,
    candidates: readonly PspEndpointHealth[]
  ): CheckoutRouteSelection {
    if (candidates.length === 0) {
      throw new Error('AdaptivePspRouter requires at least one configured PSP candidate.');
    }

    const healthyCandidates = candidates.filter(
      (c) => c.circuitState !== 'OPEN' && c.successRateBps >= 9500
    );

    const pool = healthyCandidates.length > 0 ? healthyCandidates : candidates;
    const sorted = [...pool].sort((a, b) => a.p99LatencyMs - b.p99LatencyMs);
    const chosen = sorted[0];
    const primaryProviderId = candidates[0].providerId;

    return {
      selectedProviderId: chosen.providerId,
      failoverTriggered: chosen.providerId !== primaryProviderId,
      derivedIdempotencyKey: `${baseIdempotencyKey.trim()}:${chosen.providerId}`
    };
  }
}
