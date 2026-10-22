## Summary of Architectural Changes
<!-- Provide a concise technical summary of the changes introduced in this PR -->

## Fintech Compliance & Safety Checklist
- [ ] **Idempotency Preserved**: State-mutating methods strictly enforce `Idempotency-Key` validation.
- [ ] **PCI-DSS Scope**: No raw cardholder data (PAN/CVV) is logged or exposed in error payloads.
- [ ] **Failover Resilience**: Circuit breaker and secondary gateway fallback paths remain non-blocking.
- [ ] **Type Safety & Tests**: `tsconfig.json` strict checks and Jest unit tests (`src/__tests__/`) pass 100%.
- [ ] **Bundle Verification**: `tsup` CJS and ESM distribution builds succeed without treeshaking regressions.
