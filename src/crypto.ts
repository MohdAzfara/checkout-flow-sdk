/**
 * @file checkout-flow-sdk/src/crypto.ts
 * @description Cryptographic utilities for client-side payload signing and token format verification.
 */

export class CryptoEngine {
  /**
   * Generates a deterministic SHA-256 fingerprint for idempotency and payload integrity verification.
   */
  public static async generatePayloadSignature(payload: string, secretSalt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${payload}.${secretSalt}`);

    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback deterministic hex representation for non-WebCrypto test environments
    return Buffer.from(`${payload}.${secretSalt}`).toString('hex').slice(0, 64);
  }

  /**
   * Validates that a payment method reference is a tokenized string and never a raw PAN.
   */
  public static assertTokenizedInstrument(paymentMethod: string): boolean {
    const rawPanRegex = /^(?:\d[ -]*?){13,19}$/;
    if (rawPanRegex.test(paymentMethod)) {
      throw new Error('PCI-DSS VIOLATION: Raw Primary Account Number (PAN) detected on client SDK boundary.');
    }
    return paymentMethod.startsWith('tok_') || paymentMethod.startsWith('card_');
  }
}
