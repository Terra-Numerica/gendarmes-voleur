import { IStrategy } from '../../istrategy';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { Graph } from 'src/app/models/Graph/graph';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { GameService } from 'src/app/_services/game/game.service';


export class GridStrategy implements IStrategy {
    actual_place: any; 
    cops_placement: string;

    constructor(private graphService: GraphService, private gameService: GameService){}

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let nodes = this.graphService.getNodes();
        let grid;
        if (graph.typology === "grid"){
            grid = graph as Grid;
        }
        let first_pos
        let next_pos

        if(this.gameService.getCopsNumber() === grid.width){
            this.cops_placement = 'vertical';
            first_pos = 0;
            next_pos = 1;
        }else if(this.gameService.getCopsNumber() >= grid.height - 1){
            this.cops_placement = 'horizontal';
            first_pos = grid.width - 1;
            next_pos = grid.width;
        }else{
            this.cops_placement = 'horizontal1/3';
            first_pos = grid.width - 1;
            next_pos = grid.width * 3;
        }

        if(cops_position_slot.length === 0){
            this.actual_place = nodes[first_pos];

        }else{
            let last_pos = cops_position_slot[cops_position_slot.length - 1];
            this.actual_place = nodes[last_pos.index + next_pos]

        }
        if(this.actual_place === undefined){
            this.actual_place = nodes[first_pos]
            console.log(first_pos)

        }
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed) {
        let nodes = this.graphService.getNodes();
        let closest;
        let grid;
        if (graph.typology === "grid"){
            grid = graph as Grid;
        }
        switch (this.cops_placement) {
            case 'vertical':
                if(nodes[this.actual_place.index + grid.width] !== undefined){
                    this.actual_place = nodes[this.actual_place.index + grid.width]
                }
                break;
            case 'horizontal':
                if(nodes[this.actual_place.index - 1] !== undefined){
                    this.actual_place = nodes[this.actual_place.index - 1]
                }
                break;
            case 'horizontal1/3':
                if(nodes[this.actual_place.index - 1] !== undefined){
                    this.actual_place = nodes[this.actual_place.index - 1]
                }               
                break;
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        return this.actual_place;
    }

}
