/**
 * Micro-benchmark: High-Throughput FSM Circuit Breaker State Evaluation & Full-Jitter Failover
 * Target SLA: >= 500,000 routing evaluations/sec
 */
function evaluateCircuitStateAndJitter(
  consecutiveFailures: number,
  threshold: number,
  attempt: number
): { state: 'CLOSED' | 'OPEN'; delayMs: number } {
  if (consecutiveFailures >= threshold) {
    const cap = Math.min(10_000, 100 * Math.pow(2, attempt));
    return { state: 'OPEN', delayMs: Math.floor(Math.random() * cap) };
  }
  return { state: 'CLOSED', delayMs: 0 };
}

function runCircuitBreakerBenchmark(iterations = 500_000): void {
  const startMs = Date.now();
  let failoverCount = 0;

  for (let i = 0; i < iterations; i++) {
    const res = evaluateCircuitStateAndJitter(i % 8, 5, i % 6);
    if (res.state === 'OPEN') {
      failoverCount += 1;
    }
  }

  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] FSM Circuit Breaker & Failover Evaluation:`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (Failovers: ${failoverCount.toLocaleString()})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} evaluations/sec`);
}

runCircuitBreakerBenchmark();
