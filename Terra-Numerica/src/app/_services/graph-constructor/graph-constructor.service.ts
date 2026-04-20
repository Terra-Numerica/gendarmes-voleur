import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

type GraphPosition = { x: number; y: number };
type GraphLink = { source: GraphPosition; target: GraphPosition };
type GraphNode = GraphPosition & { index?: number };

@Injectable({
  providedIn: 'root'
})
export class GraphConstructorService {
  readonly tools = ['add-node', 'add-link', 'remove', 'move'];
  readonly originalNodeColor = '#69b3a2';
  readonly selectedNodeColor = 'red';

  private graphTypes = {
    tree: 'Arbre',
    cycle: 'Cycle',
    grid: 'Grille',
    tore: 'Grille Torique',
    specific: 'Conserver position des noeuds',
    random: 'Autre',
  };

  private nodes: GraphNode[] = [];
  private links: GraphLink[] = [];

  constructor() {}

  enterFilename(): Promise<string> {
    return new Promise<string>((resolve) => {
      Swal.fire({
        title: 'Enregistrer sous...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        input: 'text',
        inputLabel: 'Nom du fichier',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          resolve(result.value);
        }
      });
    });
  }

  async selectGraphType(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Type du graphe',
      input: 'select',
      inputOptions: this.graphTypes,
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed === true) {
      let args: number[] = [];

      switch (result.value) {
        case 'grid':
        case 'tore':
          args = await this.selectGridProperties();
          break;
        case 'tree':
          args = await this.selectTreeProperty();
          break;
        default:
          break;
      }

      return this.save(result.value, args);
    }

    return false;
  }

  private async selectGridProperties(): Promise<number[]> {
    const res: number[] = [];

    const resultSwal = await Swal.fire({
      title: 'Définir les propriétés de la grille',
      html:
        '<label>Longueur : </label><input id="swal-input1" class="swal2-input" type="number" min="3" value="3" /><br>' +
        '<label>Largeur : </label><input id="swal-input2" class="swal2-input" type="number" min="3" value="3"/>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ];
      }
    });

    (resultSwal.value || []).forEach((n: string) => {
      res.push(+n);
    });

    return res;
  }

  private async selectTreeProperty(): Promise<number[]> {
    const res: number[] = [];

    const resultSwal = await Swal.fire({
      title: 'Définir l\'arité de l\'arbre',
      input: 'number',
      inputValue: 2,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    res.push(+resultSwal.value);
    return res;
  }

  toolAction(
    tool: string,
    source: GraphPosition,
    target?: GraphPosition
  ): void {
    switch (tool) {
      case 'add-node':
        this.addNode(source.x, source.y);
        break;

      case 'add-link':
        if (!target) return;
        this.addLink(source, target);
        break;

      case 'remove':
        if (!target) {
          this.removeNode(source.x, source.y);
        } else {
          this.removeLink(source, target);
        }
        break;

      case 'move':
        if (!target) return;
        this.moveNode(source, target);
        break;

      default:
        break;
    }
  }

  save(type: string = '', args: number[] = []): Promise<boolean> {
    return new Promise((resolve) => {
      this.enterFilename().then((filename) => {
        if (filename) {
          const graphJson = this.convertGraphToJsonFile(type, args);
          const blobGraphFromJson = new Blob([graphJson], { type: 'application/json' });
          saveAs(blobGraphFromJson, `${filename}.json`);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  private convertGraphToJsonFile(type: string = '', args: number[] = []): string {
    this.nodes.forEach((node, i) => {
      node.index = i;
    });

    const jsonLinks: { source: number; target: number }[] = [];

    this.links.forEach((link) => {
      jsonLinks.push({
        source: this.foundNodeIndex(link.source),
        target: this.foundNodeIndex(link.target)
      });
    });

    const graphJson: {
      typology: string;
      nodes: GraphNode[];
      links: { source: number; target: number }[];
      width?: number;
      height?: number;
      arity?: number;
    } = {
      typology: 'specific',
      nodes: this.nodes,
      links: jsonLinks,
    };

    switch (type) {
      case 'grid':
      case 'tore':
        graphJson.width = args[0];
        graphJson.height = args[1];
        break;
      case 'tree':
        graphJson.arity = args[0];
        break;
      default:
        break;
    }

    return JSON.stringify(graphJson, null, 2);
  }

  private foundNodeIndex(nodePosition: GraphPosition): number {
    return this.nodes.findIndex(
      node => node.x === nodePosition.x && node.y === nodePosition.y
    );
  }

  private addNode(x: number, y: number): void {
    const node: GraphNode = { x, y };
    this.nodes.push(node);
  }

  private addLink(source: GraphPosition, target: GraphPosition): void {
    const link: GraphLink = { source, target };
    this.links.push(link);
  }

  private removeNode(x: number, y: number): void {
    this.nodes = this.nodes.filter(node => node.x !== x || node.y !== y);
  }

  private removeLink(source: GraphPosition, target: GraphPosition): void {
    this.links = this.links.filter(
      link =>
        !this.checkCirclePosition(link.source, source) ||
        !this.checkCirclePosition(link.target, target)
    );
  }

  private moveNode(movingCircle: GraphPosition, endPosition: GraphPosition): void {
    const nodeIndex = this.nodes.findIndex(
      node => node.x === movingCircle.x && node.y === movingCircle.y
    );

    if (nodeIndex === -1) return;

    this.nodes[nodeIndex].x = endPosition.x;
    this.nodes[nodeIndex].y = endPosition.y;

    this.links.forEach(link => {
      if (this.checkCirclePosition(link.source, movingCircle)) {
        link.source.x = endPosition.x;
        link.source.y = endPosition.y;
      } else if (this.checkCirclePosition(link.target, movingCircle)) {
        link.target.x = endPosition.x;
        link.target.y = endPosition.y;
      }
    });
  }

  private checkCirclePosition(c1: GraphPosition, c2: GraphPosition): boolean {
    return c1.x === c2.x && c1.y === c2.y;
  }

  reset(): void {
    this.nodes = [];
    this.links = [];
  }
}