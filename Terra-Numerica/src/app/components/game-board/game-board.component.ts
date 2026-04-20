import {Component,OnInit,ElementRef,ViewChild,AfterViewInit,OnDestroy,HostListener,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { GameAction } from 'src/app/models/GameAction/game-action';
import { AdventureService } from 'src/app/_services/Adventure/adventure.service';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { GlobalPawnStates } from 'src/app/models/Pawn/PawnState/pawn-states';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('visualizer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private warningZone = false;
  private thiefs: Thief[] = [];
  private cops: Cops[] = [];
  public gameMode: any;
  private isAdventure = false;
  public movingNodes = false;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private orbitControls!: OrbitControls;
  private dragControls!: DragControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private nodeMeshes: THREE.Mesh[] = [];
  private pawnSprites: THREE.Sprite[] = [];
  private nodeMeshMap = new Map<string, THREE.Mesh>();

  private animationFrameId = 0;
  private _lerpTarget = new THREE.Vector3();
  private isAnimating = false;

  private readonly nodeRadius = 0.42;
  private readonly edgeRadius = 0.09;
  private readonly gridSpacing = 2.8;
  private readonly wrapOffset = 1.15;
  private readonly wrapHeight = 1.1;
  private readonly nodeZ = 0.35;
  private readonly pawnZ = 1.25;

  constructor(
    private graphService: GraphService,
    public gameManager: GameService,
    private activatedRoute: ActivatedRoute,
    private adventureService: AdventureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.gameMode = params['gameMode'];
      this.isAdventure = params['adventure'] === 'true';
      this.gameManager.setIsAdventure(this.isAdventure);
    });

    if (this.canvasContainer?.nativeElement) {
      this.canvasContainer.nativeElement.style.visibility = 'hidden';
    }
  }

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.initGameLogic();
    this.drawGraph3D();
    this.initDragControls();

    if (this.canvasContainer?.nativeElement) {
      this.canvasContainer.nativeElement.style.visibility = 'visible';
    }

    this.animate();
    this.gameManager.update();
    this.cdr.detectChanges();
  }

  private initThreeJs(): void {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f6fa);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, -10, 18);
    this.camera.lookAt(0, 0, 0);

    this.addLights();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.minDistance = 8;
    this.orbitControls.maxDistance = 40;
    this.orbitControls.maxPolarAngle = Math.PI / 2.05;
    this.orbitControls.update();

    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onMouseClick(e));
  }

  private addLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.72));

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(10, 10, 14);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.35);
    dirLight2.position.set(-8, -10, 8);
    this.scene.add(dirLight2);
  }

  private getNodeId(node: any): string {
    return String(node.id !== undefined ? node.id : node.index);
  }

  private getEdgeEndpointId(endpoint: any): string {
    if (endpoint?.id !== undefined) return String(endpoint.id);
    if (endpoint?.index !== undefined) return String(endpoint.index);
    return String(endpoint);
  }

  private getGridDimensions(graphData: any, nodeCount: number): { width: number; height: number } {
    const width = graphData.width || Math.ceil(Math.sqrt(nodeCount));
    const height = graphData.height || Math.ceil(nodeCount / width);
    return { width, height };
  }

  private getGridPosition(index: number, width: number, height: number): THREE.Vector3 {
    return new THREE.Vector3(
      (index % width - (width - 1) / 2) * this.gridSpacing,
      -(Math.floor(index / width) - (height - 1) / 2) * this.gridSpacing,
      this.nodeZ
    );
  }

  private getGridBounds(width: number, height: number): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return {
      left: -((width - 1) / 2) * this.gridSpacing,
      right: ((width - 1) / 2) * this.gridSpacing,
      top: ((height - 1) / 2) * this.gridSpacing,
      bottom: -((height - 1) / 2) * this.gridSpacing
    };
  }

  private getIndexFromId(graphData: any, id: string): number {
    return graphData.nodes.findIndex((n: any) => this.getNodeId(n) === id);
  }

  private isHorizontalWrapEdge(sourceIndex: number, targetIndex: number, width: number): boolean {
    const sRow = Math.floor(sourceIndex / width);
    const tRow = Math.floor(targetIndex / width);
    const sCol = sourceIndex % width;
    const tCol = targetIndex % width;

    return sRow === tRow && Math.abs(sCol - tCol) === width - 1;
  }

  private isVerticalWrapEdge(
    sourceIndex: number,
    targetIndex: number,
    width: number,
    height: number
  ): boolean {
    const sRow = Math.floor(sourceIndex / width);
    const tRow = Math.floor(targetIndex / width);
    const sCol = sourceIndex % width;
    const tCol = targetIndex % width;

    return sCol === tCol && Math.abs(sRow - tRow) === height - 1;
  }

  drawNodeGraph3D(nodeData: any, x: number, y: number, z: number = this.nodeZ): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(this.nodeRadius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x66cdaa,
      metalness: 0.35,
      roughness: 0.35,
      transparent: true,
      opacity: 0.95
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    const id = nodeData.id !== undefined ? nodeData.id : nodeData.index;
    mesh.userData = {
      id: String(id),
      infosNode: nodeData
    };

    this.scene.add(mesh);
    return mesh;
  }

  drawEdgeGraph3D(sourcePos: THREE.Vector3, targetPos: THREE.Vector3, edgeData: any): THREE.Mesh {
    const distance = sourcePos.distanceTo(targetPos);

    const geometry = new THREE.CylinderGeometry(this.edgeRadius, this.edgeRadius, distance, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      metalness: 0.2,
      roughness: 0.75
    });

    const cylinder = new THREE.Mesh(geometry, material);
    const midpoint = new THREE.Vector3().addVectors(sourcePos, targetPos).multiplyScalar(0.5);

    cylinder.position.copy(midpoint);
    cylinder.lookAt(targetPos);
    cylinder.rotateX(Math.PI / 2);

    cylinder.userData = {
      sourceId: this.getEdgeEndpointId(edgeData.source),
      targetId: this.getEdgeEndpointId(edgeData.target),
      isEdge: true,
      isWrapEdge: false
    };

    this.scene.add(cylinder);
    return cylinder;
  }

  private drawToroidalWrapEdge3D(
    sourcePos: THREE.Vector3,
    targetPos: THREE.Vector3,
    edgeData: any,
    sourceIndex: number,
    targetIndex: number,
    width: number,
    height: number
  ): THREE.Mesh {
    const bounds = this.getGridBounds(width, height);

    const sourceCol = sourceIndex % width;
    const targetCol = targetIndex % width;
    const sourceRow = Math.floor(sourceIndex / width);
    const targetRow = Math.floor(targetIndex / width);

    let points: THREE.Vector3[] = [];

    if (this.isHorizontalWrapEdge(sourceIndex, targetIndex, width)) {
      const outerX =
        (sourceCol === 0 || targetCol === 0)
          ? bounds.left - this.wrapOffset
          : bounds.right + this.wrapOffset;

      points = [
        new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
        new THREE.Vector3(outerX, sourcePos.y, this.wrapHeight * 0.45),
        new THREE.Vector3(outerX, sourcePos.y, this.wrapHeight),
        new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
      ];
    } else if (this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)) {
      const outerY =
        (sourceRow === 0 || targetRow === 0)
          ? bounds.top + this.wrapOffset
          : bounds.bottom - this.wrapOffset;

      points = [
        new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
        new THREE.Vector3(sourcePos.x, outerY, this.wrapHeight * 0.45),
        new THREE.Vector3(sourcePos.x, outerY, this.wrapHeight),
        new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
      ];
    } else {
      return this.drawEdgeGraph3D(sourcePos, targetPos, edgeData);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 36, this.edgeRadius * 0.92, 10, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.18,
      roughness: 0.82
    });

    const tube = new THREE.Mesh(geometry, material);
    tube.userData = {
      sourceId: this.getEdgeEndpointId(edgeData.source),
      targetId: this.getEdgeEndpointId(edgeData.target),
      isEdge: true,
      isWrapEdge: true
    };

    this.scene.add(tube);
    return tube;
  }

  drawGraph3D(): void {
    const graphData = this.graphService.getGraph();
    if (!graphData?.nodes?.length) return;

    this.nodeMeshMap.clear();
    this.nodeMeshes = [];

    const nodes = graphData.nodes;
    const typology = graphData.typology;
    const { width, height } = this.getGridDimensions(graphData, nodes.length);

    nodes.forEach((node: any, index: number) => {
      let position = new THREE.Vector3();

      switch (typology) {
        case 'grid':
        case 'tore':
          position = this.getGridPosition(index, width, height);
          break;

        case 'cycle': {
          const angle = (index / nodes.length) * Math.PI * 2;
          const radius = Math.max(5, nodes.length * 0.5);
          position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            this.nodeZ
          );
          break;
        }

        case 'tree': {
          const level = Math.floor(Math.log2(index + 1));
          const posInLevel = index - (Math.pow(2, level) - 1);
          const nodesInLevel = Math.pow(2, level);
          position.set(
            (posInLevel - nodesInLevel / 2 + 0.5) * (20 / nodesInLevel),
            10 - level * 3,
            this.nodeZ
          );
          break;
        }

        default:
          if (
              node.x !== undefined &&
              node.y !== undefined &&
              !isNaN(node.x) &&
              !isNaN(node.y)
            ) {
              position = this.getSpecificGraphPosition(node, nodes);
          } else {
              const a = (index / nodes.length) * Math.PI * 2;
              const r = 10;
              position.set(r * Math.cos(a), r * Math.sin(a), this.nodeZ);
          }
          break;
      }

      const nodeMesh = this.drawNodeGraph3D(node, position.x, position.y, position.z);
      const id = node.id !== undefined ? node.id : node.index;

      this.nodeMeshMap.set(String(id), nodeMesh);
      this.nodeMeshes.push(nodeMesh);
    });

    const edges = Array.isArray(graphData.links)
      ? graphData.links
      : (Array.isArray(graphData['edges']) ? graphData['edges'] : []);

    edges.forEach((edge: any) => {
      const sourceId = this.getEdgeEndpointId(edge.source);
      const targetId = this.getEdgeEndpointId(edge.target);

      const sourceMesh = this.nodeMeshMap.get(sourceId);
      const targetMesh = this.nodeMeshMap.get(targetId);

      if (!sourceMesh || !targetMesh) return;

      if (typology === 'tore') {
        const sourceIndex = this.getIndexFromId(graphData, sourceId);
        const targetIndex = this.getIndexFromId(graphData, targetId);

        if (
          this.isHorizontalWrapEdge(sourceIndex, targetIndex, width) ||
          this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)
        ) {
          this.drawToroidalWrapEdge3D(
            sourceMesh.position.clone(),
            targetMesh.position.clone(),
            edge,
            sourceIndex,
            targetIndex,
            width,
            height
          );
        } else {
          this.drawEdgeGraph3D(
            sourceMesh.position.clone(),
            targetMesh.position.clone(),
            edge
          );
        }
      } else {
        this.drawEdgeGraph3D(
          sourceMesh.position.clone(),
          targetMesh.position.clone(),
          edge
        );
      }
    });
  }

  initGameLogic(): void {
    this.gameManager.setValidateTurnCallback(this.validateTurn.bind(this));
    this.gameManager.setDisplayWarningZone(this.seeWarningZone.bind(this));

    this.cops = [];
    this.thiefs = [];

    for (let i = 0; i < this.gameManager.getCopsNumber(); i++) {
      this.cops.push(new Cops(this.gameManager, this.graphService, -12, i * 2, i));
    }

    this.thiefs.push(new Thief(this.gameManager, this.graphService, -12, -5));

    this.gameManager.setGameMode(this.gameMode);
    this.graphService.setGameMode(this.gameMode);
    this.gameManager.setPawns(this.thiefs, this.cops);
    this.gameManager.calculateMaxTurnCount();

    this.initPawnsVisuals3D();
  }

  private initPawnsVisuals3D(): void {
    const loader = new THREE.TextureLoader();

    const thiefTexture = loader.load('assets/board/thief.svg');
    const policeTexture = loader.load('assets/board/police.svg');

    const thiefMat = new THREE.SpriteMaterial({ map: thiefTexture, transparent: true });
    const policeMat = new THREE.SpriteMaterial({ map: policeTexture, transparent: true });

    this.pawnSprites = [];

    this.thiefs.forEach(thief => {
      const sprite = new THREE.Sprite(thiefMat.clone());
      sprite.scale.set(1.5, 1.5, 1);
      sprite.position.set(-12, 5, this.pawnZ);
      sprite.userData = { logicPawn: thief, type: 'thief' };
      this.scene.add(sprite);
      this.pawnSprites.push(sprite);
    });

    this.cops.forEach(cop => {
      const sprite = new THREE.Sprite(policeMat.clone());
      sprite.scale.set(1.5, 1.5, 1);
      sprite.position.set(-12, 0, this.pawnZ);
      sprite.userData = { logicPawn: cop, type: 'cop' };
      this.scene.add(sprite);
      this.pawnSprites.push(sprite);
    });

    thiefMat.dispose();
    policeMat.dispose();
  }

  private onMouseClick(event: PointerEvent): void {
    if (this.movingNodes || this.isAnimating) return;

    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodeMeshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      this.handleNodeClick(Number(clickedMesh.userData['id']));
    }
  }

  private handleNodeClick(nodeId: any): void {
    const graph = this.graphService.getGraph();
    const clickedNode: any = graph.nodes.find(
      (n: any) => String(n.id !== undefined ? n.id : n.index) === String(nodeId)
    );
    if (!clickedNode) return;

    if (!this.gameManager.gameHasStarted()) {
      const aiSide = this.gameManager.getAiSide();
      let pawnToPlace: any = null;

      if (aiSide === 'cops') {
        if (this.gameManager.copsArePlaced()) {
          pawnToPlace = this.thiefs.find(t => t.isWaitingPlacement());
        }
      } else if (aiSide === 'thief') {
        pawnToPlace = this.cops.find(c => c.isWaitingPlacement());
      } else {
        pawnToPlace =
          this.cops.find(c => c.isWaitingPlacement()) ||
          this.thiefs.find(t => t.isWaitingPlacement());
      }

      if (pawnToPlace) {
        const normalizedId = clickedNode.id !== undefined
          ? Number(clickedNode.index)
          : Number(clickedNode.index);

        pawnToPlace.currentNodeId = normalizedId;
        pawnToPlace.updatePosition(clickedNode);
        pawnToPlace.state = GlobalPawnStates.waitingTurnState;
        this.gameManager.update();
      }
    } else if (this.gameManager.isPlayerTurn()) {
      const isThiefTurn = this.gameManager.isThiefTurn();
      let activePawn = [...this.cops, ...this.thiefs].find(p => p.onTurn());

      if (!activePawn) {
        activePawn = isThiefTurn
          ? this.thiefs.find(t => !t.hasPlayed())
          : this.cops.find(c => !c.hasPlayed());
      }

      if (activePawn) {
        const currentNode: any = graph.nodes.find(
          (n: any) => String(n.id !== undefined ? n.id : n.index) === String(activePawn.currentNodeId)
        );

        const speed = activePawn.role.includes('thief')
          ? this.gameManager.getThiefSpeed()
          : 1;

        const accessibleNodes = this.graphService.showPossibleMove({ __data__: currentNode }, speed);
        const isAccessible = accessibleNodes.some(
          (n: any) => String(n.id !== undefined ? n.id : n.index) === String(nodeId)
        );

        if (isAccessible) {
          const normalizedId = clickedNode.id !== undefined
            ? Number(clickedNode.id)
            : Number(clickedNode.index);

          this.gameManager.addGameAction(new GameAction(activePawn, currentNode, clickedNode));
          activePawn.currentNodeId = normalizedId;

          if (activePawn instanceof Thief) {
            this.gameManager.updateThiefPosition(activePawn, clickedNode);
          } else {
            this.gameManager.updateCopsPosition(activePawn, clickedNode);
          }

          activePawn.state = GlobalPawnStates.waitingTurnState;
          this.gameManager.update();
        }
      }
    }
  }

  private updateStraightEdgeTransform(
    mesh: THREE.Mesh,
    sourcePos: THREE.Vector3,
    targetPos: THREE.Vector3
  ): void {
    const geometry = mesh.geometry as THREE.CylinderGeometry;
    const baseHeight = geometry.parameters.height || 1;
    const distance = sourcePos.distanceTo(targetPos);
    const midpoint = new THREE.Vector3().addVectors(sourcePos, targetPos).multiplyScalar(0.5);

    mesh.position.copy(midpoint);
    mesh.lookAt(targetPos);
    mesh.rotateX(Math.PI / 2);
    mesh.scale.set(1, distance / baseHeight, 1);
  }

  private rebuildWrapEdgeGeometry(
    mesh: THREE.Mesh,
    sourcePos: THREE.Vector3,
    targetPos: THREE.Vector3,
    sourceId: string,
    targetId: string,
    graphData: any,
    width: number,
    height: number
  ): void {
    const sourceIndex = this.getIndexFromId(graphData, sourceId);
    const targetIndex = this.getIndexFromId(graphData, targetId);

    const bounds = this.getGridBounds(width, height);
    const sourceCol = sourceIndex % width;
    const targetCol = targetIndex % width;
    const sourceRow = Math.floor(sourceIndex / width);
    const targetRow = Math.floor(targetIndex / width);

    let points: THREE.Vector3[] = [];

    if (this.isHorizontalWrapEdge(sourceIndex, targetIndex, width)) {
      const outerX =
        (sourceCol === 0 || targetCol === 0)
          ? bounds.left - this.wrapOffset
          : bounds.right + this.wrapOffset;

      points = [
        new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
        new THREE.Vector3(outerX, sourcePos.y, this.wrapHeight * 0.45),
        new THREE.Vector3(outerX, sourcePos.y, this.wrapHeight),
        new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
      ];
    } else if (this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)) {
      const outerY =
        (sourceRow === 0 || targetRow === 0)
          ? bounds.top + this.wrapOffset
          : bounds.bottom - this.wrapOffset;

      points = [
        new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
        new THREE.Vector3(sourcePos.x, outerY, this.wrapHeight * 0.45),
        new THREE.Vector3(sourcePos.x, outerY, this.wrapHeight),
        new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
      ];
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const newGeometry = new THREE.TubeGeometry(curve, 36, this.edgeRadius * 0.92, 10, false);
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
  }

  private updateLinesPositions(): void {
    const graphData = this.graphService.getGraph();
    const typology = graphData?.typology;
    const { width, height } = this.getGridDimensions(graphData, graphData?.nodes?.length || 0);

    this.scene.children.forEach(child => {
      if (!child.userData['isEdge']) return;

      const edgeMesh = child as THREE.Mesh;
      const sourceId = String(edgeMesh.userData['sourceId']);
      const targetId = String(edgeMesh.userData['targetId']);

      const sourceMesh = this.nodeMeshes.find(m => String(m.userData['id']) === sourceId);
      const targetMesh = this.nodeMeshes.find(m => String(m.userData['id']) === targetId);

      if (!sourceMesh || !targetMesh) return;

      if (typology === 'tore' && edgeMesh.userData['isWrapEdge']) {
        this.rebuildWrapEdgeGeometry(
          edgeMesh,
          sourceMesh.position.clone(),
          targetMesh.position.clone(),
          sourceId,
          targetId,
          graphData,
          width,
          height
        );
      } else {
        this.updateStraightEdgeTransform(
          edgeMesh,
          sourceMesh.position.clone(),
          targetMesh.position.clone()
        );
      }
    });
  }

  moveNodeMode(): void {
    this.movingNodes = !this.movingNodes;
    this.graphService.movingPermission(this.movingNodes);

    if (this.dragControls) {
      this.dragControls.enabled = this.movingNodes;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getTurnCount() {
    return this.gameManager.getTurnCount();
  }

  getRemainingTurnCount() {
    return this.gameManager.getRemainingTurnCount();
  }

  isGameActionEmpty() {
    return this.gameManager.isGameActionEmpty();
  }

  cancelAction(): void {
    const lastAction = this.gameManager.peekAction();
    const success = this.gameManager.cancelAction();

    if (success && lastAction) {
      const pawn = lastAction.getPawn();
      const startNode = lastAction.getStartPosition();
      const restoredId = startNode.id !== undefined ? Number(startNode.id) : Number(startNode.index);

      pawn.currentNodeId = restoredId;
      pawn.undoMove(startNode);
    }

    this.cdr.detectChanges();
  }

  gameHasStarted() {
    return this.gameManager.gameHasStarted();
  }

  getMovingNodeClass() {
    return this.movingNodes ? 'moving' : '';
  }

  isPlayerTurn() {
    return this.gameManager.isPlayerTurn();
  }

  isNodeMoveable() {
    return !(this.graphService.getTypology() === 'grid' || this.graphService.getTypology() === 'tore');
  }

  seeWarningZone(): void {
    this.warningZone = !this.warningZone;
  }

  private getSpecificGraphPosition(node: any, allNodes: any[]): THREE.Vector3 {
    const validNodes = allNodes.filter(
      (n: any) =>
        n.x !== undefined &&
        n.y !== undefined &&
        !isNaN(n.x) &&
        !isNaN(n.y)
    );

    if (validNodes.length === 0) {
      return new THREE.Vector3(0, 0, this.nodeZ);
    }

    const minX = Math.min(...validNodes.map((n: any) => n.x));
    const maxX = Math.max(...validNodes.map((n: any) => n.x));
    const minY = Math.min(...validNodes.map((n: any) => n.y));
    const maxY = Math.max(...validNodes.map((n: any) => n.y));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);
    const maxSpan = Math.max(spanX, spanY);

    let scale = 1;

    
    if (maxSpan > 50) {
      scale = 18 / maxSpan;
    } 
    
    else {
      scale = 2.5;
    }

    return new THREE.Vector3(
      (node.x - centerX) * scale,
      -(node.y - centerY) * scale,
      this.nodeZ
    );
  }

  async validateTurn(): Promise<void> {
    if (this.isAnimating) return;

    this.warningZone = false;
    const res = await this.gameManager.validateTurn();

    if (res && res.gameTimer !== undefined) {
      res.gameTimer = Math.trunc(res.gameTimer / 1000);

      if (res.wonByPlayer !== undefined || res.result?.isConfirmed) {
        if (res.isAdventure) {
          if (res.wonByPlayer || res.result?.isConfirmed) {
            if (await this.adventureService.goToNextLevel()) {
              this.replay();
            } else {
              this.gameManager.reset();
            }
          } else {
            Swal.fire('Réssayer', 'Échec.', 'error').then(() => this.replay());
          }
        } else {
          this.replay();
        }
      } else if (!res.result?.isConfirmed) {
        this.gameManager.goBackToMenu();
      }
    }
  }

  updateNodesColor(): void {
    const dangerousNodes = new Set<string>();
    const accessibleNodes = new Set<string>();
    const graphData = this.graphService.getGraph();

    if (this.warningZone) {
      this.cops.forEach(cop => {
        if (cop.currentNodeId !== undefined && cop.currentNodeId !== -1) {
          dangerousNodes.add(String(cop.currentNodeId));

          const node = graphData.nodes.find(
            (n: any) => String(n.id !== undefined ? n.id : n.index) === String(cop.currentNodeId)
          );

          if (node) {
            this.graphService.edges(node).forEach((neighbor: any) => {
              dangerousNodes.add(String(neighbor.id !== undefined ? neighbor.id : neighbor.index));
            });
          }
        }
      });
    }

    if (this.gameManager.isPlayerTurn() && this.gameManager.gameHasStarted()) {
      const isThiefTurn = this.gameManager.isThiefTurn();
      const activePawn =
        [...this.cops, ...this.thiefs].find(p => p.onTurn()) ||
        (isThiefTurn ? this.thiefs.find(t => !t.hasPlayed()) : this.cops.find(c => !c.hasPlayed()));

      if (activePawn && activePawn.currentNodeId !== undefined && activePawn.currentNodeId !== -1) {
        const node = graphData.nodes.find(
          (n: any) => String(n.id !== undefined ? n.id : n.index) === String(activePawn.currentNodeId)
        );

        if (node) {
          const speed = activePawn.role.includes('thief') ? this.gameManager.getThiefSpeed() : 1;
          this.graphService.showPossibleMove({ __data__: node }, speed).forEach((n: any) => {
            accessibleNodes.add(String(n.id !== undefined ? n.id : n.index));
          });
        }
      }
    }

    this.nodeMeshes.forEach(mesh => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const nodeId = String(mesh.userData['id']);

      if (this.warningZone && dangerousNodes.has(nodeId)) {
        material.color.set(0xff0000);
      } else if (accessibleNodes.has(nodeId)) {
        material.color.set(0x05b800);
      } else {
        material.color.set(0x66cdaa);
      }

      material.needsUpdate = true;
    });
  }

  initDragControls(): void {
    this.dragControls = new DragControls(this.nodeMeshes, this.camera, this.renderer.domElement);
    this.dragControls.enabled = this.movingNodes;

    this.dragControls.addEventListener('dragstart', (event: any) => {
      this.orbitControls.enabled = false;
      const material = event.object.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(0x333333);
    });

    this.dragControls.addEventListener('dragend', (event: any) => {
      this.orbitControls.enabled = true;

      const material = event.object.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(0x000000);

      const mesh = event.object as THREE.Mesh;
      if (mesh.userData['infosNode']) {
        mesh.userData['infosNode'].x = mesh.position.x;
        mesh.userData['infosNode'].y = mesh.position.y;
      }
    });
  }

  replay(): void {
    this.gameManager.replay().then(() => {
      this.scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          Array.isArray(obj.material)
            ? obj.material.forEach((m: any) => m.dispose())
            : obj.material.dispose();
        }
      });

      this.scene.clear();
      this.addLights();
      this.nodeMeshes = [];
      this.pawnSprites = [];
      this.nodeMeshMap.clear();

      this.drawGraph3D();
      this.initGameLogic();
      this.gameManager.update();
      this.cdr.detectChanges();
    });
  }

  private updatePawnsPositions3D(): void {
    let stillAnimating = false;

    this.pawnSprites.forEach(sprite => {
      const logicPawn = sprite.userData['logicPawn'];

      if (
        logicPawn.currentNodeId === undefined ||
        logicPawn.currentNodeId === null ||
        logicPawn.currentNodeId === -1
      ) {
        return;
      }

      const targetNode = this.nodeMeshes.find(
        mesh => String(mesh.userData['id']) === String(logicPawn.currentNodeId)
      );

      if (!targetNode) return;

      const material = sprite.material as THREE.SpriteMaterial;
      const hasPlayed = logicPawn.state === GlobalPawnStates.waitingTurnState;
      material.opacity = (hasPlayed && !this.gameManager.isPlayerTurn()) ? 0.5 : 1;

      this._lerpTarget.set(targetNode.position.x, targetNode.position.y, this.pawnZ);

      if (sprite.position.distanceTo(this._lerpTarget) > 0.05) {
        sprite.position.lerp(this._lerpTarget, 0.1);
        stillAnimating = true;
      } else {
        sprite.position.copy(this._lerpTarget);
      }
    });

    this.isAnimating = stillAnimating;
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.movingNodes) {
      this.updateLinesPositions();
    }

    this.updatePawnsPositions3D();
    this.updateNodesColor();
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }

  displayInfo(): void {
    Swal.fire({
      title: 'Règles',
      text: 'Capturez le voleur !',
      icon: 'info'
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.scene?.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        Array.isArray(obj.material)
          ? obj.material.forEach((m: any) => m.dispose())
          : obj.material.dispose();
      }
    });

    this.dragControls?.dispose();
    this.orbitControls?.dispose();
    this.renderer?.dispose();
  }
}