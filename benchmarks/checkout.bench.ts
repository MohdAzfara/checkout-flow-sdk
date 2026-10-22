/**
 * @file checkout-flow-sdk/benchmarks/checkout.bench.ts
 * @description Ultra-low latency micro-benchmarks for CryptoEngine payload signing and FSM evaluation.
 */
import { Bench } from 'tinybench';
import { CryptoEngine } from '../src/crypto';
import { CircuitBreaker } from '../src/circuit-breaker';

async function runBenchmarks() {
  const bench = new Bench({ time: 1000 });

  bench
    .add('CryptoEngine.assertTokenizedInstrument', () => {
      CryptoEngine.assertTokenizedInstrument('tok_visa_debit_123456789');
    })
    .add('CircuitBreaker.canExecute (FSM State Check)', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 10000 });
      cb.canExecute();
    });

  await bench.run();
  console.table(bench.table());
}

runBenchmarks();
