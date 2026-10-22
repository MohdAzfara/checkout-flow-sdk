---------------- MODULE IdempotencyInvariant ----------------
EXTENDS Integers, Sequences, FiniteSets

VARIABLES ledgerState, processedKeys

Init == /\ ledgerState = 0
        /\ processedKeys = {}

ProcessPayment(key, amount) == 
  IF key \notin processedKeys
    THEN /\ processedKeys' = processedKeys \union {key}
         /\ ledgerState' = ledgerState + amount
    ELSE /\ TRUE
         /\ UNCHANGED <<ledgerState, processedKeys>>

Next == \E k \in {"key_1", "key_2"}, a \in {100, 250} : ProcessPayment(k, a)

Spec == Init /\ [][Next]_<<ledgerState, processedKeys>>
=============================================================
