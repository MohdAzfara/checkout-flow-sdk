**Checkout Flow SDK**

![Fintech CI & Security Pipeline](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Semantic Versioning](https://img.shields.io/badge/SemVer-1.0.0-green.svg)
A lightweight, enterprise-grade client-side TypeScript SDK engineered for secure payment tokenization, multi-provider failover routing, and robust e-commerce checkout orchestration.
---
🏗️ Architectural Overview & Failover Flow
```
[Client Application] 
       │
       ▼
 [Checkout SDK] ──(Primary Gateway Failure / Timeout)
       │                  │
       ├──────────────────┘ (Automatic Circuit Breaker & Fallback)
       ▼
 [Secondary Provider Gateway (Adyen / Fallback)]
```
---
✨ Key Architectural Features
Client-Side Tokenization: Securely tokenizes sensitive cardholder data directly on the client, enforcing strict PCI-DSS scope reduction.
Multi-Provider Failover: Automatically detects gateway timeouts or 5xx errors and reroutes transactions to a backup payment provider with zero client disruption.
Idempotency Enforcement: Strictly requires and validates `Idempotency-Key` headers on all state-mutating requests to prevent duplicate charging.
Strict TypeScript Typings: Fully typed request/response models ensuring absolute runtime safety and superior developer ergonomics.
---
📦 Project Structure & Tooling
The repository is structured to mirror production-grade commercial software libraries:
```text
checkout-flow-sdk/
├── .github/
│   ├── workflows/ci.yml        # Automated CI/CD typecheck & build validation
│   └── CODEOWNERS              # Strict administrative review controls
├── src/
│   ├── index.ts                # Core SDK implementation logic
│   └── __tests__/
│       └── checkout.test.ts    # Comprehensive Jest unit test suite
├── CHANGELOG.md                # Semantic versioning release notes
├── CONTRIBUTING.md             # Enterprise contribution and commit guidelines
├── tsup.config.ts              # Bundler configuration for CJS & ESM output
├── tsconfig.json               # Strict TypeScript compiler options
└── package.json                # Project dependencies and manifest metadata
```
---
🚀 Quick Start Implementation
```typescript
import { CheckoutSDK } from 'checkout-flow-sdk';

// Initialize the secure client-side checkout SDK
const checkoutClient = new CheckoutSDK({
  publicKey: 'pk_live_sample_xyz123',
  environment: 'production',
  fallbackEnabled: true,
  timeoutMs: 5000
});

async function initiatePayment() {
  try {
    const session = await checkoutClient.createCheckoutSession({
      amount: 4999, // Amount in minor units (cents)
      currency: 'USD',
      idempotencyKey: 'idem_chk_99887766',
      paymentMethod: 'tok_visa_debit'
    });

    console.info('Checkout Session Initialized:', session);
  } catch (error) {
    console.error('Checkout orchestration failed with fallback triggered:', error);
  }
}

initiatePayment();
```
---
🛠️ Development & Testing
To run the test suite and verify build packages locally:
```bash
# Install dependencies
npm install

# Run Jest unit tests
npm test

# Build production bundle (CJS / ESM via Tsup)
npx tsup
```
---
🔒 Security & Compliance
PCI-DSS Scope Reduction: Designed to ensure raw PAN (Primary Account Number) data never touches your application servers.
Payload Security: Secures transaction workflows using cryptographic checks and state invariants.
---
📄 License & Governance
Distributed under the Apache-2.0 License. See `LICENSE` for more information. Maintained under strict review guidelines via `CODEOWNERS`.
