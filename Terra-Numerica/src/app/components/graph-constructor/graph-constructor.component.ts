import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { GraphConstructorService } from 'src/app/_services/graph-constructor/graph-constructor.service';
import { TranslateService } from 'src/app/_services/translate/translate.service';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GraphNode3D {
  id: number;
  mesh: THREE.Mesh;
}

interface GraphLink3D {
  source: GraphNode3D;
  target: GraphNode3D;
  line: THREE.Line;
}

@Component({
  selector: 'app-graph-constructor',
  templateUrl: './graph-constructor.component.html',
  styleUrls: ['./graph-constructor.component.scss']
})
export class GraphConstructorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  public selected_tool: string = 'add-node';
  public tools: string[] = [];
  public zoom_level: number = 0;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private animationFrameId = 0;

  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private intersectionPoint = new THREE.Vector3();

  private nodeGeometry = new THREE.SphereGeometry(0.35, 32, 32);

  private nodes: GraphNode3D[] = [];
  private links: GraphLink3D[] = [];
  private nextNodeId = 1;

  private placing_link = false;
  private from: GraphNode3D | null = null;

  private draggedNode: GraphNode3D | null = null;
  private movingNodeOriginalPosition: { x: number; y: number } | null = null;

  private readonly defaultNodeColor = 0x66cdaa;
  private readonly selectedNodeColor = 0x05b800;

  constructor(
    private translator: TranslateService,
    private graphConstructorService: GraphConstructorService
  ) {}

  ngAfterViewInit(): void {
    this.tools = this.graphConstructorService.tools;
    this.initGraphEdition();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.controls?.dispose();
    this.renderer?.dispose();
  }

  private initGraphEdition(): void {
    this.graphConstructorService.reset();
    this.selected_tool = this.tools[0];

    const host = this.canvas.nativeElement;
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f6fa);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, -12, 12);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.innerHTML = '';
    host.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(10, 10, 14);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.35);
    dirLight2.position.set(-8, -10, 8);
    this.scene.add(dirLight2);

    const grid = new THREE.GridHelper(40, 40, 0xd0d0d0, 0xe7ebf2);
    grid.rotation.x = Math.PI / 2;
    this.scene.add(grid);

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      })
    );
    planeMesh.name = 'interaction-plane';
    this.scene.add(planeMesh);

    this.renderer.domElement.addEventListener('click', this.onCanvasClick);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.onResize);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    if (!this.renderer || !this.camera) return;

    const host = this.canvas.nativeElement;
    const width = host.clientWidth || 800;
    const height = host.clientHeight || 600;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onCanvasClick = (event: MouseEvent): void => {
    if (this.draggedNode) return;

    if (this.selected_tool === 'add-node') {
      const point = this.getPointOnPlane(event, this.groundPlane);
      if (!point) return;

      this.drawNode({ x: point.x, y: point.y });
    } else {
      const clickedNode = this.getClickedNode(event);
      if (clickedNode) {
        this.handleClickOnNode(clickedNode);
        return;
      }

      const clickedLine = this.getClickedLine(event);
      if (clickedLine) {
        this.handleClickOnLink(clickedLine);
      }
    }
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (this.selected_tool !== 'move') return;

    const node = this.getClickedNode(event);
    if (!node) return;

    this.draggedNode = node;
    this.controls.enabled = false;

    this.movingNodeOriginalPosition = {
      x: node.mesh.position.x,
      y: node.mesh.position.y
    };

    (node.mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x222222);
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (this.selected_tool !== 'move' || !this.draggedNode) return;

    const point = this.getPointOnPlane(event, this.dragPlane);
    if (!point) return;

    this.draggedNode.mesh.position.set(point.x, point.y, 0);
    this.updateLinksForNode(this.draggedNode);
  };

  private onPointerUp = (): void => {
    if (this.selected_tool !== 'move' || !this.draggedNode || !this.movingNodeOriginalPosition) {
      return;
    }

    const node = this.draggedNode;

    const endPosition = {
      x: node.mesh.position.x,
      y: node.mesh.position.y
    };

    this.graphConstructorService.toolAction(
      this.selected_tool,
      this.movingNodeOriginalPosition,
      endPosition
    );

    this.draggedNode = null;
    this.movingNodeOriginalPosition = null;
    this.controls.enabled = true;
  }

  private drawNode(position: { x: number; y: number }): void {
    this.graphConstructorService.toolAction(this.selected_tool, position);

    const material = new THREE.MeshStandardMaterial({
      color: this.defaultNodeColor,
      metalness: 0.35,
      roughness: 0.35,
      transparent: true,
      opacity: 0.95
    });

    const mesh = new THREE.Mesh(this.nodeGeometry, material);
    mesh.position.set(position.x, position.y, 0);
    mesh.userData['type'] = 'node';

    this.scene.add(mesh);

    this.nodes.push({
      id: this.nextNodeId++,
      mesh
    });
  }

  private handleClickOnNode(node: GraphNode3D): void {
    switch (this.selected_tool) {
      case 'add-link':
        if (!this.placing_link) {
          this.highlightNode(node, true);
          this.from = node;
        } else {
          if (this.from && this.from !== node) {
            this.drawLink(this.from, node);
          }
          this.from = null;
          this.resetNodeColor();
        }
        this.placing_link = !this.placing_link;
        break;

      case 'remove':
        this.removeNode(node);
        break;
    }
  }

  private drawLink(from: GraphNode3D, to: GraphNode3D): void {
    const fromPosition = this.convertNodeToPosition(from);
    const toPosition = this.convertNodeToPosition(to);

    this.graphConstructorService.toolAction(this.selected_tool, fromPosition, toPosition);

    const points = [
      new THREE.Vector3(fromPosition.x, fromPosition.y, 0),
      new THREE.Vector3(toPosition.x, toPosition.y, 0)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xd0d0d0
    });

    const line = new THREE.Line(geometry, material);
    line.userData['type'] = 'link';

    this.scene.add(line);
    this.links.push({ source: from, target: to, line });
  }

  private removeNode(node: GraphNode3D): void {
    const toDelete = this.links.filter(
      link => link.source === node || link.target === node
    );

    for (const link of toDelete) {
      this.removeLine(link);
    }

    this.scene.remove(node.mesh);
    node.mesh.geometry.dispose();
    (node.mesh.material as THREE.Material).dispose();

    this.nodes = this.nodes.filter(n => n !== node);

    this.graphConstructorService.toolAction(
      this.selected_tool,
      this.convertNodeToPosition(node)
    );
  }

  private removeLine(link: GraphLink3D): void {
    const source = this.convertNodeToPosition(link.source);
    const target = this.convertNodeToPosition(link.target);

    this.scene.remove(link.line);
    link.line.geometry.dispose();
    (link.line.material as THREE.Material).dispose();

    this.links = this.links.filter(l => l !== link);

    this.graphConstructorService.toolAction(this.selected_tool, source, target);
  }

  private handleClickOnLink(line: GraphLink3D): void {
    if (this.selected_tool === 'remove') {
      this.removeLine(line);
    }
  }

  private updateLinksForNode(node: GraphNode3D): void {
    this.links.forEach(link => {
      if (link.source !== node && link.target !== node) return;

      const points = [
        new THREE.Vector3(link.source.mesh.position.x, link.source.mesh.position.y, 0),
        new THREE.Vector3(link.target.mesh.position.x, link.target.mesh.position.y, 0)
      ];

      link.line.geometry.dispose();
      link.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    });
  }

  private getClickedNode(event: MouseEvent | PointerEvent): GraphNode3D | null {
    this.updateMouse(event);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.nodes.map(n => n.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (!intersects.length) return null;

    const mesh = intersects[0].object as THREE.Mesh;
    return this.nodes.find(n => n.mesh === mesh) || null;
  }

  private getClickedLine(event: MouseEvent): GraphLink3D | null {
    this.updateMouse(event);

    this.raycaster.params.Line = { threshold: 0.15 };
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const lines = this.links.map(l => l.line);
    const intersects = this.raycaster.intersectObjects(lines, false);

    if (!intersects.length) return null;

    const line = intersects[0].object as THREE.Line;
    return this.links.find(l => l.line === line) || null;
  }

  private getPointOnPlane(
    event: MouseEvent | PointerEvent,
    plane: THREE.Plane
  ): THREE.Vector3 | null {
    this.updateMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const result = this.raycaster.ray.intersectPlane(plane, this.intersectionPoint);
    return result ? this.intersectionPoint.clone() : null;
  }

  private updateMouse(event: MouseEvent | PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private convertNodeToPosition(node: GraphNode3D): { x: number; y: number } {
    return {
      x: node.mesh.position.x,
      y: node.mesh.position.y
    };
  }

  private resetNodeColor(): void {
    this.nodes.forEach(node => this.highlightNode(node, false));
  }

  private highlightNode(node: GraphNode3D, selected: boolean): void {
    const material = node.mesh.material as THREE.MeshStandardMaterial;
    material.color.setHex(selected ? this.selectedNodeColor : this.defaultNodeColor);
  }

  isSelectedTool(tool: string): string {
    return this.selected_tool === tool ? `${tool} selected` : `${tool}`;
  }

  selectTool(tool: string): void {
    if (this.selected_tool === tool) return;

    this.resetNodeColor();
    this.placing_link = false;
    this.from = null;
    this.selected_tool = tool;
  }

  getToolName(tool: string): string {
    return this.translator.graphConstructorToolsName(tool);
  }

  saveGraph(): void {
    this.graphConstructorService.save().then(success => {
      if (success === true) {
        this.resetGraphEdition();
      }
    });
  }

  resetGraphEdition(): void {
    this.nodes.forEach(node => {
      this.scene.remove(node.mesh);
      node.mesh.geometry.dispose();
      (node.mesh.material as THREE.Material).dispose();
    });

    this.links.forEach(link => {
      this.scene.remove(link.line);
      link.line.geometry.dispose();
      (link.line.material as THREE.Material).dispose();
    });

    this.nodes = [];
    this.links = [];
    this.from = null;
    this.placing_link = false;
    this.nextNodeId = 1;

    this.graphConstructorService.reset();
    this.selected_tool = this.tools[0];
  }
}