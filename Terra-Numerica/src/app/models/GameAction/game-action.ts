export class GameAction {
    private pawn: any;
    private startPosition;
    private endPosition;

    
    constructor(pawn, start, end) {
        this.pawn = pawn;
        this.startPosition = start;
        this.endPosition = end;
    }

    cancelAction() {
        this.pawn.undoMove(this.startPosition);
        
        const speed = this.pawn.role.includes('thief') ? this.pawn.gameManager.getThiefSpeed() : 1
        
        
    }

    getPawn() {
        return this.pawn;
    }

    getStartPosition() {
        return this.startPosition;
    }

    getEndPosition() {
        return this.endPosition;
    }
}