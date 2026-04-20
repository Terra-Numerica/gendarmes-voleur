import * as d3 from 'd3';
import { Pawns } from '../pawn';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { GameService } from 'src/app/_services/game/game.service';
import { OneCopsWinStrategy } from '../../Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy';

export class Cops extends Pawns {

    
    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number, id: number){
        super(gameM, graphServ, x, y);
        this.role = "cops"+id
        this.strategy = new OneCopsWinStrategy();
        
        
      }

      updatePosition(node: any) {
        if (node) {
            this.currentNodeId = node.id !== undefined ? Number(node.id) : Number(node.index);
            this.gameM.updateCopsPosition(this, node);
        }
      }
}