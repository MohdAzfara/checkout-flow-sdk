# Checkout Flow SDK

[![Fintech CI & Security Pipeline](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%20%2B-blue)](https://www.typescriptlang.org/)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A lightweight, enterprise-grade client-side TypeScript SDK engineered for secure payment tokenization, multi-provider failover routing, and robust e-commerce checkout orchestration.

---

## 🏛️ Architectural Overview & Failover Flow

The SDK implements zero-trust principles for client-side fintech integrations, ensuring bulletproof resilience against network partitions and payment gateway outages:

1. **Client-Side Tokenization & PCI-DSS Guards**: Securely tokenizes cardholder data on the client using strict regex guards in `CryptoEngine` to prevent raw Primary Account Number (PAN) leakage[span_2](start_span)[span_2](end_span).
2. **Deterministic FSM Circuit Breaker**: Evaluates primary gateway health via a Finite State Machine (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`) combined with AWS-style Full Jitter backoff[span_3](start_span)[span_3](end_span).
3. **Multi-Provider Failover**: Automatically detects gateway timeouts or 5xx errors and reroutes transactions to a backup payment provider with zero client disruption[span_4](start_span)[span_4](end_span).
4. **Idempotency Enforcement**: Strictly requires and validates `Idempotency-Key` headers on all state-mutating requests to prevent duplicate ledger debits.

---

## 🚀 Key Architectural Features

* **Zero-Trust Cryptography**: WebCrypto SHA-256 fingerprinting bound to ephemeral session attributes.
* **Formal Verification**: Mathematical specifications proven via TLA+ to guarantee concurrency safety and zero double-charge invariants (`docs/formal-verification/`).
* **Micro-Benchmarks**: High-performance cryptographic hashing and tokenization execution benchmarks (`benchmarks/`).
* **Strict Supply-Chain Security**: Exact version pinning (`package-lock.json`, `.npmrc`) and automated Dependabot auditing.

---

## 🔒 Security & Vulnerability Disclosure

We take the security of our payment infrastructure and users seriously. 

* **Security Policy & Scope**: Please review our [SECURITY.md](SECURITY.md) for detailed PCI-DSS boundaries and vulnerability reporting guidelines.
* **STRIDE Threat Model**: Comprehensive threat analysis and cryptographic mitigations are documented in [docs/threat-model.md](docs/threat-model.md)[span_5](start_span)[span_5](end_span).
* **RFC 9116 Compliance**: Automated vulnerability disclosure contact policy is available under [.well-known/security.txt](.well-known/security.txt)[span_6](start_span)[span_6](end_span).

---

## 📚 Documentation & Architecture Decision Records (ADRs)

* [ADR 0001: Zero-Trust Cryptographic Attestation](docs/adr/0001-zero-trust-cryptographic-attestation.md)
* [ADR 0002: FSM Circuit Breaker and Multi-Provider Routing](docs/adr/0002-zero-trust-cryptographic-attestation.md)[span_7](start_span)[span_7](end_span)
* [TLA+ Formal Invariant Specification](docs/formal-verification/idempotency-invariant.tla)

---

## 🤝 Contributing

We welcome contributions from elite engineers and security researchers. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for more information.
