import { PawnStateOnTurn } from './PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingPlacement } from './PawnStateWaitingPlacement/pawn-state-waiting-placement';
import { PawnStateWaitingTurn } from './PawnStateWaitingTurn/pawn-state-waiting-turn';

export const GlobalPawnStates = {
  waitingPlacementState: new PawnStateWaitingPlacement(),
  onTurnState: new PawnStateOnTurn(),
  waitingTurnState: new PawnStateWaitingTurn()
};
