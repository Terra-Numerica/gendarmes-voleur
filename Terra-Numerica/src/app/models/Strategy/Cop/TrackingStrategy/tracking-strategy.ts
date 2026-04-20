import { Graph } from 'src/app/models/Graph/graph';
import { IStrategy } from '../../istrategy';


export class TrackingStrategy implements IStrategy {
    actual_place: any;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed) {
        let closest;
        let distance = graph.nodes.length + 1;
        let edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        
        
        edges = edges.filter(e => {
            const eId = (e as any).id !== undefined ? (e as any).id : e.index;
            return !cops_position_slot.some(c => {
                if (!c) return false;
                const cId = (c as any).id !== undefined ? (c as any).id : (c.index !== undefined ? c.index : c);
                return cId === eId;
            });
        });

        
        if (edges.length === 0) {
            edges = [this.actual_place];
        }

        for(const e of edges) {
            let globalDist = 0;
            for(const t of thiefs_position_slot) {
                if (!t) continue;
                const d = graph.distance(e, t);
                globalDist += d !== -1 ? d : 0;
            }

            if(!closest || globalDist <= distance) {
                closest = e;
                distance = globalDist;
            }
        }
        this.actual_place = closest || this.actual_place;
        return this.actual_place;
    }
}
