# ADR 0005: EMV 3-D Secure 2.2 (3DS2) and PSD2 Strong Customer Authentication Guard

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Global card regulations (PSD2 SCA in Europe, EMVCo 3DS 2.2 globally) require cryptographic proof of cardholder authentication prior to payment capture to shift fraudulent chargeback liability from the merchant to the issuing bank.

## Decision

We enforce a deterministic **Pre-Capture 3DS2 Cryptogram Guard** inside `checkout-flow-sdk`:

1. **Cryptogram & ECI Verification**: Validates Electronic Commerce Indicator (`ECI 05/06/02`) and 3DS authentication values (`transStatus === 'Y' | 'A'`) prior to dispatching capture payloads.
2. **Step-Up Challenge Routing**: Transactions returning `transStatus === 'C'` (Challenge Required) are deterministically halted at the SDK boundary until interactive challenge attestation completes.

## Consequences

* **Positive**: Secures issuer liability shift and reduces downstream fraudulent chargebacks in `automated-refund-worker`.
* **Negative**: Requires strict schema validation of 3DS2 cryptogram fields on cross-border transactions.
