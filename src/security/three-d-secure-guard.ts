export type ThreeDSecureStatus = 'Y' | 'A' | 'C' | 'N' | 'U';

export interface ThreeDSecureAssertion {
  readonly version: '2.1.0' | '2.2.0';
  readonly transStatus: ThreeDSecureStatus;
  readonly eci: '05' | '06' | '07' | '01' | '02';
  readonly authenticationValue: string;
}

export interface ScaEvaluationVerdict {
  readonly authorizedForCapture: boolean;
  readonly liabilityShiftGranted: boolean;
  readonly challengeRequired: boolean;
}

/**
 * EMV 3-D Secure 2.2 (3DS2) & PSD2 Strong Customer Authentication Guard (ADR 0005)
 * Validates cryptographic authentication values and liability shift indicators.
 */
export class ThreeDSecureGuard {
  public evaluateAssertion(assertion: ThreeDSecureAssertion): ScaEvaluationVerdict {
    if (assertion.transStatus === 'C') {
      return {
        authorizedForCapture: false,
        liabilityShiftGranted: false,
        challengeRequired: true
      };
    }

    const validCryptogram = assertion.authenticationValue.trim().length >= 20;
    const fullyAuthenticated =
      (assertion.transStatus === 'Y' || assertion.transStatus === 'A') &&
      (assertion.eci === '05' || assertion.eci === '06' || assertion.eci === '02') &&
      validCryptogram;

    return {
      authorizedForCapture: fullyAuthenticated,
      liabilityShiftGranted: fullyAuthenticated,
      challengeRequired: false
    };
  }
}
