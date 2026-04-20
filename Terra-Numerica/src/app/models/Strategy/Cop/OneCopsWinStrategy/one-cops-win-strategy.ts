import { IStrategy } from '../../istrategy';
import { Graph } from 'src/app/models/Graph/graph';


export class OneCopsWinStrategy implements IStrategy {
    actual_place: any;   
    thiefFound: boolean = false
    tempo: boolean = false
    lastThiefPos: any;

    constructor(){}

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed) {
        let closest;
        let distance = graph.nodes.length + 1;
        const edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        
        if(!this.thiefFound){
            for(const e of edges) {
                let globalDist = 0;
                const eId = (e as any).id !== undefined ? (e as any).id : e.index;

                for(const t of thiefs_position_slot) {
                    if (!t) continue;
                    const d = graph.distance(e, t);
                    globalDist += d !== -1 ? d : 0;
                    
                    const tId = (t as any).id !== undefined ? (t as any).id : (t.index !== undefined ? t.index : t);
                    let thiefEdges = graph.edges(t);
                    thiefEdges.forEach(thiefedge => {
                        const teId = (thiefedge as any).id !== undefined ? (thiefedge as any).id : thiefedge.index;
                        if(eId === teId){
                            this.tempo = true;
                        }
                    })
                }

                if((!closest || globalDist <= distance) && !this.thiefFound){
                    closest = e;
                    distance = globalDist;
                    if(this.tempo){
                        this.thiefFound = true
                        this.lastThiefPos = thiefs_position_slot[0]
                    }
                }
            }
        } else if(this.thiefFound){
            closest = this.lastThiefPos || edges[0];
            this.lastThiefPos = thiefs_position_slot[0];
        }

        this.actual_place = closest || edges[0];
        return this.actual_place;
    }

}
