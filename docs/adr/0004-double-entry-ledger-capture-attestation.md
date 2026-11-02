# ADR 0004: Cryptographic Capture Attestation and Double-Entry Ledger Event Emission

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Captured customer payments in `checkout-flow-sdk` initiate the financial lifecycle across our ecosystem: posting immutable journal entries in `double-entry-ledger-core`, funding vendor balances in `payout-gateway-service`, and establishing the cumulative refund cap in `automated-refund-worker`.

## Decision

Every confirmed checkout capture emits a **Signed Double-Entry Capture Envelope**:

1. **Zero-Sum Journal Payload**: Pre-computes integer minor-unit (`BigInt`) lines debiting `acct_psp_clearing` and crediting `acct_vendor_payable` plus `acct_platform_fee_revenue` ($\sum \text{Debits} = \sum \text{Credits}$).
2. **End-to-End Correlation**: Propagates the canonical `captureId` and `Idempotency-Key` downstream so `double-entry-ledger-core`, `payout-gateway-service`, and `automated-refund-worker` share a deterministic audit key.

## Consequences

* **Positive**: Guarantees 100% accounting parity from client checkout capture through ledger sealing, vendor settlement, and refund reversals.
* **Negative**: Requires strict 64-bit `BigInt` minor-unit validation at the SDK boundary.
