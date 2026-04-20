import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomGraphService {

  private graphs: any[] = [];

  constructor() {
    this.loadGraphs();
  }

  loadGraphs() {
    this.graphs = [];
  }

  getRandomGraph() {
    if (!this.graphs || this.graphs.length === 0) {
      return {
        nodes: [],
        links: []
      };
    }

    return this.graphs[this.getRandomInt(this.graphs.length)];
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}