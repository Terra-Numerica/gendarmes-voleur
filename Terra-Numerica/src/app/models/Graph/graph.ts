import { index, SimulationNodeDatum } from 'd3';
import * as d3 from 'd3';

export abstract class Graph {
    private _typology: string;
    private _nodes;
    private _links;
    private _svgNodes;
    private _svgLinks;
    protected simulation;
    protected movingCircleOriginalPosition;
    protected allowedToMove = false;

    constructor(nodes, links, typology: string) {
        this._nodes = [...nodes];
        this._links = [...links];   
        this._typology = typology;
    }

    setAllowedToMove(allowedToMove: boolean) {
        this.allowedToMove = allowedToMove
    }

    
    
    draw(svg: any) {
        

        this.svgLinks = svg.selectAll("line")
            .data(this.links)
            .join("line")
                .style("stroke", "#aaa")

        this.svgNodes = svg.selectAll("circle")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .attr("index", d => d.index)
                .style("fill", "#69b3a2")
                .call(
                    d3.drag()
                    .on('start', (event: DragEvent) => {
                        
                        this.dragstarted(event)
                    })
                    .on('drag', (event: DragEvent) => {
                        this.dragged(event)
                    })
                    .on('end', (event: DragEvent) => {
                        this.dragended(event)
                    })
                )
        
        this.simulate(svg);

    }

    
    dragstarted(event) {
      if(this.allowedToMove) {
        
        this.movingCircleOriginalPosition = {
          x: event.sourceEvent.target.cx.baseVal.value,
          y: event.sourceEvent.target.cy.baseVal.value
        }
        
        d3.select(event.sourceEvent.target).attr('stroke', 'black');
      }
    }

    dragged(event) {
      if(this.allowedToMove) {
        const circle = event.sourceEvent.target
        d3.select(circle).raise().attr("cx", event.x).attr("cy", event.y);
      }
    }

    dragended(event) {
        if(this.allowedToMove) {
            const circle = d3.select(event.sourceEvent.target)
            circle.attr('stroke', null);
            
            this.moveNode(this.movingCircleOriginalPosition, {x: +circle.attr('cx'), y: +circle.attr('cy')})
        }
    }

    moveNode(movingCircle, endPosition) {
        const nodeIndex = this.nodes.findIndex(node => this.checkApproximativeCirclePosition(node, movingCircle))

        this.links.forEach((link) => {
            
            if (link.source.index === nodeIndex || link.source === nodeIndex) {
                const lines = d3.selectAll('line').nodes();
                for(const l of lines) {
                    const tmp = d3.select(l);
                    if((tmp.attr('x1') == link.source.x && tmp.attr('y1') == link.source.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x1', endPosition.x).attr('y1', endPosition.y)
                        break;
                    }
                }
            } else if (link.target.index === nodeIndex || link.target === nodeIndex) {
                const lines = d3.selectAll('line').nodes();
                for(const l of lines) {
                    const tmp = d3.select(l);
                    if((tmp.attr('x2') == link.target.x && tmp.attr('y2') == link.target.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x2', endPosition.x).attr('y2', endPosition.y)
                        break;
                    }
                }
            }
        })

        const circles = d3.selectAll('circle')
        for(const circle of circles) {
            const tmp = d3.select(circle)
            if(tmp.attr('index') == nodeIndex) {
                tmp.attr('cx', endPosition.x).attr('cy', endPosition.y)
            }
        }

        this.nodes[nodeIndex].x = endPosition.x
        this.nodes[nodeIndex].y = endPosition.y
    }

    private checkApproximativeCirclePosition(originalPosition, newPosition) {
        return (originalPosition.x -1 < newPosition.x && newPosition.x < originalPosition.x + 1) 
                && (originalPosition.y -1 < newPosition.y && newPosition.y < originalPosition.y + 1)
    }

    
    abstract simulate(svg: any): void;

    abstract stop();

    
    abstract ticked(): void;

    

    getRandomEdge(): SimulationNodeDatum {
        return {...this._nodes[this.getRandomInt(this._nodes.length)]};
    }

    
    edges(node, speed = 1, exclude= []): SimulationNodeDatum[] {
        const edges = [];
        if (!node) return edges;

        
        if((node as any).index === undefined && (node as any).__data__) {
            node = (node as any).__data__
        }
        
        const nodeIndex = (node as any).id !== undefined ? (node as any).id : (node as any).index;

        if (nodeIndex === undefined) return edges;

        for(const l of this._links) {
            let source = l.source;
            let target = l.target;

            
            const sIndex = (source && source.index !== undefined) ? source.index : ((source && source.id !== undefined) ? source.id : source);
            const tIndex = (target && target.index !== undefined) ? target.index : ((target && target.id !== undefined) ? target.id : target);

            if(sIndex === nodeIndex) {
                const neighbor = this._nodes.find(n => ((n as any).id !== undefined ? (n as any).id : n.index) === tIndex);
                if (neighbor) edges.push(neighbor);
            } else if (tIndex === nodeIndex) {
                const neighbor = this._nodes.find(n => ((n as any).id !== undefined ? (n as any).id : n.index) === sIndex);
                if (neighbor) edges.push(neighbor);
            }
        }
        if(speed > 1) {
            return this.globalEdges(edges, --speed, exclude)
        }
        return edges;
    }

    private globalEdges(edges, speed, exclude = []) {
        let result: any[] = [...edges];
        let new_edges = [...edges];
        while(speed !== 0) {
            const tmp = [];
            for(const e of new_edges) {
                if(!exclude.includes(e)) {
                    this.edges(e).forEach(n => {
                        const nId = (n as any).id !== undefined ? (n as any).id : n.index;
                        if(!result.find(el => ((el as any).id !== undefined ? (el as any).id : el.index) === nId) && !exclude.some(el => ((el as any).id !== undefined ? (el as any).id : el.index) === nId)) {
                            result.push(n);
                            tmp.push(n)
                        } 
                    })
                }
            }
            new_edges = tmp;
            speed--;
        }
        return result;
    }

    
    getRandomAccessibleEdges(n, speed) {
        const edges = this.edges(n, speed);
        if (edges.length === 0) return n;
        return edges[this.getRandomInt(edges.length)];
    }

    distance(n1, n2) {
        if (!n1 || n2 === undefined || n2 === null) return -1;
        const n1Id = (n1 as any).id !== undefined ? (n1 as any).id : (n1 as any).index;
        const n2Id = (n2 as any).id !== undefined ? (n2 as any).id : ((n2 as any).index !== undefined ? (n2 as any).index : +n2);

        let distance = 0;
        let marked = [];
        marked.push(n1Id);
        if(n1Id === n2Id) {
            return distance;
        }

        let edges = this.edges(n1).filter(e => {
            const eId = (e as any).id !== undefined ? (e as any).id : e.index;
            return !(marked.includes(eId));
        });
        
        while(edges.length > 0) {
            distance++;
            for(const e of edges) {
                const eId = (e as any).id !== undefined ? (e as any).id : e.index;
                if(eId == n2Id) return distance;
            }
            const save =  edges;
            edges = []
            for(const e of save) {
                const eId = (e as any).id !== undefined ? (e as any).id : e.index;
                this.edges(e).forEach(edge => {
                    const edgeId = (edge as any).id !== undefined ? (edge as any).id : edge.index;
                    if (!(marked.includes(edgeId))) {
                        let isIn = false
                        for(const i of edges) {
                            if(((i as any).id !== undefined ? (i as any).id : i.index) === edgeId) {
                                isIn = true;
                            }
                        }
                        if(!isIn) edges.push(edge)
                    }
                })
                marked.push(eId);
            }
        }
        return -1;
    }

    

    
    get nodes() {
        return this._nodes
    }

    get links() {
        return this._links
    }

    get typology(): string {
        return this._typology
    }

    get svgNodes() {
        return this._svgNodes
    }

    get svgLinks() {
        return this._svgLinks
    }

    

    set nodes(n) {
        this._nodes = n;
    }

    set links(l) {
        this._links = l;
    }

    set typology(type: string) {
        this._typology = type;
    }

    set svgNodes(nodes) {
        this._svgNodes = nodes
    }

    set svgLinks(links) {
        this._svgLinks = links
    }

    
    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
