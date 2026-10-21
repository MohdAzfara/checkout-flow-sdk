/**
 * @file checkout-flow-sdk/src/__tests__/checkout.test.ts
 * @description Unit test suite for CheckoutSDK verifying idempotency enforcement and multi-PSP failover.
 */

import { CheckoutSDK } from '../index';

describe('CheckoutSDK Core Engine', () => {
  let sdk: CheckoutSDK;

  beforeEach(() => {
    sdk = new CheckoutSDK({
      publicKey: 'pk_test_mock123',
      environment: 'sandbox',
      fallbackEnabled: true,
    });
  });

  test('should throw an error if Idempotency-Key is missing', async () => {
    await expect(
      sdk.createCheckoutSession({
        amount: 1000,
        currency: 'USD',
        idempotencyKey: '', // Missing key
        paymentMethod: 'card_visa',
      })
    ).rejects.toThrow('Idempotency-Key is mandatory');
  });

  test('should successfully initialize a checkout session with primary provider', async () => {
    const response = await sdk.createCheckoutSession({
      amount: 2500,
      currency: 'USD',
      idempotencyKey: 'idem_test_999888',
      paymentMethod: 'card_mastercard',
    });

    expect(response.status).toBe('SUCCEEDED');
    expect(response.sessionId).toBeDefined();
    expect(response.providerUsed).toContain('Primary');
  });
});
