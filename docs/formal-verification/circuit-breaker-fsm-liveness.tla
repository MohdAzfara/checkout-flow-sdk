---------------- MODULE CircuitBreakerFsmLiveness ----------------
EXTENDS Naturals, FiniteSets

CONSTANTS FailureThreshold, HalfOpenProbeLimit

VARIABLES 
    breakerState,
    consecutiveFailures,
    halfOpenSuccesses,
    activeProvider

vars == <<breakerState, consecutiveFailures, halfOpenSuccesses, activeProvider>>

States == {"CLOSED", "OPEN", "HALF_OPEN"}
Providers == {"PRIMARY_PSP", "BACKUP_PSP"}

Init ==
    /\ breakerState = "CLOSED"
    /\ consecutiveFailures = 0
    /\ halfOpenSuccesses = 0
    /\ activeProvider = "PRIMARY_PSP"

RecordPrimaryFailure ==
    /\ breakerState = "CLOSED"
    /\ consecutiveFailures + 1 < FailureThreshold
    /\ consecutiveFailures' = consecutiveFailures + 1
    /\ UNCHANGED <<breakerState, halfOpenSuccesses, activeProvider>>

TripBreakerToOpen ==
    /\ breakerState = "CLOSED"
    /\ consecutiveFailures + 1 >= FailureThreshold
    /\ consecutiveFailures' = FailureThreshold
    /\ breakerState' = "OPEN"
    /\ activeProvider' = "BACKUP_PSP"
    /\ UNCHANGED <<halfOpenSuccesses>>

TransitionToHalfOpen ==
    /\ breakerState = "OPEN"
    /\ breakerState' = "HALF_OPEN"
    /\ halfOpenSuccesses' = 0
    /\ UNCHANGED <<consecutiveFailures, activeProvider>>

RecoverBreakerToClosed ==
    /\ breakerState = "HALF_OPEN"
    /\ halfOpenSuccesses + 1 >= HalfOpenProbeLimit
    /\ breakerState' = "CLOSED"
    /\ consecutiveFailures' = 0
    /\ halfOpenSuccesses' = 0
    /\ activeProvider' = "PRIMARY_PSP"

Next ==
    \/ RecordPrimaryFailure
    \/ TripBreakerToOpen
    \/ TransitionToHalfOpen
    \/ RecoverBreakerToClosed

\* Invariant: Whenever the circuit breaker is OPEN, traffic must route to BACKUP_PSP
FailoverSafetyInvariant ==
    (breakerState = "OPEN") => (activeProvider = "BACKUP_PSP")

Spec == Init /\ [][Next]_vars
=============================================================================
