import * as d3 from 'd3';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { RunawayStrategy } from '../../Strategy/Thief/RunawayStrategy/runaway-strategy';
import { Pawns } from '../pawn';

export class Thief extends Pawns {

    
    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number){
        super(gameM, graphServ, x, y);
        this.role = "thief"
        this.strategy = new RunawayStrategy();
        
        
    }

    updatePosition(node: any) {
        if (node) {
            this.currentNodeId = node.id !== undefined ? Number(node.id) : Number(node.index);
            this.gameM.updateThiefPosition(this, node);
        }
    }
}