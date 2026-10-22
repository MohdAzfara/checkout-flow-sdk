# ADR 0002: Zero-Trust Client-Side Cryptographic Attestation

* **Status**: Accepted
* **Date**: 2026-10-22
* **Deciders**: Principal Distributed Systems Core Team

## Context
Client-side software development kits operating in untrusted browser environments are inherently vulnerable to man-in-the-middle tampering and DOM inspection. 

## Decision
All payload mutations leaving the SDK boundary must undergo WebCrypto SHA-256 cryptographic fingerprinting bound to an ephemeral session salt, ensuring backend verification rejects altered transaction payloads instantly without executing database writes.
