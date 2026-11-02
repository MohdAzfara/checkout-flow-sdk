# ADR 0006: W3C Trace Context Propagation and Zero-PII Client Telemetry

* **Status**: Accepted
* **Date**: 2026-11-02
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Debugging distributed payment flows across `checkout-flow-sdk`, `double-entry-ledger-core`, `payout-gateway-service`, and `automated-refund-worker` requires end-to-end distributed tracing without risking PCI-DSS v4.0 violations from leaked Primary Account Numbers (PAN) or CVVs.

## Decision

We standardize telemetry around **W3C Trace Context (`traceparent`) paired with Recursive PAN Scrubbing**:

1. **Deterministic Trace Header Injection**: Every outbound checkout request generates a W3C-compliant `00-<traceId>-<spanId>-01` header propagated through downstream ledger and payout services.
2. **Zero-PII Redaction Gate**: All structured client logs and error stack traces pass through a recursive regex scrubber that masks raw PAN, CVV, and expiry fields prior to emission.

## Consequences

* **Positive**: Enables sub-millisecond cross-service root-cause analysis while maintaining strict PCI-DSS SAQ-A-EP compliance.
* **Negative**: Adds minor regex inspection overhead on error serialization paths.
