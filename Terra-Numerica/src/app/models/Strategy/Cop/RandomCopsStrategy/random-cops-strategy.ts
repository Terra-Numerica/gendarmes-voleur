import { Graph } from "src/app/models/Graph/graph";
import { IStrategy } from "../../istrategy";

export class RandomCopsStrategy implements IStrategy {
    actual_place = null;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed = 1) {
        let vertex = null;
        const availableEdges = graph.edges(this.actual_place, speed);
        
        
        for (const n of availableEdges) {
            for(const p of thiefs_position_slot) {
                if(p && graph.distance(n, p) === 0) {
                    vertex = n;
                    break;
                }
            }
            if (vertex) break;
        }

        if(vertex === null) vertex = graph.getRandomAccessibleEdges(this.actual_place, speed);

        this.actual_place = vertex;
        return this.actual_place;
    }
}
