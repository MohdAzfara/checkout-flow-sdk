# Checkout Flow SDK

[![Fintech CI & Security Pipeline](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1.0-6ba539.svg)](docs/api/checkout-flow-openapi.yaml)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A lightweight, enterprise-grade client-side TypeScript SDK engineered for zero-trust payment tokenization, EMV 3-D Secure 2.2 attestation, multi-provider failover routing, and double-entry capture orchestration.

---

## 🗺️ Checkout Execution & Multi-PSP Failover Flow

```text
[ Client Checkout Application ]
               │
               ▼
[ CryptoEngine & PCI-DSS Guards ] ──(Client-Side Tokenization & PAN Masking)
               │
               ▼
[ EMV 3DS2 & Idempotency Guard ] ───(SCA Cryptogram & SHA-256 Fingerprint Check)
               │
               ▼
[ FSM Circuit Breaker & Router ] ───(State: CLOSED / OPEN / HALF_OPEN + Latency)
               │
  ┌────────────┴────────────────┐
  ▼ (Primary Healthy)           ▼ (Timeout / 5xx Outage)
[ Primary PSP Gateway ]       [ Automatic Failover ──► Backup PSP Gateway ]
  │                             │
  └────────────┬────────────────┘
               ▼ (201 Captured)
[ Double-Entry Capture Emitter ] ──► [ double-entry-ledger-core / payout / refund ]
```

---

## 🏛️ Architectural Overview & Ecosystem Integration

Serving as the inbound payment capture gateway for [`double-entry-ledger-core`](https://github.com/MohdAzfara/double-entry-ledger-core) (Immutable Accounting), [`payout-gateway-service`](https://github.com/MohdAzfara/payout-gateway-service) (Vendor Disbursement), and [`automated-refund-worker`](https://github.com/MohdAzfara/automated-refund-worker) (Compensating Reversal Saga), the SDK enforces strict resilience and security invariants:

1. **Client-Side Tokenization & PCI-DSS v4.0 Guards**: Tokenizes cardholder data on the client using strict guards in `CryptoEngine` to prevent raw Primary Account Number (PAN) or CVV leakage.
2. **EMV 3-D Secure 2.2 (3DS2) Attestation**: Validates PSD2 Strong Customer Authentication (SCA) cryptograms, ECI indicators, and issuer liability shift assertions prior to authorization (`src/security/three-d-secure-guard.ts`).
3. **Deterministic FSM Circuit Breaker & Adaptive Failover**: Evaluates gateway health via a Finite State Machine (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`) combined with AWS-style Full-Jitter backoff and latency-weighted routing (`src/routing/adaptive-psp-router.ts`).
4. **Idempotency Enforcement**: Strictly requires and validates `Idempotency-Key` headers and derives provider-scoped keys during failover to guarantee zero double-charge anomalies.
5. **Double-Entry Capture Journal Emission**: Emits pre-balanced 64-bit `BigInt` debit/credit capture envelopes (`src/ledger/capture-journal-emitter.ts`) directly consumable by `double-entry-ledger-core`.

---

## ✨ Key Architectural Features

* **Zero-Trust Cryptography**: WebCrypto SHA-256 payload fingerprinting bound to ephemeral session attributes.
* **Recursive Telemetry Scrubbing**: Automated redaction of sensitive Cardholder Data (PAN/CVV) accompanied by W3C Trace Context (`traceparent`) propagation.
* **Formal Verification (TLA+)**: Triple mathematical specifications proving strict idempotency conservation, FSM circuit breaker failover safety, and zero-PAN leakage (`docs/formal-verification/`).
* **High-Throughput Micro-Benchmarks**: Deterministic benchmarks for cryptographic hashing, 3DS2 validation, and circuit breaker state evaluation (`benchmarks/`).
* **100% Pure TypeScript & Supply-Chain Security**: Exact version pinning (`package-lock.json`, `.npmrc`, `.nvmrc`) and strongly-typed configurations (`jest.config.ts`, `tsup.config.ts`).

---

## 🔒 Security, Compliance & Vulnerability Disclosure

We treat cardholder data security and authorization integrity as non-negotiable priorities:

* **Security Policy & PCI-DSS Boundaries**: Review our [SECURITY.md](SECURITY.md) for detailed scope and vulnerability reporting guidelines.
* **STRIDE Threat Model**: Comprehensive threat analysis and cryptographic mitigations are documented in [docs/threat-model.md](docs/threat-model.md).
* **PCI-DSS v4.0, EMV 3DS2 & ISO 20022 Compliance Matrix**: Alignment with SAQ-A-EP, PSD2 SCA, and `pain.001` messaging controls is documented in [docs/compliance/pci-dss-v4-and-iso20022-controls.md](docs/compliance/pci-dss-v4-and-iso20022-controls.md).
* **RFC 9116 Compliance**: Standardized vulnerability disclosure contact policy is published at [.well-known/security.txt](.well-known/security.txt).

---

## 📚 Documentation, Specifications & Runbooks

### Architecture Decision Records (ADRs)
* [ADR 0001: Multi-PSP Failover and Deterministic Idempotency](docs/adr/0001-multi-psp-failover-and-idempotency.md)
* [ADR 0002: Zero-Trust Cryptographic Attestation](docs/adr/0002-zero-trust-cryptographic-attestation.md)
* [ADR 0003: Deterministic Multi-PSP Failover Routing and Latency Health Scoring](docs/adr/0003-multi-psp-adaptive-failover-routing.md)
* [ADR 0004: Cryptographic Capture Attestation and Double-Entry Ledger Event Emission](docs/adr/0004-double-entry-ledger-capture-attestation.md)
* [ADR 0005: EMV 3-D Secure 2.2 (3DS2) and PSD2 Strong Customer Authentication Guard](docs/adr/0005-emv-3ds2-strong-customer-authentication.md)
* [ADR 0006: W3C Trace Context Propagation and Zero-PII Client Telemetry](docs/adr/0006-w3c-traceparent-zero-pii-telemetry.md)

### Formal Verification (TLA+), API Contracts & Operational Runbooks
* [TLA+ Invariant 1: Idempotency & Zero Double-Charge Specification](docs/formal-verification/idempotency-invariant.tla)
* [TLA+ Invariant 2: FSM Circuit Breaker Failover Safety Specification](docs/formal-verification/circuit-breaker-fsm-liveness.tla)
* [TLA+ Invariant 3: PCI-DSS Tokenization Zero-PAN Leakage Specification](docs/formal-verification/pci-tokenization-zero-leakage.tla)
* [OpenAPI 3.1 Specification: Tokenized Checkout Capture Contract](docs/api/checkout-flow-openapi.yaml)
* [Operational Runbook 1: Primary PSP Outage & Circuit Breaker Recovery SOP](docs/runbooks/psp-outage-circuit-breaker-recovery.md)
* [Operational Runbook 2: Checkout Idempotency Lock Contention & Stale Session Recovery SOP](docs/runbooks/idempotency-lock-contention-recovery.md)

---

## 🤝 Contributing

We welcome contributions from distributed systems engineers and security researchers. Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
