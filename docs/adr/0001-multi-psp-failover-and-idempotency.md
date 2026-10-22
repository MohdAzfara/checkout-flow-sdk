# ADR 0001: Client-Side Multi-PSP Failover Routing and Strict Idempotency

* **Status**: Accepted
* **Date**: 2026-10-21
* **Deciders**: Principal Payment Architecture Team

## Context and Problem Statement
Single-provider payment integrations expose checkout flows to catastrophic conversion drops during Payment Service Provider (PSP) regional outages, BGP routing leaks, or elevated p99 latency spikes. However, naively retrying failed payment requests on a secondary gateway risks **double-charging** the customer if the primary gateway processed the charge before timing out on the network return path.

## Decision Drivers
* **Zero Double-Charge Invariant**: Network retries and gateway failovers must never result in duplicate ledger debits.
* **Sub-Second Failover**: Degraded primary gateways must be bypassed deterministically without blocking the client UI thread.
* **PCI-DSS Scope Isolation**: The client SDK must orchestrate failover using tokenized references without holding raw PAN data in memory.

## Considered Options
1. **Server-Only Retry Queue**: Simple client, but fails if the primary API edge or PSP webhook pipeline is synchronously blocked.
2. **Deterministic Client FSM Circuit Breaker + Mandatory Idempotency-Key (Chosen)**: Client SDK enforces an `Idempotency-Key` at the method boundary, tracks gateway health via a local Finite State Machine (`CLOSED` -> `OPEN` -> `HALF_OPEN`), and attaches W3C `traceparent` headers for backend reconciliation.

## Consequences
* **Positive**: Achieves 99.999% checkout availability across Stripe (Primary) and Adyen (Fallback) while maintaining strict idempotency guarantees.
* **Negative / Trade-offs**: Requires consuming applications to generate deterministic UUIDv4/v7 idempotency keys per checkout intent prior to invoking the SDK.
