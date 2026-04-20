import { Graph } from "../graph";
import * as d3 from 'd3';

export class Specific extends Graph {

    private config;
    private isParsed;

    constructor(nodes, links) {
        super(nodes, links, 'specific');
        this.config = localStorage.getItem('config');
        this.isParsed = false;
    }

    draw(svg) {
        if (this.isParsed === false && this.config) {
            this.config = JSON.parse(this.config);
            this.isParsed = true;
        }

        this.svgLinks = svg.selectAll('links')
            .data(this.links)
            .join('line')
                .attr('x1', d => this.nodes[d.source].x)
                .attr('y1', d => this.nodes[d.source].y)
                .attr('x2', d => this.nodes[d.target].x)
                .attr('y2', d => this.nodes[d.target].y)
                .attr('source-index', d => this.nodes[d.source].index)
                .attr('target-index', d => this.nodes[d.target].index)
                .style('stroke', 'rgb(170, 170, 170)');

        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .attr("index", d => d.index)
                .style("fill", "#69b3a2")
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .call(
                    d3.drag()
                    .on('start', (event: DragEvent) => {
                        this.dragstarted(event);
                    })
                    .on('drag', (event: DragEvent) => {
                        this.dragged(event);
                    })
                    .on('end', (event: DragEvent) => {
                        this.dragended(event);
                    })
                );

        this.simulate(svg);
    }

    simulate(svg) {
        this.simulation = d3.forceSimulation(this.nodes)
            .on("end", this.ticked.bind(this));
    }

    stop() {
        this.simulation.stop();
    }

    ticked() {
        this.svgLinks
            .attr("x1", d => this.nodes[d.source].x)
            .attr("y1", d => this.nodes[d.source].y)
            .attr("x2", d => this.nodes[d.target].x)
            .attr("y2", d => this.nodes[d.target].y);

        this.svgNodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }
}