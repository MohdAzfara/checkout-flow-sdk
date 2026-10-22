# Security Policy & Vulnerability Disclosure

## Supported Versions

Only the latest major release branch receives active cryptographic and security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## PCI-DSS Scope & Architectural Boundaries

`checkout-flow-sdk` is strictly engineered to handle tokenized payment references (`tok_*`) and ephemeral session secrets. 
- **Zero Raw PAN Storage**: Raw Primary Account Numbers (PAN) and CVV data must never be logged, persisted in `localStorage`, or transmitted through unencrypted channels.
- **Idempotency Guarantees**: All state-mutating operations enforce strict `Idempotency-Key` validation to prevent replay attacks and duplicate ledger entries.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a potential cryptographic flaw, token leakage vector, or failover bypass:
1. Email a detailed technical report to **lumillieju@hotmail.com**.
2. Include reproduction steps, affected SDK configuration, and potential impact scope.
3. You will receive an acknowledgment within **24 hours** and a remediation timeline within **72 hours**.
