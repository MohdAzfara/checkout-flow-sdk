# Checkout Flow SDK

[![Fintech CI & Security Pipeline](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A lightweight, enterprise-grade client-side TypeScript SDK engineered for secure payment tokenization, multi-provider failover routing, and robust e-commerce checkout orchestration.

---

## 🗺️ Checkout Execution & Failover Flow

```text
[ Client Checkout Application ]
               │
               ▼
[ CryptoEngine & PCI-DSS Guards ] ──(Client-Side Tokenization & PAN Masking)
               │
               ▼
[ DeterministicIdempotency Guard ] ─(SHA-256 Payload Fingerprint Attestation)
               │
               ▼
[ FSM Circuit Breaker Router ] ─────(Health State: CLOSED / OPEN / HALF_OPEN)
               │
  ┌────────────┴────────────┐
  ▼ (Primary Healthy)       ▼ (Timeout / 5xx Outage)
[ Primary PSP Gateway ]   [ Automatic Failover ──► Backup PSP Gateway ]
```

---

## 🏛️ Architectural Overview & Failover Flow

Designed as the inbound payment capture counterpart to [`payout-gateway-service`](https://github.com/MohdAzfara/payout-gateway-service), the SDK implements zero-trust principles for client-side fintech integrations, ensuring bulletproof resilience against network partitions and payment gateway outages:

1. **Client-Side Tokenization & PCI-DSS Guards**: Securely tokenizes cardholder data on the client using strict regex guards in `CryptoEngine` to prevent raw Primary Account Number (PAN) leakage.
2. **Deterministic FSM Circuit Breaker**: Evaluates primary gateway health via a Finite State Machine (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`) combined with AWS-style Full Jitter exponential backoff.
3. **Multi-Provider Failover**: Automatically detects gateway timeouts or 5xx errors and reroutes transactions to a backup payment provider with zero client disruption.
4. **Idempotency Enforcement**: Strictly requires and validates `Idempotency-Key` headers on all state-mutating requests to prevent duplicate ledger debits.

---

## ✨ Key Architectural Features

* **Zero-Trust Cryptography**: WebCrypto SHA-256 fingerprinting bound to ephemeral session attributes.
* **Recursive Telemetry Scrubbing**: Automated redaction of sensitive Cardholder Data (PAN/CVV) accompanied by W3C Trace Context (`traceparent`) propagation.
* **Formal Verification (TLA+)**: Mathematical specifications proven via TLA+ to guarantee concurrency safety and zero double-charge invariants (`docs/formal-verification/`).
* **High-Throughput Micro-Benchmarks**: Deterministic cryptographic hashing and tokenization execution benchmarks (`benchmarks/`).
* **Strict Supply-Chain Security**: Exact version pinning (`package-lock.json`, `.npmrc`, `.nvmrc`) and automated Dependabot auditing.

---

## 🔒 Security & Vulnerability Disclosure

We take the security of our payment infrastructure and users seriously:

* **Security Policy & PCI-DSS Boundaries**: Review our [SECURITY.md](SECURITY.md) for detailed scope and vulnerability reporting guidelines.
* **STRIDE Threat Model**: Comprehensive threat analysis and cryptographic mitigations are documented in [docs/threat-model.md](docs/threat-model.md).
* **RFC 9116 Compliance**: Standardized vulnerability disclosure contact policy is published under [.well-known/security.txt](.well-known/security.txt).

---

## 📚 Documentation & Architecture Decision Records (ADRs)

* [ADR 0001: Client-Side Failover and Circuit Breaker State Machine](docs/adr/0001-client-side-failover-and-circuit-breaker.md)
* [ADR 0002: Zero-Trust Cryptographic Attestation](docs/adr/0002-zero-trust-cryptographic-attestation.md)
* [TLA+ Formal Specification: Idempotency & Zero Double-Charge Invariant](docs/formal-verification/idempotency-invariant.tla)

---

## 🤝 Contributing

We welcome contributions from distributed systems engineers and security researchers. Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
