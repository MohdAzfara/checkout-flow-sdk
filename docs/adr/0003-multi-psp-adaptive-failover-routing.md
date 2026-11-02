# ADR 0003: Deterministic Multi-PSP Failover Routing and Latency Health Scoring

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Client-side checkout flows relying on a single Payment Service Provider (PSP) suffer immediate conversion drops during regional gateway brownouts, issuer routing degradation, or HTTP 502/503/504 spikes.

## Decision

We implement a **Deterministic Multi-PSP Failover Router** governed by real-time health and latency telemetry:

1. **Ordered Provider Cascade**: Each checkout session configures a primary acquiring PSP and an ordered list of fallback PSPs supporting identical currency and card network corridors.
2. **Idempotent Failover Derivation**: When the FSM Circuit Breaker trips to `OPEN` or encounters a retryable 5xx/timeout fault, the router deterministically derives a provider-scoped child `Idempotency-Key` before dispatching to the secondary PSP, preventing duplicate captures if the primary gateway recovers late.

## Consequences

* **Positive**: Preserves 99.999% checkout authorization availability across transient PSP outages with zero cardholder friction.
* **Negative**: Requires strict separation between retryable gateway timeouts (`5xx`) and terminal issuer declines (`402 Card Declined`), which must never fail over.
