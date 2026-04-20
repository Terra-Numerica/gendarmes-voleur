import { Graph } from '../Graph/graph';

export interface IStrategy {
    
    actual_place: any; 

    
    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]): any;
    
    
    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed: number, pawn): any;
}
