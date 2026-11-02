# Operational Runbook: Primary PSP Outage, Circuit Breaker Trip & Failover Recovery SOP

## 1. Incident Trigger Conditions

This runbook is triggered when the deterministic FSM Circuit Breaker transitions from `CLOSED` to `OPEN` due to:
1. Consecutive `HTTP 502/503/504` gateway errors or network timeouts exceeding `FailureThreshold` on the primary acquiring PSP.
2. Elevated p99 authorization latency triggering adaptive failover routing (`src/routing/adaptive-psp-router.ts`).

## 2. Automated Failover Behavior

1. **Immediate Rerouting**: All new checkout sessions automatically route tokenized capture requests to `BACKUP_PSP` using derived provider-scoped `Idempotency-Key`s.
2. **Full-Jitter Probe Scheduling**: After the cooldown window expires, the breaker enters `HALF_OPEN` and dispatches single probe transactions with AWS-style Full-Jitter backoff.

## 3. Manual Verification & Recovery Checklist

1. **Step 1 — Verify Zero Double-Capture**: Confirm via `double-entry-ledger-core` that timed-out primary requests did not settle asynchronously before clearing `Idempotency-Key` locks.
2. **Step 2 — Monitor Half-Open Probes**: Confirm `HalfOpenProbeLimit` consecutive 2xx responses before restoring primary routing weight to 100%.
