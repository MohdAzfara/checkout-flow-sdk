# PCI-DSS v4.0, EMV 3-D Secure 2.2 & ISO 20022 Compliance Matrix

This document maps `checkout-flow-sdk` engineering controls to global payment security and financial messaging standards.

| Control Domain | Engineering Implementation | Regulatory / Network Standard |
| :--- | :--- | :--- |
| **PAN Scope Reduction** | Client-side tokenization & strict regex PAN/CVV guards in `CryptoEngine` | PCI-DSS v4.0 Requirement 3 & SAQ-A-EP |
| **Strong Customer Auth** | EMV 3-D Secure 2.2 (`3DS2`) cryptogram & ECI validation (`src/security/three-d-secure-guard.ts`) | PSD2 SCA / EMVCo 3DS 2.2 Specification |
| **Idempotent Capture** | Mandatory `Idempotency-Key` & SHA-256 payload fingerprint attestation | ISO 20022 `CustomerCreditTransferInitiation` (`pain.001`) |
| **Ledger Conservation** | Pre-balanced `BigInt` capture journal emission to `double-entry-ledger-core` | SOC 1 Type II / GAAP Double-Entry Completeness |
| **Telemetry Redaction** | Recursive scrubbing of cardholder data paired with W3C `traceparent` headers | PCI-DSS v4.0 Requirement 10 & GDPR |
