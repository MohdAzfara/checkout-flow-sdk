# Checkout Flow SDK

[![Fintech CI & Security Pipeline](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/MohdAzfara/checkout-flow-sdk/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](tsconfig.json)
[![Semantic Versioning](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](CHANGELOG.md)

A lightweight, enterprise-grade client-side TypeScript SDK engineered for secure payment tokenization, multi-provider failover routing, and robust e-commerce checkout orchestration.

---

## 🏗️ Architectural Overview & Failover Flow

---

## ✨ Key Architectural Features

1. **Client-Side Tokenization & PCI-DSS Guards**: Securely tokenizes cardholder data on the client using strict regex guards in `CryptoEngine` to prevent raw Primary Account Number (PAN) leakage.
2. **Deterministic FSM Circuit Breaker**: Evaluates primary gateway health via a Finite State Machine (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`) combined with AWS-style Full Jitter backoff.
3. **Multi-Provider Failover**: Automatically detects gateway timeouts or 5xx errors and reroutes transactions to a backup payment provider with zero client disruption.
4. **Idempotency Enforcement**: Strictly requires and validates `Idempotency-Key` headers on all state-mutating requests to prevent duplicate charging.
5. **Distributed Telemetry & PII Scrubbing**: Generates W3C Trace Context (`traceparent`) headers for end-to-end tracing while recursively redacting sensitive PII/PAN fields from logs.

---

## 📦 Project Structure & Tooling

The repository is structured to mirror production-grade commercial software libraries:

```text
checkout-flow-sdk/
├── .github/
│   ├── workflows/ci.yml           # Automated CI/CD typecheck & build validation
│   ├── workflows/dependabot.yml   # Automated weekly supply-chain vulnerability scans
│   ├── CODEOWNERS                 # Strict administrative review controls
│   └── PULL_REQUEST_TEMPLATE.md   # Mandatory pre-merge fintech compliance checklist
├── docs/
│   └── adr/
│       └── 0001-multi-psp-failover-and-idempotency.md # Architecture Decision Record
├── src/
│   ├── index.ts                   # Unified public entry point
│   ├── errors.ts                  # Standardized fintech error hierarchy
│   ├── crypto.ts                  # WebCrypto SHA-256 fingerprinting & PAN guards
│   ├── circuit-breaker.ts         # FSM circuit breaker & full-jitter backoff
│   ├── telemetry.ts               # W3C trace context & PII log redactor
│   └── __tests__/
│       └── checkout.test.ts       # Comprehensive Jest unit test suite
├── .gitignore                     # Exclusion rules for build artifacts and secrets
├── .npmrc                         # Exact version pinning and engine-strict enforcement
├── .nvmrc                         # Node.js runtime version lock (20.18.0 LTS)
├── .eslintrc.json                 # Strict static analysis ruleset
├── jest.config.js                 # Test runner configuration with coverage thresholds
├── tsup.config.ts                 # Bundler configuration for CJS & ESM output
├── tsconfig.json                  # Strict TypeScript compiler options
├── CHANGELOG.md                   # Semantic versioning release notes
├── CONTRIBUTING.md                # Enterprise contribution guidelines
├── SECURITY.md                    # Vulnerability disclosure and PCI-DSS boundary policy
└── package.json                   # Project manifest metadata

import { CheckoutSDK } from 'checkout-flow-sdk';

// Initialize the secure client-side checkout SDK
const checkoutClient = new CheckoutSDK({
  publicKey: 'pk_live_sample_xyz123',
  environment: 'production',
  fallbackEnabled: true,
  timeoutMs: 5000,
  failureThreshold: 3,
  resetTimeoutMs: 10000
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
    console.error('Checkout orchestration failed:', error);
  }
}

initiatePayment();
# Install exact dependencies
npm install

# Run Jest unit tests with coverage
npm test

# Build production bundle (CJS / ESM via Tsup)
npx tsup
