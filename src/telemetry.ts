/**
 * @file checkout-flow-sdk/src/telemetry.ts
 * @description W3C Trace Context propagation and PCI-DSS automated PII/PAN log redaction engine.
 */

const SENSITIVE_KEYS = new Set([
  'pan',
  'cardnumber',
  'cvv',
  'cvc',
  'clientsecret',
  'secret',
  'authorization',
]);

export class TelemetryEngine {
  /**
   * Generates a W3C Trace Context compliant `traceparent` header (version 00)
   * for end-to-end distributed tracing across client SDK and backend microservices.
   */
  public static generateTraceparent(): string {
    const traceId = TelemetryEngine.randomHex(32);
    const parentId = TelemetryEngine.randomHex(16);
    const traceFlags = '01'; // Sampled
    return `00-${traceId}-${parentId}-${traceFlags}`;
  }

  /**
   * Recursively scrubs sensitive PCI-DSS / PII fields from telemetry payloads before emission.
   */
  public static redactSensitivePayload<T extends Record<string, unknown>>(payload: T): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase().replace(/[_-]/g, ''))) {
        sanitized[key] = '[REDACTED_PCI_SCOPE]';
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = TelemetryEngine.redactSensitivePayload(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private static randomHex(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
  }
}
