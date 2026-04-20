import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { GlobalPawnStates } from './PawnState/pawn-states';
import { IStrategy } from '../Strategy/istrategy';
import { PawnState } from './PawnState/pawn-state';

export abstract class Pawns {

    role: string;
    x: number;
    y: number;
    firstMove: boolean;
    possiblePoints: any;
    lastSlot: any;
    yourTurn: boolean;
    radius = 40;
    detectRadius = 45;
    lastPosX;
    lastPosY;
    settedPosition = true;

    strategy: IStrategy;
    state: PawnState;
    currentNodeId: any; 

    
    constructor(public gameManager: GameService, public graphService: GraphService, x: number, y: number){
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;

        
        this.state = GlobalPawnStates.waitingPlacementState;
    }

    
    setStrategy(strat: IStrategy) {
        this.strategy = strat;
    }

    
    place(graph, cops = [], thiefs = []) {
        const pos = this.strategy.placement(graph, cops, thiefs);
        if (pos) {
            this.updatePosition(pos);
            
            
            this.currentNodeId = (pos as any).id !== undefined ? (pos as any).id : pos.index;
            this.x = pos.x;
            this.y = pos.y;

            this.lastSlot = pos;
            this.settedPosition = true;
            this.firstMove = false;
            this.state = GlobalPawnStates.waitingTurnState;
        }
    }

    
    move(graph, cops = [], thiefs = [], c = undefined) {
        if(this.hasPlayed()) {
            return Promise.resolve(false);
        }
        return new Promise(resolve => {
            setTimeout(() => {
                this.moveCallback(graph, cops, thiefs, c)
                resolve(true);
            }, 2000)
        })
    }

    protected moveCallback(graph, cops, thiefs, c) {
        const speed = this.role.includes('thief') ? this.gameManager.getThiefSpeed() : 1;
        const pos = this.strategy.move(graph, cops, thiefs, speed, c);
        
        
        if (pos) {
            this.updatePosition(pos);
            this.currentNodeId = (pos as any).id !== undefined ? (pos as any).id : (pos.index !== undefined ? pos.index : this.currentNodeId);
            this.x = pos.x !== undefined ? pos.x : this.x;
            this.y = pos.y !== undefined ? pos.y : this.y;
            this.lastSlot = pos;
        }

        this.settedPosition = true;
        this.firstMove = false;
        this.state = GlobalPawnStates.waitingTurnState;
    }

    
    undoMove(startPosition) {
        this.x = startPosition.x;
        this.y = startPosition.y;
        this.currentNodeId = startPosition.id !== undefined ? startPosition.id : startPosition.index;
        this.state = GlobalPawnStates.onTurnState;
        this.lastSlot = startPosition;
    }

    
    dragstarted(event, d) {
        this.state.dragstarted(event, d);
    }

    
    dragged(event, d) {
        this.state.dragged(event, d);
    }

    
    dragended(event, d) {
        this.state = this.state.dragended(event, d, this.gameManager);
        this.gameManager.update();
    }

    
    isWaitingPlacement() {
        return this.state === GlobalPawnStates.waitingPlacementState;
    }

    
    hasPlayed() {
        return this.state === GlobalPawnStates.waitingTurnState;
    }

    
    onTurn() {
        return this.state === GlobalPawnStates.onTurnState;
    }

    
    isAtSamePostionAs(pawn: Pawns) {
        if (this.currentNodeId === undefined || this.currentNodeId === null || this.currentNodeId === -1) return false;
        if (pawn.currentNodeId === undefined || pawn.currentNodeId === null || pawn.currentNodeId === -1) return false;
        return String(this.currentNodeId) === String(pawn.currentNodeId);
    }

    
    abstract updatePosition(node)

}