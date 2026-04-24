(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "/74g":
/*!**********************************************************!*\
  !*** ./src/app/_services/translate/translate.service.ts ***!
  \**********************************************************/
/*! exports provided: TranslateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslateService", function() { return TranslateService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class TranslateService {
    constructor() { }
    graphTypeName(type) {
        switch (type) {
            case 'grid':
                return 'Grille';
            case 'cycle':
                return 'Cycle';
            case 'tree':
                return 'Arbre';
            case 'copsAlwaysWin':
                return 'Cop-Win';
            case 'random':
                return 'Aléatoire';
            case 'tore':
                return 'Grille torique';
            case 'petersen':
                return 'Petersen';
            case 'dodecahedron':
                return 'Dodécahédron';
            default:
                return '';
        }
    }
    opponentTypeName(type) {
        switch (type) {
            case 'ai':
                return 'Jouer contre un ordinateur';
            case 'player':
                return 'Jouer à 2 joueurs';
            default:
                return '';
        }
    }
    graphConstructorToolsName(tool) {
        switch (tool) {
            case 'add-node':
                return 'Ajouter un sommet';
            case 'add-link':
                return 'Ajouter une arête';
            case 'remove':
                return 'Effacer un élément';
            case 'save':
                return 'Enregistrer';
            case 'move':
                return 'Déplacer un sommet';
            default:
                return '';
        }
    }
}
TranslateService.ɵfac = function TranslateService_Factory(t) { return new (t || TranslateService)(); };
TranslateService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TranslateService, factory: TranslateService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "/zrl":
/*!***************************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/TrackingStrategy/tracking-strategy.ts ***!
  \***************************************************************************/
/*! exports provided: TrackingStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrackingStrategy", function() { return TrackingStrategy; });
class TrackingStrategy {
    placement(graph, cops_position_slot, thiefs_position_slot) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed) {
        let closest;
        let distance = graph.nodes.length + 1;
        let edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        edges = edges.filter(e => {
            const eId = e.id !== undefined ? e.id : e.index;
            return !cops_position_slot.some(c => {
                if (!c)
                    return false;
                const cId = c.id !== undefined ? c.id : (c.index !== undefined ? c.index : c);
                return cId === eId;
            });
        });
        if (edges.length === 0) {
            edges = [this.actual_place];
        }
        for (const e of edges) {
            let globalDist = 0;
            for (const t of thiefs_position_slot) {
                if (!t)
                    continue;
                const d = graph.distance(e, t);
                globalDist += d !== -1 ? d : 0;
            }
            if (!closest || globalDist <= distance) {
                closest = e;
                distance = globalDist;
            }
        }
        this.actual_place = closest || this.actual_place;
        return this.actual_place;
    }
}


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\asm38\new\Master_1_uniCa\s2\Terra-Numerica\rendu-gv\gendarmes-voleur\Terra-Numerica\src\main.ts */"zUnb");


/***/ }),

/***/ "026Y":
/*!***************************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/WatchingStrategy/watching-strategy.ts ***!
  \***************************************************************************/
/*! exports provided: WatchingStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WatchingStrategy", function() { return WatchingStrategy; });
class WatchingStrategy {
    constructor() {
        this.stay_on_spot = 0;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        let nextTo = true;
        while (nextTo) {
            this.actual_place = graph.getRandomEdge();
            nextTo = false;
            for (const c of cops_position_slot) {
                if (graph.distance(this.actual_place, c) <= 1) {
                    nextTo = true;
                    break;
                }
            }
        }
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed, cop) {
        const edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        const width = graph.width;
        const height = graph.height;
        const thief_pos = thiefs_position_slot[0];
        let thief_line = this.getLine(thief_pos.index, width);
        let thief_col = this.getColumn(thief_pos.index, width);
        let cop_line = this.getLine(this.actual_place.index, width);
        let cop_col = this.getColumn(this.actual_place.index, width);
        let vertex_index;
        if (cop.role.includes('0')) {
            if (cop_col === thief_col) {
                if (cop_line > thief_line) {
                    vertex_index = this.moveUp(cop_line, cop_col, width, height);
                }
                else {
                    vertex_index = this.moveDown(cop_line, cop_col, width, height);
                }
            }
            else if (cop_col > thief_col) {
                vertex_index = this.moveRight(cop_line, cop_col, width, height);
            }
            else {
                vertex_index = this.moveLeft(cop_line, cop_col, width, height);
            }
        }
        else {
            if (cop_line === thief_line) {
                if (cop_col > thief_col) {
                    vertex_index = this.moveRight(cop_line, cop_col, width, height);
                }
                else {
                    vertex_index = this.moveLeft(cop_line, cop_col, width, height);
                }
            }
            else if (cop_line > thief_line) {
                vertex_index = this.moveUp(cop_line, cop_col, width, height);
            }
            else {
                vertex_index = this.moveDown(cop_line, cop_col, width, height);
            }
        }
        const v = edges.find(e => e.index === vertex_index);
        this.actual_place = v;
        return this.actual_place;
    }
    moveRight(line, col, width, height) {
        const l = line;
        const c = (col - 1 >= 0) ? col - 1 : col;
        return (l * width) + c;
    }
    moveLeft(line, col, width, height) {
        const l = line;
        const c = (col + 1 < width) ? col + 1 : col;
        return (l * width) + c;
    }
    moveUp(line, col, width, height) {
        const l = (line - 1 >= 0) ? line - 1 : line;
        const c = col;
        return (l * width) + c;
    }
    moveDown(line, col, width, height) {
        const l = (line + 1 < height) ? line + 1 : line;
        const c = col;
        return (l * width) + c;
    }
    getLine(node_index, width) {
        return Math.floor(node_index / width);
    }
    getColumn(node_index, width) {
        return node_index % width;
    }
}


/***/ }),

/***/ "0HIH":
/*!****************************************************************!*\
  !*** ./src/app/_services/random-graph/random-graph.service.ts ***!
  \****************************************************************/
/*! exports provided: RandomGraphService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomGraphService", function() { return RandomGraphService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class RandomGraphService {
    constructor() {
        this.graphs = [];
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
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
RandomGraphService.ɵfac = function RandomGraphService_Factory(t) { return new (t || RandomGraphService)(); };
RandomGraphService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: RandomGraphService, factory: RandomGraphService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "0yLw":
/*!**************************************************!*\
  !*** ./src/app/_services/score/score.service.ts ***!
  \**************************************************/
/*! exports provided: ScoreService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScoreService", function() { return ScoreService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class ScoreService {
    constructor() {
        this.base_score_folder = '/assets/score/';
    }
    getScoreImage(winner_side, ai_side, graph_typology, cops_number) {
        const score = this.calculateScore(winner_side, ai_side, graph_typology, cops_number);
        return `${this.base_score_folder}${score}.svg`;
    }
    calculateScore(winner_side, ai_side, graph_typology, cops_number) {
        let score = '3_stars';
        if (ai_side && (winner_side === ai_side)) {
            score = '0_star';
        }
        else {
            switch (graph_typology) {
                case 'grid':
                    score = this.calculateGridScore(winner_side, ai_side, cops_number);
                    break;
                case 'tore':
                    break;
                case 'cycle':
                    break;
                case 'tree':
                    break;
                default:
                    break;
            }
        }
        return score;
    }
    calculateGridScore(winner_side, ai_side, cops_number) {
        let score = '3_stars';
        if (winner_side === 'cops') {
            if (cops_number <= 2)
                score = '3_stars';
            else if (cops_number <= 4)
                score = '2_stars';
            else
                score = '1_star';
        }
        else if (winner_side === 'thief') {
            if (cops_number <= 2)
                score = '1_star';
            else if (cops_number <= 4)
                score = '2_stars';
            else
                score = '3_score';
        }
        return score;
    }
    calculateToreScore(winner_side, player_side, cops_number) {
        let score;
        return score;
    }
    calculateCycleScore(winner_side, player_side, cops_number) {
        let score;
        return score;
    }
    calculateTreeScore(winner_side, player_side, cops_number) {
        let score;
        return score;
    }
    calculateDefaultScore(winner_side, player_side, cops_number) {
        let score;
        return score;
    }
}
ScoreService.ɵfac = function ScoreService_Factory(t) { return new (t || ScoreService)(); };
ScoreService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ScoreService, factory: ScoreService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "1+hw":
/*!*********************************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy.ts ***!
  \*********************************************************************************/
/*! exports provided: OneCopsWinStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OneCopsWinStrategy", function() { return OneCopsWinStrategy; });
class OneCopsWinStrategy {
    constructor() {
        this.thiefFound = false;
        this.tempo = false;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed) {
        let closest;
        let distance = graph.nodes.length + 1;
        const edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        if (!this.thiefFound) {
            for (const e of edges) {
                let globalDist = 0;
                const eId = e.id !== undefined ? e.id : e.index;
                for (const t of thiefs_position_slot) {
                    if (!t)
                        continue;
                    const d = graph.distance(e, t);
                    globalDist += d !== -1 ? d : 0;
                    const tId = t.id !== undefined ? t.id : (t.index !== undefined ? t.index : t);
                    let thiefEdges = graph.edges(t);
                    thiefEdges.forEach(thiefedge => {
                        const teId = thiefedge.id !== undefined ? thiefedge.id : thiefedge.index;
                        if (eId === teId) {
                            this.tempo = true;
                        }
                    });
                }
                if ((!closest || globalDist <= distance) && !this.thiefFound) {
                    closest = e;
                    distance = globalDist;
                    if (this.tempo) {
                        this.thiefFound = true;
                        this.lastThiefPos = thiefs_position_slot[0];
                    }
                }
            }
        }
        else if (this.thiefFound) {
            closest = this.lastThiefPos || edges[0];
            this.lastThiefPos = thiefs_position_slot[0];
        }
        this.actual_place = closest || edges[0];
        return this.actual_place;
    }
}


/***/ }),

/***/ "2X9m":
/*!***********************************************!*\
  !*** ./src/app/models/Graph/Common/common.ts ***!
  \***********************************************/
/*! exports provided: Common */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Common", function() { return Common; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graph */ "Z/gq");


class Common extends _graph__WEBPACK_IMPORTED_MODULE_1__["Graph"] {
    constructor(nodes, links, type = 'common') {
        super(nodes, links, type);
    }
    simulate(svg) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_0__["forceSimulation"](this.nodes)
            .force("link", d3__WEBPACK_IMPORTED_MODULE_0__["forceLink"]()
            .links(this.links)
            .distance(() => 30 / this.links.length))
            .force("center", d3__WEBPACK_IMPORTED_MODULE_0__["forceCenter"](width / 2, height / 2))
            .force("charge", d3__WEBPACK_IMPORTED_MODULE_0__["forceManyBody"]().strength(-500))
            .on("tick", this.ticked.bind(this));
    }
    stop() {
        this.simulation.stop();
    }
    ticked() {
        this.svgLinks
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        this.svgNodes
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}


/***/ }),

/***/ "3pDe":
/*!*****************************************************************************!*\
  !*** ./src/app/models/Pawn/PawnState/PawnStateOnTurn/pawn-state-on-turn.ts ***!
  \*****************************************************************************/
/*! exports provided: PawnStateOnTurn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PawnStateOnTurn", function() { return PawnStateOnTurn; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var src_app_models_GameAction_game_action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/models/GameAction/game-action */ "RsS5");
/* harmony import */ var _pawn_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pawn-states */ "KjiV");



class PawnStateOnTurn {
    constructor() {
        this.edges = null;
    }
    dragstarted(event, d) {
        d.gameManager.displayWarningZone(false);
        const speed = d.role.includes('thief') ? d.gameM.getThiefSpeed() : 1;
        d.lastPosX = event.x;
        d.lastPosY = event.y;
        d.settedPosition = false;
        this.edges = d.graphService.showPossibleMove(d.lastSlot, speed);
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event, d) {
        const speed = d.role.includes('thief') ? d.gameM.getThiefSpeed() : 1;
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("." + d.role).attr("cx", event.x).attr("cy", event.y);
        if (d.graphService.gameMode == "easy" || d.graphService.gameMode == "medium") {
            let edges = this.edges;
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".circle")
                .filter(function (nodeData) {
                return edges.includes(nodeData);
            })
                .each((nodeData, id, elements) => {
                let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                let distance = d.detectRadius;
                if (h <= distance) {
                    d.graphService.showPossibleMoveDragging(elements[id], d.lastSlot);
                }
            });
        }
    }
    dragended(event, d, gameManager) {
        const speed = d.role.includes('thief') ? d.gameM.getThiefSpeed() : 1;
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).attr("stroke", null);
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        };
        let edges = this.edges;
        const startPosition = {
            x: d.lastPosX,
            y: d.lastPosY
        };
        const previousSlot = d.lastSlot;
        let distance = d.detectRadius;
        let node;
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".circle")
            .filter(function (nodeData) {
            return edges.includes(nodeData);
        })
            .each((nodeData, id, elements) => {
            let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
            if (h <= distance) {
                node = nodeData;
                distance = h;
                position.x = nodeData.x;
                position.y = nodeData.y;
                d.settedPosition = true;
                d.possiblePoints = d.graphService.showPossibleMoveDragging(elements[id], d.lastSlot);
                d.lastSlot = elements[id];
            }
        });
        if (startPosition.x !== position.x || startPosition.y !== position.y) {
            gameManager.addGameAction(new src_app_models_GameAction_game_action__WEBPACK_IMPORTED_MODULE_1__["GameAction"](d, startPosition, { x: position.x, y: position.y }));
        }
        else {
            d.settedPosition = false;
        }
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("." + d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);
        d.updatePosition(node);
        if (!d.settedPosition) {
            return this;
        }
        else {
            return _pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].waitingTurnState;
        }
    }
}


/***/ }),

/***/ "6bBq":
/*!***************************************************************************************!*\
  !*** ./src/app/models/Pawn/PawnState/PawnStateWaitingTurn/pawn-state-waiting-turn.ts ***!
  \***************************************************************************************/
/*! exports provided: PawnStateWaitingTurn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PawnStateWaitingTurn", function() { return PawnStateWaitingTurn; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");

class PawnStateWaitingTurn {
    dragstarted(event, d) {
        if ((d.role.includes('cops') && !d.gameM.thiefTurn) || (d.role.includes('thief') && d.gameM.thiefTurn)) {
            d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#top-hud-turn-information-details")
                .append("p")
                .attr("id", "warningNotYourTurn")
                .text(() => "Ce pion a déjà bougé ce tour !");
        }
        else {
            d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#top-hud-turn-information-details")
                .append("p")
                .attr("id", "warningNotYourTurn")
                .text(() => "Ce n'est pas votre tour !");
        }
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event, d) {
    }
    dragended(event, d) {
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]("#warningNotYourTurn").remove();
        return this;
    }
}


/***/ }),

/***/ "7zdo":
/*!***********************************************************************!*\
  !*** ./src/app/components/adventure-menu/adventure-menu.component.ts ***!
  \***********************************************************************/
/*! exports provided: AdventureMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdventureMenuComponent", function() { return AdventureMenuComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_app_services_Adventure_adventure_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/_services/Adventure/adventure.service */ "rB2e");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");




function AdventureMenuComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdventureMenuComponent_div_17_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const adventure_r1 = ctx.$implicit; const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r3.selectAdventure(adventure_r1); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const adventure_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("is-selected", ctx_r0.isSelected(adventure_r1) === "selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-label", adventure_r1.getName());
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](i_r2 + 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", adventure_r1.picture, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"])("alt", adventure_r1.getName());
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](adventure_r1.getName());
} }
class AdventureMenuComponent {
    constructor(router, adventureService) {
        this.router = router;
        this.adventureService = adventureService;
        this.adventures = this.adventureService.getAvailableAdventures();
        this.selected_adventure = null;
    }
    ngOnInit() {
        this.selected_adventure = this.adventures[0];
    }
    selectAdventure(adventure) {
        this.selected_adventure = adventure;
    }
    isSelected(adventure) {
        return this.selected_adventure === adventure ? 'selected' : '';
    }
    launchAdventure() {
        this.adventureService.launchAdventure(this.selected_adventure);
    }
}
AdventureMenuComponent.ɵfac = function AdventureMenuComponent_Factory(t) { return new (t || AdventureMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](src_app_services_Adventure_adventure_service__WEBPACK_IMPORTED_MODULE_2__["AdventureService"])); };
AdventureMenuComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AdventureMenuComponent, selectors: [["app-adventure-menu"]], decls: 24, vars: 2, consts: [[1, "adventure-menu"], ["aria-hidden", "true", 1, "am-bg"], [1, "am-bg__orb", "am-bg__orb--1"], [1, "am-bg__orb", "am-bg__orb--2"], [1, "am-bg__orb", "am-bg__orb--3"], [1, "am-header"], ["routerLink", "/game-mode-selection", "title", "Retour", 1, "am-header__back"], ["src", "assets/arrow.svg", "alt", "retour"], [1, "am-header__center"], [1, "am-header__eyebrow"], [1, "am-header__title"], [1, "am-header__spacer"], [1, "am-subtitle"], [1, "am-selector"], ["class", "am-card", "tabindex", "0", "role", "button", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], [1, "am-footer"], [1, "am-start-btn", 3, "click"], [1, "am-start-btn__label"], [1, "am-start-btn__arrow"], ["tabindex", "0", "role", "button", 1, "am-card", 3, "click"], [1, "am-card__badge"], [1, "am-card__img-wrap"], [1, "am-card__img", 3, "src", "alt"], [1, "am-card__body"], [1, "am-card__name"]], template: function AdventureMenuComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "header", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Terra Numerica");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h1", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Mode Aventure");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Choisissez votre aventure et affrontez des d\u00E9fis progressifs.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "main", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, AdventureMenuComponent_div_17_Template, 8, 7, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "footer", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdventureMenuComponent_Template_button_click_19_listener() { return ctx.launchAdventure(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " \u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.adventures);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Commencer ", ctx.selected_adventure.getName(), "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLink"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"]], styles: ["@charset \"UTF-8\";\n@import url(\"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Nunito:wght@400;500;600;700&display=swap\");\n  body {\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n  background: linear-gradient(180deg, #fbf8f2 0%, #f2ede4 100%);\n  font-family: \"Nunito\", sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.adventure-menu[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100vh;\n  padding: 0 24px 48px;\n  gap: 10px;\n  overflow: hidden;\n  background: radial-gradient(circle at top left, rgba(217, 139, 31, 0.08), transparent 24%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.06), transparent 24%), linear-gradient(180deg, #fbf8f2 0%, #f2ede4 100%);\n  color: #2c241c;\n  font-family: \"Nunito\", sans-serif;\n}\n.am-bg[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.am-bg__orb[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 50%;\n  filter: blur(90px);\n  opacity: 0.12;\n}\n.am-bg__orb--1[_ngcontent-%COMP%] {\n  width: 420px;\n  height: 420px;\n  top: -120px;\n  left: -80px;\n  background: #b38cf0;\n}\n.am-bg__orb--2[_ngcontent-%COMP%] {\n  width: 380px;\n  height: 380px;\n  right: -70px;\n  bottom: -70px;\n  background: #f0b24d;\n}\n.am-bg__orb--3[_ngcontent-%COMP%] {\n  width: 240px;\n  height: 240px;\n  top: 45%;\n  left: 48%;\n  background: #7ec7e8;\n  transform: translate(-50%, -50%);\n  opacity: 0.08;\n}\n\n.am-header__back[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  border: 1.5px solid rgba(26, 22, 18, 0.25);\n  border-radius: 8px;\n  background: #f7f3ed;\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  box-shadow: 0 2px 4px rgba(26, 22, 18, 0.06), 0 8px 24px rgba(26, 22, 18, 0.08);\n  transition: all 0.18s ease;\n}\n.am-header__back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  filter: brightness(0) saturate(100%) invert(8%) sepia(11%) saturate(870%) hue-rotate(349deg) brightness(94%) contrast(96%);\n}\n.am-header__back[_ngcontent-%COMP%]:hover {\n  background: #fdf0ec;\n  border-color: #c0392b;\n  transform: translateX(-3px);\n}\n.am-header[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  max-width: 960px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 24px 0 8px;\n}\n.am-header__center[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 3px;\n}\n.am-header__eyebrow[_ngcontent-%COMP%] {\n  font-size: 0.62rem;\n  font-weight: 700;\n  letter-spacing: 0.2em;\n  text-transform: uppercase;\n  color: #d7a928;\n}\n.am-header__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: clamp(1.6rem, 3vw, 2.2rem);\n  font-weight: 700;\n  color: #2c241c;\n}\n.am-header__spacer[_ngcontent-%COMP%] {\n  width: 64px;\n  flex-shrink: 0;\n}\n.am-subtitle[_ngcontent-%COMP%] {\n  margin: 0 0 24px;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: 0.92rem;\n  font-style: italic;\n  color: #7c6d5d;\n}\n.am-selector[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 16px;\n  width: 100%;\n  max-width: 1000px;\n}\n.am-card[_ngcontent-%COMP%] {\n  width: 172px;\n  padding: 20px 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n  background: rgba(255, 255, 255, 0.82);\n  border: 1.5px solid rgba(80, 60, 30, 0.1);\n  border-radius: 18px;\n  box-shadow: 0 10px 28px rgba(60, 40, 20, 0.08);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.am-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  border-color: #d7a928;\n}\n.am-card__img[_ngcontent-%COMP%] {\n  width: 70px;\n}\n.am-card__name[_ngcontent-%COMP%] {\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: 0.9rem;\n  font-weight: 600;\n  text-align: center;\n}\n.am-footer[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 600px;\n  padding-top: 24px;\n}\n.am-start-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 15px;\n  background: #d7a928;\n  color: white;\n  border: none;\n  border-radius: 999px;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-weight: 700;\n  cursor: pointer;\n}\n.am-start-btn[_ngcontent-%COMP%]:hover {\n  background: #dcb342;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhZHZlbnR1cmUtbWVudS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFBUixvSkFBQTtBQXFCUjtFQUNFLFNBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7RUFDQSw2REFBQTtFQUNBLGlDQVZVO0FBUlo7QUFxQkE7RUFDRSxzQkFBQTtBQWxCRjtBQXFCQTtFQUNFLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtFQUNBLG9CQUFBO0VBQ0EsU0FBQTtFQUNBLGdCQUFBO0VBRUEsaU9BQ0U7RUFJRixjQXBDSztFQXFDTCxpQ0FqQ1U7QUFVWjtBQTBCQTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLG9CQUFBO0FBdkJGO0FBeUJFO0VBQ0Usa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtBQXZCSjtBQTBCRTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsV0FBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtBQXhCSjtBQTJCRTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQXpCSjtBQTRCRTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxtQkFBQTtFQUNBLGdDQUFBO0VBQ0EsYUFBQTtBQTFCSjtBQThCQSw0QkFBQTtBQUNBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSwwQ0FBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLCtFQUFBO0VBQ0EsMEJBQUE7QUEzQkY7QUE2QkU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBIQUFBO0FBM0JKO0FBOEJFO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtFQUNBLDJCQUFBO0FBNUJKO0FBZ0NBO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBRUEsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0FBOUJGO0FBZ0NFO0VBQ0UsT0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQTlCSjtBQWlDRTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0F2SUc7QUF3R1A7QUFrQ0U7RUFDRSxTQUFBO0VBQ0EsK0NBcElTO0VBcUlULHFDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQTFJRztBQTBHUDtBQW1DRTtFQUNFLFdBQUE7RUFDQSxjQUFBO0FBakNKO0FBcUNBO0VBQ0UsZ0JBQUE7RUFDQSwrQ0FsSlc7RUFtSlgsa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGNBdkpTO0FBcUhYO0FBcUNBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7QUFsQ0Y7QUFxQ0E7RUFDRSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFFQSxxQ0FyTFE7RUFzTFIseUNBQUE7RUFDQSxtQkF4S087RUF5S1AsOENBeEtZO0VBMEtaLGVBQUE7RUFDQSx5QkFBQTtBQXBDRjtBQXNDRTtFQUNFLDJCQUFBO0VBQ0EscUJBM0xHO0FBdUpQO0FBdUNFO0VBQ0UsV0FBQTtBQXJDSjtBQXdDRTtFQUNFLCtDQTNMUztFQTRMVCxpQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUF0Q0o7QUEwQ0E7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQXZDRjtBQTBDQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBbk5LO0VBb05MLFlBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSwrQ0EvTVc7RUFnTlgsZ0JBQUE7RUFDQSxlQUFBO0FBdkNGO0FBeUNFO0VBQ0UsbUJBQUE7QUF2Q0oiLCJmaWxlIjoiYWR2ZW50dXJlLW1lbnUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAY2hhcnNldCBcIlVURi04XCI7XG5AaW1wb3J0IHVybChcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9UGxheWZhaXIrRGlzcGxheTppdGFsLHdnaHRAMCw2MDA7MCw3MDA7MSw2MDAmZmFtaWx5PU51bml0bzp3Z2h0QDQwMDs1MDA7NjAwOzcwMCZkaXNwbGF5PXN3YXBcIik7XG46Om5nLWRlZXAgYm9keSB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmYmY4ZjIgMCUsICNmMmVkZTQgMTAwJSk7XG4gIGZvbnQtZmFtaWx5OiBcIk51bml0b1wiLCBzYW5zLXNlcmlmO1xufVxuXG4qIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmFkdmVudHVyZS1tZW51IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgcGFkZGluZzogMCAyNHB4IDQ4cHg7XG4gIGdhcDogMTBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCB0b3AgbGVmdCwgcmdiYSgyMTcsIDEzOSwgMzEsIDAuMDgpLCB0cmFuc3BhcmVudCAyNCUpLCByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGJvdHRvbSByaWdodCwgcmdiYSgxMjQsIDU4LCAyMzcsIDAuMDYpLCB0cmFuc3BhcmVudCAyNCUpLCBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmJmOGYyIDAlLCAjZjJlZGU0IDEwMCUpO1xuICBjb2xvcjogIzJjMjQxYztcbiAgZm9udC1mYW1pbHk6IFwiTnVuaXRvXCIsIHNhbnMtc2VyaWY7XG59XG5cbi5hbS1iZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaW5zZXQ6IDA7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLmFtLWJnX19vcmIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgZmlsdGVyOiBibHVyKDkwcHgpO1xuICBvcGFjaXR5OiAwLjEyO1xufVxuLmFtLWJnX19vcmItLTEge1xuICB3aWR0aDogNDIwcHg7XG4gIGhlaWdodDogNDIwcHg7XG4gIHRvcDogLTEyMHB4O1xuICBsZWZ0OiAtODBweDtcbiAgYmFja2dyb3VuZDogI2IzOGNmMDtcbn1cbi5hbS1iZ19fb3JiLS0yIHtcbiAgd2lkdGg6IDM4MHB4O1xuICBoZWlnaHQ6IDM4MHB4O1xuICByaWdodDogLTcwcHg7XG4gIGJvdHRvbTogLTcwcHg7XG4gIGJhY2tncm91bmQ6ICNmMGIyNGQ7XG59XG4uYW0tYmdfX29yYi0tMyB7XG4gIHdpZHRoOiAyNDBweDtcbiAgaGVpZ2h0OiAyNDBweDtcbiAgdG9wOiA0NSU7XG4gIGxlZnQ6IDQ4JTtcbiAgYmFja2dyb3VuZDogIzdlYzdlODtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIG9wYWNpdHk6IDAuMDg7XG59XG5cbi8qIOKchSBCT1VUT04gUkVUT1VSIENPUlJJR8OJICovXG4uYW0taGVhZGVyX19iYWNrIHtcbiAgd2lkdGg6IDY0cHg7XG4gIGhlaWdodDogNjRweDtcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCByZ2JhKDI2LCAyMiwgMTgsIDAuMjUpO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGJhY2tncm91bmQ6ICNmN2YzZWQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZmxleC1zaHJpbms6IDA7XG4gIGJveC1zaGFkb3c6IDAgMnB4IDRweCByZ2JhKDI2LCAyMiwgMTgsIDAuMDYpLCAwIDhweCAyNHB4IHJnYmEoMjYsIDIyLCAxOCwgMC4wOCk7XG4gIHRyYW5zaXRpb246IGFsbCAwLjE4cyBlYXNlO1xufVxuLmFtLWhlYWRlcl9fYmFjayBpbWcge1xuICB3aWR0aDogMzBweDtcbiAgaGVpZ2h0OiAzMHB4O1xuICBmaWx0ZXI6IGJyaWdodG5lc3MoMCkgc2F0dXJhdGUoMTAwJSkgaW52ZXJ0KDglKSBzZXBpYSgxMSUpIHNhdHVyYXRlKDg3MCUpIGh1ZS1yb3RhdGUoMzQ5ZGVnKSBicmlnaHRuZXNzKDk0JSkgY29udHJhc3QoOTYlKTtcbn1cbi5hbS1oZWFkZXJfX2JhY2s6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZmRmMGVjO1xuICBib3JkZXItY29sb3I6ICNjMDM5MmI7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtM3B4KTtcbn1cblxuLmFtLWhlYWRlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMjtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogOTYwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTZweDtcbiAgcGFkZGluZzogMjRweCAwIDhweDtcbn1cbi5hbS1oZWFkZXJfX2NlbnRlciB7XG4gIGZsZXg6IDE7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogM3B4O1xufVxuLmFtLWhlYWRlcl9fZXllYnJvdyB7XG4gIGZvbnQtc2l6ZTogMC42MnJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMmVtO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBjb2xvcjogI2Q3YTkyODtcbn1cbi5hbS1oZWFkZXJfX3RpdGxlIHtcbiAgbWFyZ2luOiAwO1xuICBmb250LWZhbWlseTogXCJQbGF5ZmFpciBEaXNwbGF5XCIsIEdlb3JnaWEsIHNlcmlmO1xuICBmb250LXNpemU6IGNsYW1wKDEuNnJlbSwgM3Z3LCAyLjJyZW0pO1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogIzJjMjQxYztcbn1cbi5hbS1oZWFkZXJfX3NwYWNlciB7XG4gIHdpZHRoOiA2NHB4O1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLmFtLXN1YnRpdGxlIHtcbiAgbWFyZ2luOiAwIDAgMjRweDtcbiAgZm9udC1mYW1pbHk6IFwiUGxheWZhaXIgRGlzcGxheVwiLCBHZW9yZ2lhLCBzZXJpZjtcbiAgZm9udC1zaXplOiAwLjkycmVtO1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIGNvbG9yOiAjN2M2ZDVkO1xufVxuXG4uYW0tc2VsZWN0b3Ige1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBnYXA6IDE2cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMDBweDtcbn1cblxuLmFtLWNhcmQge1xuICB3aWR0aDogMTcycHg7XG4gIHBhZGRpbmc6IDIwcHggMTZweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuODIpO1xuICBib3JkZXI6IDEuNXB4IHNvbGlkIHJnYmEoODAsIDYwLCAzMCwgMC4xKTtcbiAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgYm94LXNoYWRvdzogMCAxMHB4IDI4cHggcmdiYSg2MCwgNDAsIDIwLCAwLjA4KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xufVxuLmFtLWNhcmQ6aG92ZXIge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XG4gIGJvcmRlci1jb2xvcjogI2Q3YTkyODtcbn1cbi5hbS1jYXJkX19pbWcge1xuICB3aWR0aDogNzBweDtcbn1cbi5hbS1jYXJkX19uYW1lIHtcbiAgZm9udC1mYW1pbHk6IFwiUGxheWZhaXIgRGlzcGxheVwiLCBHZW9yZ2lhLCBzZXJpZjtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmFtLWZvb3RlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDYwMHB4O1xuICBwYWRkaW5nLXRvcDogMjRweDtcbn1cblxuLmFtLXN0YXJ0LWJ0biB7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiAxNXB4O1xuICBiYWNrZ3JvdW5kOiAjZDdhOTI4O1xuICBjb2xvcjogd2hpdGU7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gIGZvbnQtZmFtaWx5OiBcIlBsYXlmYWlyIERpc3BsYXlcIiwgR2VvcmdpYSwgc2VyaWY7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5hbS1zdGFydC1idG46aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZGNiMzQyO1xufSJdfQ== */"] });


/***/ }),

/***/ "81o1":
/*!*******************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/GridStrategy/grid-strategy.ts ***!
  \*******************************************************************/
/*! exports provided: GridStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GridStrategy", function() { return GridStrategy; });
class GridStrategy {
    constructor(graphService, gameService) {
        this.graphService = graphService;
        this.gameService = gameService;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        let nodes = this.graphService.getNodes();
        let grid;
        if (graph.typology === "grid") {
            grid = graph;
        }
        let first_pos;
        let next_pos;
        if (this.gameService.getCopsNumber() === grid.width) {
            this.cops_placement = 'vertical';
            first_pos = 0;
            next_pos = 1;
        }
        else if (this.gameService.getCopsNumber() >= grid.height - 1) {
            this.cops_placement = 'horizontal';
            first_pos = grid.width - 1;
            next_pos = grid.width;
        }
        else {
            this.cops_placement = 'horizontal1/3';
            first_pos = grid.width - 1;
            next_pos = grid.width * 3;
        }
        if (cops_position_slot.length === 0) {
            this.actual_place = nodes[first_pos];
        }
        else {
            let last_pos = cops_position_slot[cops_position_slot.length - 1];
            this.actual_place = nodes[last_pos.index + next_pos];
        }
        if (this.actual_place === undefined) {
            this.actual_place = nodes[first_pos];
            console.log(first_pos);
        }
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed) {
        let nodes = this.graphService.getNodes();
        let closest;
        let grid;
        if (graph.typology === "grid") {
            grid = graph;
        }
        switch (this.cops_placement) {
            case 'vertical':
                if (nodes[this.actual_place.index + grid.width] !== undefined) {
                    this.actual_place = nodes[this.actual_place.index + grid.width];
                }
                break;
            case 'horizontal':
                if (nodes[this.actual_place.index - 1] !== undefined) {
                    this.actual_place = nodes[this.actual_place.index - 1];
                }
                break;
            case 'horizontal1/3':
                if (nodes[this.actual_place.index - 1] !== undefined) {
                    this.actual_place = nodes[this.actual_place.index - 1];
                }
                break;
        }
        return this.actual_place;
    }
}


/***/ }),

/***/ "9Now":
/*!*************************************************************!*\
  !*** ./src/app/models/GameActionStack/game-action-stack.ts ***!
  \*************************************************************/
/*! exports provided: GameActionStack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameActionStack", function() { return GameActionStack; });
class GameActionStack {
    constructor() {
        this.stack = [];
    }
    push(el) {
        this.stack.push(el);
    }
    pop() {
        return this.stack.pop();
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
    isEmpty() {
        return this.stack.length === 0;
    }
    count() {
        return this.stack.length;
    }
    clear() {
        this.stack = [];
    }
    cancelAction() {
        if (this.isEmpty())
            return false;
        const action = this.pop();
        action.cancelAction();
        return true;
    }
}


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
const environment = {
    production: false
};


/***/ }),

/***/ "C/VE":
/*!************************************************!*\
  !*** ./src/app/models/Adventure/difficulty.ts ***!
  \************************************************/
/*! exports provided: Difficulty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Difficulty", function() { return Difficulty; });
var Difficulty;
(function (Difficulty) {
    Difficulty["FACILE"] = "easy";
    Difficulty["NORMAL"] = "medium";
    Difficulty["DIFFICILE"] = "hard";
    Difficulty["EXTREME"] = "extreme";
})(Difficulty || (Difficulty = {}));


/***/ }),

/***/ "Fj4N":
/*!*****************************************************!*\
  !*** ./src/app/components/rules/rules.component.ts ***!
  \*****************************************************/
/*! exports provided: RulesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RulesComponent", function() { return RulesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class RulesComponent {
    constructor() { }
    ngOnInit() {
    }
}
RulesComponent.ɵfac = function RulesComponent_Factory(t) { return new (t || RulesComponent)(); };
RulesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RulesComponent, selectors: [["app-rules"]], decls: 38, vars: 0, consts: [[1, "rules-page"], [1, "rules-header", "card"], ["routerLink", "/game-mode-selection", "aria-label", "Retour", 1, "back-button"], ["src", "assets/arrow.svg", "alt", ""], [1, "subtitle"], [1, "rules-grid"], [1, "rules-card", "card"], [1, "cop"], [1, "robber"], [1, "rules-list"]], template: function RulesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "R\u00E8gles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Gendarmes & Voleur");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "section", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "But du jeu");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Dans ce jeu, deux camps s\u2019affrontent : les ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "gendarmes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " doivent attraper le voleur le plus rapidement possible. Le ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "voleur");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " doit fuir le plus longtemps possible. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Les ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "gendarmes jouent en premier");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, ". Chaque pion peut se d\u00E9placer vers un sommet adjacent ou rester sur sa position. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "section", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Conditions de victoire");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "ul", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Les gendarmes gagnent");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, " si le voleur est attrap\u00E9. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Le voleur gagne");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " s\u2019il survit suffisamment longtemps sans se faire attraper. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLink"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap\");\n  body {\n  background: #f7f3ed;\n}\n.rules-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 56px 24px 80px;\n  background: #f7f3ed;\n  color: #1a1612;\n  font-family: \"Lora\", Georgia, serif;\n}\n.card[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid rgba(26, 22, 18, 0.25);\n  border-radius: 12px;\n  box-shadow: 0 2px 4px rgba(26, 22, 18, 0.06), 0 8px 32px rgba(26, 22, 18, 0.08);\n}\n.rules-header[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto 32px;\n  padding: 28px 36px;\n  display: flex;\n  align-items: center;\n  gap: 22px;\n}\n.rules-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(3rem, 5vw, 4.8rem);\n  font-weight: 600;\n  color: #1a1612;\n  line-height: 1;\n}\n.subtitle[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-family: \"DM Mono\", \"Courier New\", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.35em;\n  text-transform: uppercase;\n  color: #8c8278;\n}\n.back-button[_ngcontent-%COMP%] {\n  width: 74px;\n  height: 74px;\n  border: 1.5px solid rgba(26, 22, 18, 0.25);\n  border-radius: 8px;\n  background: #f7f3ed;\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: background 0.18s, border-color 0.18s, transform 0.15s;\n}\n.back-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 34px;\n  filter: brightness(0) saturate(100%);\n}\n.back-button[_ngcontent-%COMP%]:hover {\n  background: #fdf0ec;\n  border-color: #c0392b;\n  transform: translateX(-3px);\n}\n.rules-grid[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 24px;\n}\n.rules-card[_ngcontent-%COMP%] {\n  padding: 32px 36px;\n}\n.rules-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 22px;\n  font-size: 1.9rem;\n  font-weight: 600;\n  color: #1a1612;\n}\n.rules-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 18px;\n  color: #4a443c;\n  line-height: 1.7;\n  font-size: 1.05rem;\n  font-style: italic;\n}\n.rules-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 24px 0 0;\n  display: grid;\n  gap: 14px;\n}\n.rules-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  background: #f7f3ed;\n  border: 1px solid rgba(26, 22, 18, 0.12);\n  border-radius: 8px;\n  color: #4a443c;\n  line-height: 1.55;\n  font-size: 1.05rem;\n}\n.cop[_ngcontent-%COMP%] {\n  color: #2563eb;\n  font-weight: 700;\n  font-style: normal;\n}\n.robber[_ngcontent-%COMP%] {\n  color: #d97706;\n  font-weight: 700;\n  font-style: normal;\n}\n@media (max-width: 900px) {\n  .rules-page[_ngcontent-%COMP%] {\n    padding: 32px 16px 56px;\n  }\n\n  .rules-header[_ngcontent-%COMP%] {\n    padding: 24px;\n    margin-bottom: 28px;\n  }\n  .rules-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 2.6rem;\n  }\n\n  .rules-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .rules-card[_ngcontent-%COMP%] {\n    padding: 28px 24px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxydWxlcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBUSxpSUFBQTtBQWdCUjtFQUNFLG1CQWZNO0FBQ1I7QUFpQkE7RUFDRSxpQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBckJNO0VBc0JOLGNBcEJJO0VBcUJKLG1DQWJXO0FBRGI7QUFpQkE7RUFDRSxpQkFBQTtFQUNBLHdDQUFBO0VBQ0EsbUJBQUE7RUFDQSwrRUFsQlk7QUFJZDtBQWlCQTtFQUNFLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7QUFkRjtBQWdCRTtFQUNFLFNBQUE7RUFDQSxtQ0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0EzQ0U7RUE0Q0YsY0FBQTtBQWRKO0FBa0JBO0VBQ0UsZ0JBQUE7RUFDQSxnREF6Q1U7RUEwQ1Ysa0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FwRFU7QUFxQ1o7QUFrQkE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFoRU07RUFpRU4sZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGlFQUFBO0FBZkY7QUFpQkU7RUFDRSxXQUFBO0VBQ0Esb0NBQUE7QUFmSjtBQWtCRTtFQUNFLG1CQUFBO0VBQ0EscUJBeEVLO0VBeUVMLDJCQUFBO0FBaEJKO0FBb0JBO0VBQ0UsaUJBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsU0FBQTtBQWpCRjtBQW9CQTtFQUNFLGtCQUFBO0FBakJGO0FBbUJFO0VBQ0UsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0EvRkU7QUE4RU47QUFvQkU7RUFDRSxnQkFBQTtFQUNBLGNBbkdNO0VBb0dOLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtBQWxCSjtBQXNCQTtFQUNFLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLFNBQUE7QUFuQkY7QUFxQkU7RUFDRSxrQkFBQTtFQUNBLG1CQXRISTtFQXVISix3Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsY0F0SE07RUF1SE4saUJBQUE7RUFDQSxrQkFBQTtBQW5CSjtBQXVCQTtFQUNFLGNBMUhLO0VBMkhMLGdCQUFBO0VBQ0Esa0JBQUE7QUFwQkY7QUF1QkE7RUFDRSxjQS9ITztFQWdJUCxnQkFBQTtFQUNBLGtCQUFBO0FBcEJGO0FBdUJBO0VBQ0U7SUFDRSx1QkFBQTtFQXBCRjs7RUF1QkE7SUFDRSxhQUFBO0lBQ0EsbUJBQUE7RUFwQkY7RUFzQkU7SUFDRSxpQkFBQTtFQXBCSjs7RUF3QkE7SUFDRSwwQkFBQTtFQXJCRjs7RUF3QkE7SUFDRSxrQkFBQTtFQXJCRjtBQUNGIiwiZmlsZSI6InJ1bGVzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9TG9yYTppdGFsLHdnaHRAMCw0MDA7MCw2MDA7MSw0MDAmZmFtaWx5PURNK01vbm86d2dodEA0MDA7NTAwJmRpc3BsYXk9c3dhcCcpO1xuXG4kY3JlYW06ICNmN2YzZWQ7XG4kY3JlYW0tZGFyazogI2VkZTdkYztcbiRpbms6ICMxYTE2MTI7XG4kaW5rLW1pZDogIzRhNDQzYztcbiRpbmstbGlnaHQ6ICM4YzgyNzg7XG4kYWNjZW50OiAjYzAzOTJiO1xuJGJsdWU6ICMyNTYzZWI7XG4kb3JhbmdlOiAjZDk3NzA2O1xuJGJvcmRlcjogcmdiYSgyNiwgMjIsIDE4LCAwLjEyKTtcbiRib3JkZXItZGFyazogcmdiYSgyNiwgMjIsIDE4LCAwLjI1KTtcbiRmb250LXNlcmlmOiAnTG9yYScsIEdlb3JnaWEsIHNlcmlmO1xuJGZvbnQtbW9ubzogJ0RNIE1vbm8nLCAnQ291cmllciBOZXcnLCBtb25vc3BhY2U7XG4kc2hhZG93LWNhcmQ6IDAgMnB4IDRweCByZ2JhKDI2LCAyMiwgMTgsIDAuMDYpLCAwIDhweCAzMnB4IHJnYmEoMjYsIDIyLCAxOCwgMC4wOCk7XG5cbjo6bmctZGVlcCBib2R5IHtcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xufVxuXG4ucnVsZXMtcGFnZSB7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBwYWRkaW5nOiA1NnB4IDI0cHggODBweDtcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xuICBjb2xvcjogJGluaztcbiAgZm9udC1mYW1pbHk6ICRmb250LXNlcmlmO1xufVxuXG4uY2FyZCB7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyLWRhcms7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIGJveC1zaGFkb3c6ICRzaGFkb3ctY2FyZDtcbn1cblxuLnJ1bGVzLWhlYWRlciB7XG4gIG1heC13aWR0aDogMTEwMHB4O1xuICBtYXJnaW46IDAgYXV0byAzMnB4O1xuICBwYWRkaW5nOiAyOHB4IDM2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMjJweDtcblxuICBoMSB7XG4gICAgbWFyZ2luOiAwO1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoM3JlbSwgNXZ3LCA0LjhyZW0pO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgY29sb3I6ICRpbms7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gIH1cbn1cblxuLnN1YnRpdGxlIHtcbiAgbWFyZ2luOiAwIDAgMTBweDtcbiAgZm9udC1mYW1pbHk6ICRmb250LW1vbm87XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMzVlbTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgY29sb3I6ICRpbmstbGlnaHQ7XG59XG5cbi5iYWNrLWJ1dHRvbiB7XG4gIHdpZHRoOiA3NHB4O1xuICBoZWlnaHQ6IDc0cHg7XG4gIGJvcmRlcjogMS41cHggc29saWQgJGJvcmRlci1kYXJrO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIGJhY2tncm91bmQ6ICRjcmVhbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMThzLCBib3JkZXItY29sb3IgMC4xOHMsIHRyYW5zZm9ybSAwLjE1cztcblxuICBpbWcge1xuICAgIHdpZHRoOiAzNHB4O1xuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygwKSBzYXR1cmF0ZSgxMDAlKTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICNmZGYwZWM7XG4gICAgYm9yZGVyLWNvbG9yOiAkYWNjZW50O1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtM3B4KTtcbiAgfVxufVxuXG4ucnVsZXMtZ3JpZCB7XG4gIG1heC13aWR0aDogMTEwMHB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICBnYXA6IDI0cHg7XG59XG5cbi5ydWxlcy1jYXJkIHtcbiAgcGFkZGluZzogMzJweCAzNnB4O1xuXG4gIGgyIHtcbiAgICBtYXJnaW46IDAgMCAyMnB4O1xuICAgIGZvbnQtc2l6ZTogMS45cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgY29sb3I6ICRpbms7XG4gIH1cblxuICBwIHtcbiAgICBtYXJnaW46IDAgMCAxOHB4O1xuICAgIGNvbG9yOiAkaW5rLW1pZDtcbiAgICBsaW5lLWhlaWdodDogMS43O1xuICAgIGZvbnQtc2l6ZTogMS4wNXJlbTtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIH1cbn1cblxuLnJ1bGVzLWxpc3Qge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBwYWRkaW5nOiAwO1xuICBtYXJnaW46IDI0cHggMCAwO1xuICBkaXNwbGF5OiBncmlkO1xuICBnYXA6IDE0cHg7XG5cbiAgbGkge1xuICAgIHBhZGRpbmc6IDE2cHggMThweDtcbiAgICBiYWNrZ3JvdW5kOiAkY3JlYW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgY29sb3I6ICRpbmstbWlkO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU1O1xuICAgIGZvbnQtc2l6ZTogMS4wNXJlbTtcbiAgfVxufVxuXG4uY29wIHtcbiAgY29sb3I6ICRibHVlO1xuICBmb250LXdlaWdodDogNzAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG5cbi5yb2JiZXIge1xuICBjb2xvcjogJG9yYW5nZTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcbiAgLnJ1bGVzLXBhZ2Uge1xuICAgIHBhZGRpbmc6IDMycHggMTZweCA1NnB4O1xuICB9XG5cbiAgLnJ1bGVzLWhlYWRlciB7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBtYXJnaW4tYm90dG9tOiAyOHB4O1xuXG4gICAgaDEge1xuICAgICAgZm9udC1zaXplOiAyLjZyZW07XG4gICAgfVxuICB9XG5cbiAgLnJ1bGVzLWdyaWQge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICB9XG5cbiAgLnJ1bGVzLWNhcmQge1xuICAgIHBhZGRpbmc6IDI4cHggMjRweDtcbiAgfVxufSJdfQ== */"] });


/***/ }),

/***/ "Gh1A":
/*!***********************************************!*\
  !*** ./src/app/models/Adventure/adventure.ts ***!
  \***********************************************/
/*! exports provided: Adventure */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Adventure", function() { return Adventure; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mode */ "Rvdi");
/* harmony import */ var _mediation_mediation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mediation/mediation */ "aMqS");




class Adventure {
    constructor(name, mode, key, levels = [], picture_url) {
        this.level_index = 0;
        this.mode = _mode__WEBPACK_IMPORTED_MODULE_2__["Mode"].CLASSIC;
        this.mediation_key = undefined;
        this.levels = levels;
        this.name = name;
        this.mode = mode;
        this.mediation_key = key;
        this.picture = picture_url;
    }
    addLevel(level) { this.levels.push(level); }
    getCurrentLevel() {
        return this.levels[this.level_index];
    }
    getMediationInfo() {
        return _mediation_mediation__WEBPACK_IMPORTED_MODULE_3__["mediation"][this.mediation_key][`step${this.level_index + 1}`];
    }
    goToNextLevel() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            console.log('NOMBRE DE NIVEAU : ' + this.levels.length);
            console.log('current level index: ' + this.level_index);
            if (this.level_index < this.levels.length - 1) {
                this.level_index++;
            }
            else {
                return yield this.displayEndMessage();
            }
            console.log('update level index: ' + this.level_index);
        });
    }
    displayEndMessage() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.level_index = 0;
            const result = yield sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
                title: 'Fin de d\'aventure.',
                icon: 'success',
                text: `Félicitations vous avez terminée l\'aventure "${this.name}".`
            });
            console.log('RESULT', result);
            return result;
        });
    }
    getName() {
        return this.name;
    }
    getMode() {
        return this.mode;
    }
    reset() {
        this.level_index = 0;
    }
}


/***/ }),

/***/ "KjiV":
/*!******************************************************!*\
  !*** ./src/app/models/Pawn/PawnState/pawn-states.ts ***!
  \******************************************************/
/*! exports provided: GlobalPawnStates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalPawnStates", function() { return GlobalPawnStates; });
/* harmony import */ var _PawnStateOnTurn_pawn_state_on_turn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PawnStateOnTurn/pawn-state-on-turn */ "3pDe");
/* harmony import */ var _PawnStateWaitingPlacement_pawn_state_waiting_placement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PawnStateWaitingPlacement/pawn-state-waiting-placement */ "YUlo");
/* harmony import */ var _PawnStateWaitingTurn_pawn_state_waiting_turn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PawnStateWaitingTurn/pawn-state-waiting-turn */ "6bBq");



const GlobalPawnStates = {
    waitingPlacementState: new _PawnStateWaitingPlacement_pawn_state_waiting_placement__WEBPACK_IMPORTED_MODULE_1__["PawnStateWaitingPlacement"](),
    onTurnState: new _PawnStateOnTurn_pawn_state_on_turn__WEBPACK_IMPORTED_MODULE_0__["PawnStateOnTurn"](),
    waitingTurnState: new _PawnStateWaitingTurn_pawn_state_waiting_turn__WEBPACK_IMPORTED_MODULE_2__["PawnStateWaitingTurn"]()
};


/***/ }),

/***/ "L1MR":
/*!***************************************************!*\
  !*** ./src/app/models/Graph/specific/specific.ts ***!
  \***************************************************/
/*! exports provided: Specific */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Specific", function() { return Specific; });
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../graph */ "Z/gq");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "VphZ");


class Specific extends _graph__WEBPACK_IMPORTED_MODULE_0__["Graph"] {
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
            .call(d3__WEBPACK_IMPORTED_MODULE_1__["drag"]()
            .on('start', (event) => {
            this.dragstarted(event);
        })
            .on('drag', (event) => {
            this.dragged(event);
        })
            .on('end', (event) => {
            this.dragended(event);
        }));
        this.simulate(svg);
    }
    simulate(svg) {
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_1__["forceSimulation"](this.nodes)
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


/***/ }),

/***/ "LGDz":
/*!**************************************************************************!*\
  !*** ./src/app/_services/graph-constructor/graph-constructor.service.ts ***!
  \**************************************************************************/
/*! exports provided: GraphConstructorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphConstructorService", function() { return GraphConstructorService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver */ "Iab2");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");




class GraphConstructorService {
    constructor() {
        this.tools = ['add-node', 'add-link', 'remove', 'move'];
        this.originalNodeColor = '#69b3a2';
        this.selectedNodeColor = 'red';
        this.graphTypes = {
            tree: 'Arbre',
            cycle: 'Cycle',
            grid: 'Grille',
            tore: 'Grille Torique',
            specific: 'Conserver position des noeuds',
            random: 'Autre',
        };
        this.nodes = [];
        this.links = [];
    }
    enterFilename() {
        return new Promise((resolve) => {
            sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
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
    selectGraphType() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const result = yield sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
                title: 'Type du graphe',
                input: 'select',
                inputOptions: this.graphTypes,
                showCancelButton: true,
                cancelButtonText: 'Annuler'
            });
            if (result.isConfirmed === true) {
                let args = [];
                switch (result.value) {
                    case 'grid':
                    case 'tore':
                        args = yield this.selectGridProperties();
                        break;
                    case 'tree':
                        args = yield this.selectTreeProperty();
                        break;
                    default:
                        break;
                }
                return this.save(result.value, args);
            }
            return false;
        });
    }
    selectGridProperties() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const res = [];
            const resultSwal = yield sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
                title: 'Définir les propriétés de la grille',
                html: '<label>Longueur : </label><input id="swal-input1" class="swal2-input" type="number" min="3" value="3" /><br>' +
                    '<label>Largeur : </label><input id="swal-input2" class="swal2-input" type="number" min="3" value="3"/>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    return [
                        document.getElementById('swal-input1').value,
                        document.getElementById('swal-input2').value
                    ];
                }
            });
            (resultSwal.value || []).forEach((n) => {
                res.push(+n);
            });
            return res;
        });
    }
    selectTreeProperty() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const res = [];
            const resultSwal = yield sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
                title: 'Définir l\'arité de l\'arbre',
                input: 'number',
                inputValue: 2,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            res.push(+resultSwal.value);
            return res;
        });
    }
    toolAction(tool, source, target) {
        switch (tool) {
            case 'add-node':
                this.addNode(source.x, source.y);
                break;
            case 'add-link':
                if (!target)
                    return;
                this.addLink(source, target);
                break;
            case 'remove':
                if (!target) {
                    this.removeNode(source.x, source.y);
                }
                else {
                    this.removeLink(source, target);
                }
                break;
            case 'move':
                if (!target)
                    return;
                this.moveNode(source, target);
                break;
            default:
                break;
        }
    }
    save(type = '', args = []) {
        return new Promise((resolve) => {
            this.enterFilename().then((filename) => {
                if (filename) {
                    const graphJson = this.convertGraphToJsonFile(type, args);
                    const blobGraphFromJson = new Blob([graphJson], { type: 'application/json' });
                    Object(file_saver__WEBPACK_IMPORTED_MODULE_2__["saveAs"])(blobGraphFromJson, `${filename}.json`);
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    convertGraphToJsonFile(type = '', args = []) {
        this.nodes.forEach((node, i) => {
            node.index = i;
        });
        const jsonLinks = [];
        this.links.forEach((link) => {
            jsonLinks.push({
                source: this.foundNodeIndex(link.source),
                target: this.foundNodeIndex(link.target)
            });
        });
        const graphJson = {
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
    foundNodeIndex(nodePosition) {
        return this.nodes.findIndex(node => node.x === nodePosition.x && node.y === nodePosition.y);
    }
    addNode(x, y) {
        const node = { x, y };
        this.nodes.push(node);
    }
    addLink(source, target) {
        const link = { source, target };
        this.links.push(link);
    }
    removeNode(x, y) {
        this.nodes = this.nodes.filter(node => node.x !== x || node.y !== y);
    }
    removeLink(source, target) {
        this.links = this.links.filter(link => !this.checkCirclePosition(link.source, source) ||
            !this.checkCirclePosition(link.target, target));
    }
    moveNode(movingCircle, endPosition) {
        const nodeIndex = this.nodes.findIndex(node => node.x === movingCircle.x && node.y === movingCircle.y);
        if (nodeIndex === -1)
            return;
        this.nodes[nodeIndex].x = endPosition.x;
        this.nodes[nodeIndex].y = endPosition.y;
        this.links.forEach(link => {
            if (this.checkCirclePosition(link.source, movingCircle)) {
                link.source.x = endPosition.x;
                link.source.y = endPosition.y;
            }
            else if (this.checkCirclePosition(link.target, movingCircle)) {
                link.target.x = endPosition.x;
                link.target.y = endPosition.y;
            }
        });
    }
    checkCirclePosition(c1, c2) {
        return c1.x === c2.x && c1.y === c2.y;
    }
    reset() {
        this.nodes = [];
        this.links = [];
    }
}
GraphConstructorService.ɵfac = function GraphConstructorService_Factory(t) { return new (t || GraphConstructorService)(); };
GraphConstructorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: GraphConstructorService, factory: GraphConstructorService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "LRql":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/components/cops-and-robber-game-mode-selection/cops-and-robber-game-mode-selection.component.ts ***!
  \*****************************************************************************************************************/
/*! exports provided: CopsAndRobberGameModeSelectionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CopsAndRobberGameModeSelectionComponent", function() { return CopsAndRobberGameModeSelectionComponent; });
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/_services/game/game.service */ "eiSD");




class CopsAndRobberGameModeSelectionComponent {
    constructor(router, gameService) {
        this.router = router;
        this.gameService = gameService;
    }
    ngOnInit() {
    }
    configureFreeGame() {
        this.router.navigate(['/menu']);
    }
    configureAdventure() {
        this.router.navigate(['/adventure-menu']);
    }
    displayRules() {
        sweetalert2__WEBPACK_IMPORTED_MODULE_0___default.a.fire({
            icon: 'info',
            html: this.gameService.rulesHtml(),
            customClass: {
                popup: 'custom-dialog-container',
            }
        });
    }
}
CopsAndRobberGameModeSelectionComponent.ɵfac = function CopsAndRobberGameModeSelectionComponent_Factory(t) { return new (t || CopsAndRobberGameModeSelectionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_3__["GameService"])); };
CopsAndRobberGameModeSelectionComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: CopsAndRobberGameModeSelectionComponent, selectors: [["app-cops-and-robber-game-mode-selection"]], decls: 104, vars: 0, consts: [[1, "selection"], ["aria-hidden", "true", 1, "bg-graph"], ["viewBox", "0 0 1200 700", "preserveAspectRatio", "xMidYMid slice", "xmlns", "http://www.w3.org/2000/svg", 1, "bg-graph__svg"], ["stroke", "rgba(255,255,255,0.06)", "stroke-width", "1.5", "fill", "none", 1, "bg-edges"], ["x1", "120", "y1", "140", "x2", "380", "y2", "260"], ["x1", "380", "y1", "260", "x2", "600", "y2", "120"], ["x1", "600", "y1", "120", "x2", "820", "y2", "280"], ["x1", "820", "y1", "280", "x2", "1080", "y2", "160"], ["x1", "380", "y1", "260", "x2", "480", "y2", "480"], ["x1", "600", "y1", "120", "x2", "480", "y2", "480"], ["x1", "820", "y1", "280", "x2", "700", "y2", "520"], ["x1", "480", "y1", "480", "x2", "700", "y2", "520"], ["x1", "700", "y1", "520", "x2", "950", "y2", "580"], ["x1", "1080", "y1", "160", "x2", "950", "y2", "580"], ["x1", "120", "y1", "140", "x2", "480", "y2", "480"], ["x1", "240", "y1", "580", "x2", "480", "y2", "480"], ["x1", "240", "y1", "580", "x2", "700", "y2", "520"], ["fill", "rgba(255,255,255,0.12)", 1, "bg-nodes"], ["cx", "120", "cy", "140", "r", "7"], ["cx", "380", "cy", "260", "r", "9"], ["cx", "600", "cy", "120", "r", "8"], ["cx", "820", "cy", "280", "r", "10"], ["cx", "1080", "cy", "160", "r", "7"], ["cx", "480", "cy", "480", "r", "11"], ["cx", "700", "cy", "520", "r", "9"], ["cx", "950", "cy", "580", "r", "7"], ["cx", "240", "cy", "580", "r", "8"], [1, "ms-header"], [1, "ms-header__logo"], ["src", "assets/logo-TN.png", "alt", "Logo Terra Numerica", 1, "ms-header__logo-img"], [1, "ms-header__text"], [1, "ms-header__eyebrow"], [1, "ms-header__title"], [1, "ms-grid"], ["tabindex", "0", "role", "button", 1, "ms-card", "ms-card--play", 3, "click"], [1, "ms-card__glow"], [1, "ms-card__icon-wrap"], ["src", "assets/mode-selection/free-game.svg", "alt", "", 1, "ms-card__icon"], [1, "ms-card__body"], [1, "ms-card__tag"], [1, "ms-card__name"], [1, "ms-card__desc"], [1, "ms-card__arrow"], ["tabindex", "0", "role", "button", 1, "ms-card", "ms-card--adventure", 3, "click"], ["src", "assets/mode-selection/adventure.svg", "alt", "", 1, "ms-card__icon"], ["routerLink", "/graph-constructor", "tabindex", "0", "role", "button", 1, "ms-card", "ms-card--editor", "editor"], ["src", "assets/mode-selection/editor.svg", "alt", "", 1, "ms-card__icon"], ["routerLink", "/rules", "tabindex", "0", "role", "button", 1, "ms-card", "ms-card--rules"], ["src", "assets/menu/rules.svg", "alt", "", 1, "ms-card__icon"], ["routerLink", "/credit", "tabindex", "0", "role", "button", 1, "ms-card", "ms-card--credits"], ["src", "assets/mode-selection/hand-shake.svg", "alt", "", 1, "ms-card__icon"]], template: function CopsAndRobberGameModeSelectionComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "svg", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "g", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "line", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "line", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "line", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "line", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "line", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "line", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "line", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "line", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "line", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "line", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "line", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "line", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "line", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "g", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "circle", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "circle", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](20, "circle", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "circle", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "circle", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "circle", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "circle", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "circle", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "circle", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "header", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](29, "img", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "span", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "Terra Numerica");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "h1", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "Gendarmes & Voleur");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](35, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "em");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "dans les graphes");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "main", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CopsAndRobberGameModeSelectionComponent_Template_div_click_39_listener() { return ctx.configureFreeGame(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](40, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](42, "img", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Jouer");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "h2", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Mode libre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "p", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49, "Configurez votre plateau, vos adversaires et lancez la partie.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "span", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "div", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CopsAndRobberGameModeSelectionComponent_Template_div_click_52_listener() { return ctx.configureAdventure(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](53, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](55, "img", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](56, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "B\u00EAta");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "h2", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](60, "Aventure");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](61, "p", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](62, "Progressez \u00E0 travers des niveaux avec des d\u00E9fis croissants.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](63, "span", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](66, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](68, "img", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](69, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](70, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](71, "Outil");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](72, "h2", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](73, "\u00C9diteur de graphe");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](74, "p", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](75, "Cr\u00E9ez et importez vos propres plateaux de jeu personnalis\u00E9s.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "span", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](77, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "div", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](79, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](80, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](81, "img", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](82, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](83, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84, "Info");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "h2", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](86, "Voir les r\u00E8gles");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](87, "p", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](88, "Comprenez les m\u00E9caniques du jeu avant de vous lancer.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](89, "span", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](90, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](91, "div", 49);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](92, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](93, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](94, "img", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](95, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](96, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](97, "\u00C9quipe");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](98, "h2", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](99, "Cr\u00E9dits");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](100, "p", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](101, "D\u00E9couvrez les contributeurs du projet Terra Numerica.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](102, "span", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](103, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLink"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap\");\n  body {\n  margin: 0;\n  padding: 0;\n  background: linear-gradient(180deg, #f8faff 0%, #eef3f9 100%);\n  font-family: \"DM Sans\", sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.selection[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 100vh;\n  padding: 48px 24px 56px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 48px;\n  overflow: hidden;\n  color: #18212f;\n  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.08), transparent 30%), radial-gradient(circle at bottom right, rgba(167, 139, 250, 0.08), transparent 28%), linear-gradient(180deg, #f8faff 0%, #eef3f9 100%);\n}\n.bg-graph[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  overflow: hidden;\n}\n.bg-graph__svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  opacity: 0.5;\n  animation: bgDrift 24s ease-in-out infinite alternate;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  animation: nodePulse 5s ease-in-out infinite;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.8s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 1.4s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 2s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.4s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(6) {\n  animation-delay: 2.4s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(7) {\n  animation-delay: 1.1s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(8) {\n  animation-delay: 3s;\n}\n.bg-nodes[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]:nth-child(9) {\n  animation-delay: 1.8s;\n}\n.ms-header[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  text-align: left;\n  animation: fadeUp 0.7s ease;\n}\n.ms-header__logo-img[_ngcontent-%COMP%] {\n  width: auto;\n  height: 72px;\n  object-fit: contain;\n  filter: drop-shadow(0 8px 16px rgba(52, 211, 153, 0.16));\n}\n.ms-header__eyebrow[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 6px;\n  font-size: 0.72rem;\n  font-weight: 700;\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n  color: #98a3b3;\n}\n.ms-header__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: \"Syne\", sans-serif;\n  font-size: clamp(1.8rem, 3vw, 2.7rem);\n  font-weight: 800;\n  line-height: 1.1;\n  letter-spacing: -0.03em;\n  color: #18212f;\n}\n.ms-header__title[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: italic;\n  font-weight: 600;\n  color: #6f7c8f;\n}\n.ms-grid[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  max-width: 1100px;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 16px;\n}\n.ms-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 200px;\n  min-height: 230px;\n  padding: 22px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.78);\n  border: 1px solid rgba(20, 40, 80, 0.08);\n  box-shadow: 0 10px 30px rgba(22, 34, 51, 0.08);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  cursor: pointer;\n  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;\n  overflow: hidden;\n  outline: none;\n  animation: fadeUp 0.55s ease both;\n}\n.ms-card[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.08s;\n}\n.ms-card[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.16s;\n}\n.ms-card[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.24s;\n}\n.ms-card[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.32s;\n}\n.ms-card[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.4s;\n}\n.ms-card[_ngcontent-%COMP%]:hover, .ms-card[_ngcontent-%COMP%]:focus {\n  transform: translateY(-6px);\n  border-color: var(--accent-border);\n  box-shadow: 0 14px 34px rgba(22, 34, 51, 0.12), 0 0 0 1px var(--accent-border);\n}\n.ms-card[_ngcontent-%COMP%]:hover   .ms-card__glow[_ngcontent-%COMP%], .ms-card[_ngcontent-%COMP%]:focus   .ms-card__glow[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.ms-card[_ngcontent-%COMP%]:hover   .ms-card__icon-wrap[_ngcontent-%COMP%], .ms-card[_ngcontent-%COMP%]:focus   .ms-card__icon-wrap[_ngcontent-%COMP%] {\n  background: var(--accent-soft);\n  border-color: var(--accent-border);\n}\n.ms-card[_ngcontent-%COMP%]:hover   .ms-card__icon[_ngcontent-%COMP%], .ms-card[_ngcontent-%COMP%]:focus   .ms-card__icon[_ngcontent-%COMP%] {\n  transform: scale(1.06);\n}\n.ms-card[_ngcontent-%COMP%]:hover   .ms-card__arrow[_ngcontent-%COMP%], .ms-card[_ngcontent-%COMP%]:focus   .ms-card__arrow[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n}\n.ms-card--play[_ngcontent-%COMP%] {\n  --accent: #34d399;\n  --accent-soft: rgba(52, 211, 153, 0.12);\n  --accent-border: rgba(52, 211, 153, 0.3);\n}\n.ms-card--adventure[_ngcontent-%COMP%] {\n  --accent: #f59e0b;\n  --accent-soft: rgba(245, 158, 11, 0.12);\n  --accent-border: rgba(245, 158, 11, 0.3);\n}\n.ms-card--editor[_ngcontent-%COMP%] {\n  --accent: #60a5fa;\n  --accent-soft: rgba(96, 165, 250, 0.12);\n  --accent-border: rgba(96, 165, 250, 0.3);\n}\n.ms-card--rules[_ngcontent-%COMP%] {\n  --accent: #a78bfa;\n  --accent-soft: rgba(167, 139, 250, 0.12);\n  --accent-border: rgba(167, 139, 250, 0.3);\n}\n.ms-card--credits[_ngcontent-%COMP%] {\n  --accent: #f472b6;\n  --accent-soft: rgba(244, 114, 182, 0.12);\n  --accent-border: rgba(244, 114, 182, 0.3);\n}\n.ms-card__glow[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: radial-gradient(circle at top, var(--accent-soft) 0%, transparent 70%);\n  opacity: 0;\n  transition: opacity 0.25s ease;\n  pointer-events: none;\n}\n.ms-card__icon-wrap[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.92);\n  border: 1px solid rgba(20, 40, 80, 0.08);\n  transition: background 0.22s ease, border-color 0.22s ease;\n}\n.ms-card__icon[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  object-fit: contain;\n  filter: opacity(0.72);\n  transition: transform 0.22s ease;\n}\n.ms-card__body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  flex: 1;\n}\n.ms-card__tag[_ngcontent-%COMP%] {\n  font-family: \"Syne\", sans-serif;\n  font-size: 0.65rem;\n  font-weight: 700;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: var(--accent);\n}\n.ms-card__name[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: \"Syne\", sans-serif;\n  font-size: 1.02rem;\n  font-weight: 700;\n  line-height: 1.2;\n  color: #18212f;\n}\n.ms-card__desc[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.78rem;\n  line-height: 1.5;\n  color: #6f7c8f;\n}\n.ms-card__arrow[_ngcontent-%COMP%] {\n  align-self: flex-end;\n  margin-top: auto;\n  font-size: 1.15rem;\n  color: var(--accent);\n  opacity: 0;\n  transform: translateX(-6px);\n  transition: opacity 0.22s ease, transform 0.22s ease;\n}\n@keyframes fadeUp {\n  from {\n    opacity: 0;\n    transform: translateY(18px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes nodePulse {\n  0%, 100% {\n    opacity: 0.35;\n    r: 6;\n  }\n  50% {\n    opacity: 0.8;\n    r: 9;\n  }\n}\n@keyframes bgDrift {\n  from {\n    transform: translate(0, 0) scale(1);\n  }\n  to {\n    transform: translate(-12px, 10px) scale(1.02);\n  }\n}\n@media (max-width: 900px) {\n  .selection[_ngcontent-%COMP%] {\n    padding: 36px 18px 48px;\n    gap: 36px;\n  }\n\n  .ms-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    text-align: center;\n    gap: 14px;\n  }\n\n  .ms-grid[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n\n  .ms-card[_ngcontent-%COMP%] {\n    width: calc(50% - 12px);\n    min-width: 150px;\n    min-height: 210px;\n  }\n}\n@media (max-width: 560px) {\n  .selection[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n    overflow-y: auto;\n  }\n\n  .ms-card[_ngcontent-%COMP%] {\n    width: 100%;\n    min-height: auto;\n    flex-direction: row;\n    align-items: center;\n    gap: 16px;\n    padding: 18px;\n  }\n\n  .ms-card__body[_ngcontent-%COMP%] {\n    gap: 4px;\n  }\n\n  .ms-card__desc[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .ms-card__arrow[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .editor[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n\n    body {\n    overflow: auto;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxjb3BzLWFuZC1yb2JiZXItZ2FtZS1tb2RlLXNlbGVjdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBUSxxSUFBQTtBQWtDUjtFQUNFLFNBQUE7RUFDQSxVQUFBO0VBQ0EsNkRBQUE7RUFDQSxrQ0F0QlU7QUFWWjtBQW1DQTtFQUNFLHNCQUFBO0FBaENGO0FBc0NBO0VBQ0Usa0JBQUE7RUFDQSxpQkFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBL0NLO0VBZ0RMLGtPQUNFO0FBcENKO0FBNENBO0VBQ0Usa0JBQUE7RUFDQSxRQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtBQXpDRjtBQTJDRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLHFEQUFBO0FBekNKO0FBNkNBO0VBQ0UsNENBQUE7QUExQ0Y7QUE0Q0U7RUFBaUIscUJBQUE7QUF6Q25CO0FBMENFO0VBQWlCLHFCQUFBO0FBdkNuQjtBQXdDRTtFQUFpQixtQkFBQTtBQXJDbkI7QUFzQ0U7RUFBaUIscUJBQUE7QUFuQ25CO0FBb0NFO0VBQWlCLHFCQUFBO0FBakNuQjtBQWtDRTtFQUFpQixxQkFBQTtBQS9CbkI7QUFnQ0U7RUFBaUIsbUJBQUE7QUE3Qm5CO0FBOEJFO0VBQWlCLHFCQUFBO0FBM0JuQjtBQWlDQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtFQUNBLDJCQUFBO0FBOUJGO0FBZ0NFO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLHdEQUFBO0FBOUJKO0FBaUNFO0VBQ0UsY0FBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQTVHUztBQTZFYjtBQWtDRTtFQUNFLFNBQUE7RUFDQSwrQkEvR1M7RUFnSFQscUNBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7RUFDQSxjQXhIRztBQXdGUDtBQWtDSTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQTVISztBQTRGWDtBQXdDQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFdBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0EsdUJBQUE7RUFDQSxTQUFBO0FBckNGO0FBMkNBO0VBQ0Usa0JBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxtQkFBQTtFQUNBLHFDQWpLUTtFQWtLUix3Q0FBQTtFQUNBLDhDQWhLTztFQWlLUCwyQkFBQTtFQUNBLG1DQUFBO0VBQ0EsZUFBQTtFQUNBLHVHQUNFO0VBSUYsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsaUNBQUE7QUE1Q0Y7QUErQ0k7RUFDRSxzQkFBQTtBQTdDTjtBQTRDSTtFQUNFLHNCQUFBO0FBMUNOO0FBeUNJO0VBQ0Usc0JBQUE7QUF2Q047QUFzQ0k7RUFDRSxzQkFBQTtBQXBDTjtBQW1DSTtFQUNFLHFCQUFBO0FBakNOO0FBcUNFO0VBRUUsMkJBQUE7RUFDQSxrQ0FBQTtFQUNBLDhFQUNFO0FBckNOO0FBd0NJO0VBQ0UsVUFBQTtBQXRDTjtBQXlDSTtFQUNFLDhCQUFBO0VBQ0Esa0NBQUE7QUF2Q047QUEwQ0k7RUFDRSxzQkFBQTtBQXhDTjtBQTJDSTtFQUNFLFVBQUE7RUFDQSx3QkFBQTtBQXpDTjtBQTZDRTtFQTdMQSxpQkFBQTtFQUNBLHVDQUFBO0VBQ0Esd0NBQUE7QUFtSkY7QUF5Q0U7RUE5TEEsaUJBQUE7RUFDQSx1Q0FBQTtFQUNBLHdDQUFBO0FBd0pGO0FBcUNFO0VBL0xBLGlCQUFBO0VBQ0EsdUNBQUE7RUFDQSx3Q0FBQTtBQTZKRjtBQWlDRTtFQWhNQSxpQkFBQTtFQUNBLHdDQUFBO0VBQ0EseUNBQUE7QUFrS0Y7QUE2QkU7RUFqTUEsaUJBQUE7RUFDQSx3Q0FBQTtFQUNBLHlDQUFBO0FBdUtGO0FBMEJFO0VBQ0Usa0JBQUE7RUFDQSxRQUFBO0VBQ0Esc0JBQUE7RUFDQSxrRkFBQTtFQUNBLFVBQUE7RUFDQSw4QkFBQTtFQUNBLG9CQUFBO0FBeEJKO0FBMkJFO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EscUNBdk9hO0VBd09iLHdDQUFBO0VBQ0EsMERBQUE7QUF6Qko7QUE0QkU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EscUJBQUE7RUFDQSxnQ0FBQTtBQTFCSjtBQTZCRTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFFBQUE7RUFDQSxPQUFBO0FBM0JKO0FBOEJFO0VBQ0UsK0JBcFBTO0VBcVBULGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0Esb0JBQUE7QUE1Qko7QUErQkU7RUFDRSxTQUFBO0VBQ0EsK0JBOVBTO0VBK1BULGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBdFFHO0FBeU9QO0FBZ0NFO0VBQ0UsU0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQTVRTztBQThPWDtBQWlDRTtFQUNFLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsVUFBQTtFQUNBLDJCQUFBO0VBQ0Esb0RBQUE7QUEvQko7QUFzQ0E7RUFDRTtJQUNFLFVBQUE7SUFDQSwyQkFBQTtFQW5DRjtFQXFDQTtJQUNFLFVBQUE7SUFDQSx3QkFBQTtFQW5DRjtBQUNGO0FBc0NBO0VBQ0U7SUFDRSxhQUFBO0lBQ0EsSUFBQTtFQXBDRjtFQXNDQTtJQUNFLFlBQUE7SUFDQSxJQUFBO0VBcENGO0FBQ0Y7QUF1Q0E7RUFDRTtJQUNFLG1DQUFBO0VBckNGO0VBdUNBO0lBQ0UsNkNBQUE7RUFyQ0Y7QUFDRjtBQTJDQTtFQUNFO0lBQ0UsdUJBQUE7SUFDQSxTQUFBO0VBekNGOztFQTRDQTtJQUNFLHNCQUFBO0lBQ0Esa0JBQUE7SUFDQSxTQUFBO0VBekNGOztFQTRDQTtJQUNFLFNBQUE7RUF6Q0Y7O0VBNENBO0lBQ0UsdUJBQUE7SUFDQSxnQkFBQTtJQUNBLGlCQUFBO0VBekNGO0FBQ0Y7QUE0Q0E7RUFDRTtJQUNFLDJCQUFBO0lBQ0EsZ0JBQUE7RUExQ0Y7O0VBNkNBO0lBQ0UsV0FBQTtJQUNBLGdCQUFBO0lBQ0EsbUJBQUE7SUFDQSxtQkFBQTtJQUNBLFNBQUE7SUFDQSxhQUFBO0VBMUNGOztFQTZDQTtJQUNFLFFBQUE7RUExQ0Y7O0VBNkNBO0lBQ0UsYUFBQTtFQTFDRjs7RUE2Q0E7SUFDRSxhQUFBO0VBMUNGOztFQTZDQTtJQUNFLHdCQUFBO0VBMUNGOztFQTZDQTtJQUNFLGNBQUE7RUExQ0Y7QUFDRiIsImZpbGUiOiJjb3BzLWFuZC1yb2JiZXItZ2FtZS1tb2RlLXNlbGVjdGlvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVN5bmU6d2dodEA2MDA7NzAwOzgwMCZmYW1pbHk9RE0rU2FuczppdGFsLHdnaHRAMCw0MDA7MCw1MDA7MSw0MDAmZGlzcGxheT1zd2FwJyk7XHJcblxyXG5cclxuXHJcblxyXG4kYmc6ICNmNWY3ZmI7XHJcbiRzdXJmYWNlOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzgpO1xyXG4kc3VyZmFjZS1zdHJvbmc6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45Mik7XHJcbiRib3JkZXI6IHJnYmEoMjAsIDQwLCA4MCwgMC4wOCk7XHJcbiRzaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMjIsIDM0LCA1MSwgMC4wOCk7XHJcblxyXG4kdGV4dDogIzE4MjEyZjtcclxuJHRleHQtbWlkOiAjNmY3YzhmO1xyXG4kdGV4dC1saWdodDogIzk4YTNiMztcclxuXHJcbiRmb250LXRpdGxlOiAnU3luZScsIHNhbnMtc2VyaWY7XHJcbiRmb250LWJvZHk6ICdETSBTYW5zJywgc2Fucy1zZXJpZjtcclxuXHJcblxyXG4kYy1wbGF5OiAjMzRkMzk5O1xyXG4kYy1hZHZlbnR1cmU6ICNmNTllMGI7XHJcbiRjLWVkaXRvcjogIzYwYTVmYTtcclxuJGMtcnVsZXM6ICNhNzhiZmE7XHJcbiRjLWNyZWRpdHM6ICNmNDcyYjY7XHJcblxyXG5AbWl4aW4gY2FyZC1hY2NlbnQoJGNvbG9yKSB7XHJcbiAgLS1hY2NlbnQ6ICN7JGNvbG9yfTtcclxuICAtLWFjY2VudC1zb2Z0OiAje3JnYmEoJGNvbG9yLCAwLjEyKX07XHJcbiAgLS1hY2NlbnQtYm9yZGVyOiAje3JnYmEoJGNvbG9yLCAwLjMpfTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuOjpuZy1kZWVwIGJvZHkge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmOGZhZmYgMCUsICNlZWYzZjkgMTAwJSk7XHJcbiAgZm9udC1mYW1pbHk6ICRmb250LWJvZHk7XHJcbn1cclxuXHJcbioge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi5zZWxlY3Rpb24ge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICBwYWRkaW5nOiA0OHB4IDI0cHggNTZweDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBnYXA6IDQ4cHg7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBjb2xvcjogJHRleHQ7XHJcbiAgYmFja2dyb3VuZDpcclxuICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgdG9wIGxlZnQsIHJnYmEoOTYsIDE2NSwgMjUwLCAwLjA4KSwgdHJhbnNwYXJlbnQgMzAlKSxcclxuICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgYm90dG9tIHJpZ2h0LCByZ2JhKDE2NywgMTM5LCAyNTAsIDAuMDgpLCB0cmFuc3BhcmVudCAyOCUpLFxyXG4gICAgbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2Y4ZmFmZiAwJSwgI2VlZjNmOSAxMDAlKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLmJnLWdyYXBoIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgaW5zZXQ6IDA7XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuXHJcbiAgJl9fc3ZnIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgb3BhY2l0eTogMC41O1xyXG4gICAgYW5pbWF0aW9uOiBiZ0RyaWZ0IDI0cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XHJcbiAgfVxyXG59XHJcblxyXG4uYmctbm9kZXMgY2lyY2xlIHtcclxuICBhbmltYXRpb246IG5vZGVQdWxzZSA1cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcclxuXHJcbiAgJjpudGgtY2hpbGQoMikgeyBhbmltYXRpb24tZGVsYXk6IDAuOHM7IH1cclxuICAmOm50aC1jaGlsZCgzKSB7IGFuaW1hdGlvbi1kZWxheTogMS40czsgfVxyXG4gICY6bnRoLWNoaWxkKDQpIHsgYW5pbWF0aW9uLWRlbGF5OiAyczsgfVxyXG4gICY6bnRoLWNoaWxkKDUpIHsgYW5pbWF0aW9uLWRlbGF5OiAwLjRzOyB9XHJcbiAgJjpudGgtY2hpbGQoNikgeyBhbmltYXRpb24tZGVsYXk6IDIuNHM7IH1cclxuICAmOm50aC1jaGlsZCg3KSB7IGFuaW1hdGlvbi1kZWxheTogMS4xczsgfVxyXG4gICY6bnRoLWNoaWxkKDgpIHsgYW5pbWF0aW9uLWRlbGF5OiAzczsgfVxyXG4gICY6bnRoLWNoaWxkKDkpIHsgYW5pbWF0aW9uLWRlbGF5OiAxLjhzOyB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi5tcy1oZWFkZXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB6LWluZGV4OiAyO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDI0cHg7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxuICBhbmltYXRpb246IGZhZGVVcCAwLjdzIGVhc2U7XHJcblxyXG4gICZfX2xvZ28taW1nIHtcclxuICAgIHdpZHRoOiBhdXRvO1xyXG4gICAgaGVpZ2h0OiA3MnB4O1xyXG4gICAgb2JqZWN0LWZpdDogY29udGFpbjtcclxuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCA4cHggMTZweCByZ2JhKDUyLCAyMTEsIDE1MywgMC4xNikpO1xyXG4gIH1cclxuXHJcbiAgJl9fZXllYnJvdyB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgIGZvbnQtc2l6ZTogMC43MnJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgIGNvbG9yOiAkdGV4dC1saWdodDtcclxuICB9XHJcblxyXG4gICZfX3RpdGxlIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtZmFtaWx5OiAkZm9udC10aXRsZTtcclxuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS44cmVtLCAzdncsIDIuN3JlbSk7XHJcbiAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcclxuICAgIGxldHRlci1zcGFjaW5nOiAtMC4wM2VtO1xyXG4gICAgY29sb3I6ICR0ZXh0O1xyXG5cclxuICAgIGVtIHtcclxuICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICBjb2xvcjogJHRleHQtbWlkO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLm1zLWdyaWQge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB6LWluZGV4OiAyO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1heC13aWR0aDogMTEwMHB4O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC13cmFwOiB3cmFwO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGdhcDogMTZweDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLm1zLWNhcmQge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB3aWR0aDogMjAwcHg7XHJcbiAgbWluLWhlaWdodDogMjMwcHg7XHJcbiAgcGFkZGluZzogMjJweCAyMHB4O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDE0cHg7XHJcbiAgYm9yZGVyLXJhZGl1czogMThweDtcclxuICBiYWNrZ3JvdW5kOiAkc3VyZmFjZTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xyXG4gIGJveC1zaGFkb3c6ICRzaGFkb3c7XHJcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xyXG4gIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOlxyXG4gICAgdHJhbnNmb3JtIDAuMjJzIGVhc2UsXHJcbiAgICBib3gtc2hhZG93IDAuMjJzIGVhc2UsXHJcbiAgICBib3JkZXItY29sb3IgMC4yMnMgZWFzZSxcclxuICAgIGJhY2tncm91bmQgMC4yMnMgZWFzZTtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbiAgYW5pbWF0aW9uOiBmYWRlVXAgMC41NXMgZWFzZSBib3RoO1xyXG5cclxuICBAZm9yICRpIGZyb20gMSB0aHJvdWdoIDUge1xyXG4gICAgJjpudGgtY2hpbGQoI3skaX0pIHtcclxuICAgICAgYW5pbWF0aW9uLWRlbGF5OiAjezAuMDggKiAkaX1zO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJjpob3ZlcixcclxuICAmOmZvY3VzIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNnB4KTtcclxuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tYWNjZW50LWJvcmRlcik7XHJcbiAgICBib3gtc2hhZG93OlxyXG4gICAgICAwIDE0cHggMzRweCByZ2JhKDIyLCAzNCwgNTEsIDAuMTIpLFxyXG4gICAgICAwIDAgMCAxcHggdmFyKC0tYWNjZW50LWJvcmRlcik7XHJcblxyXG4gICAgLm1zLWNhcmRfX2dsb3cge1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC5tcy1jYXJkX19pY29uLXdyYXAge1xyXG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQtc29mdCk7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tYWNjZW50LWJvcmRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLm1zLWNhcmRfX2ljb24ge1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDYpO1xyXG4gICAgfVxyXG5cclxuICAgIC5tcy1jYXJkX19hcnJvdyB7XHJcbiAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICYtLXBsYXkgICAgICB7IEBpbmNsdWRlIGNhcmQtYWNjZW50KCRjLXBsYXkpOyB9XHJcbiAgJi0tYWR2ZW50dXJlIHsgQGluY2x1ZGUgY2FyZC1hY2NlbnQoJGMtYWR2ZW50dXJlKTsgfVxyXG4gICYtLWVkaXRvciAgICB7IEBpbmNsdWRlIGNhcmQtYWNjZW50KCRjLWVkaXRvcik7IH1cclxuICAmLS1ydWxlcyAgICAgeyBAaW5jbHVkZSBjYXJkLWFjY2VudCgkYy1ydWxlcyk7IH1cclxuICAmLS1jcmVkaXRzICAgeyBAaW5jbHVkZSBjYXJkLWFjY2VudCgkYy1jcmVkaXRzKTsgfVxyXG5cclxuICAmX19nbG93IHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGluc2V0OiAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogaW5oZXJpdDtcclxuICAgIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgdG9wLCB2YXIoLS1hY2NlbnQtc29mdCkgMCUsIHRyYW5zcGFyZW50IDcwJSk7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjI1cyBlYXNlO1xyXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAmX19pY29uLXdyYXAge1xyXG4gICAgd2lkdGg6IDU2cHg7XHJcbiAgICBoZWlnaHQ6IDU2cHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGJhY2tncm91bmQ6ICRzdXJmYWNlLXN0cm9uZztcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXI7XHJcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMjJzIGVhc2UsIGJvcmRlci1jb2xvciAwLjIycyBlYXNlO1xyXG4gIH1cclxuXHJcbiAgJl9faWNvbiB7XHJcbiAgICB3aWR0aDogMzBweDtcclxuICAgIGhlaWdodDogMzBweDtcclxuICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XHJcbiAgICBmaWx0ZXI6IG9wYWNpdHkoMC43Mik7XHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4yMnMgZWFzZTtcclxuICB9XHJcblxyXG4gICZfX2JvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDZweDtcclxuICAgIGZsZXg6IDE7XHJcbiAgfVxyXG5cclxuICAmX190YWcge1xyXG4gICAgZm9udC1mYW1pbHk6ICRmb250LXRpdGxlO1xyXG4gICAgZm9udC1zaXplOiAwLjY1cmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAwLjE0ZW07XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgY29sb3I6IHZhcigtLWFjY2VudCk7XHJcbiAgfVxyXG5cclxuICAmX19uYW1lIHtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIGZvbnQtZmFtaWx5OiAkZm9udC10aXRsZTtcclxuICAgIGZvbnQtc2l6ZTogMS4wMnJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBsaW5lLWhlaWdodDogMS4yO1xyXG4gICAgY29sb3I6ICR0ZXh0O1xyXG4gIH1cclxuXHJcbiAgJl9fZGVzYyB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250LXNpemU6IDAuNzhyZW07XHJcbiAgICBsaW5lLWhlaWdodDogMS41O1xyXG4gICAgY29sb3I6ICR0ZXh0LW1pZDtcclxuICB9XHJcblxyXG4gICZfX2Fycm93IHtcclxuICAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xyXG4gICAgbWFyZ2luLXRvcDogYXV0bztcclxuICAgIGZvbnQtc2l6ZTogMS4xNXJlbTtcclxuICAgIGNvbG9yOiB2YXIoLS1hY2NlbnQpO1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNnB4KTtcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4yMnMgZWFzZSwgdHJhbnNmb3JtIDAuMjJzIGVhc2U7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5Aa2V5ZnJhbWVzIGZhZGVVcCB7XHJcbiAgZnJvbSB7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE4cHgpO1xyXG4gIH1cclxuICB0byB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gIH1cclxufVxyXG5cclxuQGtleWZyYW1lcyBub2RlUHVsc2Uge1xyXG4gIDAlLCAxMDAlIHtcclxuICAgIG9wYWNpdHk6IDAuMzU7XHJcbiAgICByOiA2O1xyXG4gIH1cclxuICA1MCUge1xyXG4gICAgb3BhY2l0eTogMC44O1xyXG4gICAgcjogOTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgYmdEcmlmdCB7XHJcbiAgZnJvbSB7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwKSBzY2FsZSgxKTtcclxuICB9XHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEycHgsIDEwcHgpIHNjYWxlKDEuMDIpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDkwMHB4KSB7XHJcbiAgLnNlbGVjdGlvbiB7XHJcbiAgICBwYWRkaW5nOiAzNnB4IDE4cHggNDhweDtcclxuICAgIGdhcDogMzZweDtcclxuICB9XHJcblxyXG4gIC5tcy1oZWFkZXIge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGdhcDogMTRweDtcclxuICB9XHJcblxyXG4gIC5tcy1ncmlkIHtcclxuICAgIGdhcDogMTJweDtcclxuICB9XHJcblxyXG4gIC5tcy1jYXJkIHtcclxuICAgIHdpZHRoOiBjYWxjKDUwJSAtIDEycHgpO1xyXG4gICAgbWluLXdpZHRoOiAxNTBweDtcclxuICAgIG1pbi1oZWlnaHQ6IDIxMHB4O1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDU2MHB4KSB7XHJcbiAgLnNlbGVjdGlvbiB7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIH1cclxuXHJcbiAgLm1zLWNhcmQge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBtaW4taGVpZ2h0OiBhdXRvO1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBnYXA6IDE2cHg7XHJcbiAgICBwYWRkaW5nOiAxOHB4O1xyXG4gIH1cclxuXHJcbiAgLm1zLWNhcmRfX2JvZHkge1xyXG4gICAgZ2FwOiA0cHg7XHJcbiAgfVxyXG5cclxuICAubXMtY2FyZF9fZGVzYyB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gIH1cclxuXHJcbiAgLm1zLWNhcmRfX2Fycm93IHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAuZWRpdG9yIHtcclxuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICB9XHJcblxyXG4gIDo6bmctZGVlcCBib2R5IHtcclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gIH1cclxufSJdfQ== */"] });


/***/ }),

/***/ "MXcO":
/*!*******************************************!*\
  !*** ./src/app/models/Graph/Grid/grid.ts ***!
  \*******************************************/
/*! exports provided: Grid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Grid", function() { return Grid; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graph */ "Z/gq");


class Grid extends _graph__WEBPACK_IMPORTED_MODULE_1__["Graph"] {
    constructor(nodes, links, width, height) {
        super(nodes, links, "grid");
        this.grid = {
            cells: [],
            init: function (tab_width, tab_height, canvas_width, canvas_height) {
                this.cells = [];
                for (let row = 0; row < tab_height; ++row) {
                    const y = row * canvas_height / tab_height + (canvas_height / tab_height) / 2;
                    for (let col = 0; col < tab_width; ++col) {
                        const x = col * canvas_width / tab_width + (canvas_width / tab_width) / 2;
                        this.cells.push({
                            id: row * tab_width + col,
                            x: x,
                            y: y,
                            occupied: false
                        });
                    }
                }
            },
            getCell: function (d) {
                return this.cells[d.index];
            }
        };
        this._grid_width = width;
        this._grid_height = height;
    }
    get width() {
        return this._grid_width;
    }
    get height() {
        return this._grid_height;
    }
    draw(svg) {
        const canvas_width = parseInt(svg.style("width"), 10);
        const canvas_height = parseInt(svg.style("height"), 10);
        this.grid.init(this._grid_width, this._grid_height, canvas_width, canvas_height);
        for (let row = 0; row < this._grid_height; ++row) {
            const y = row * canvas_height / this._grid_height + (canvas_height / this._grid_height) / 2;
            const x1 = (canvas_width / this._grid_width) / 2;
            const x2 = canvas_width - (canvas_width / this._grid_width) / 2;
            svg.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)');
        }
        for (let col = 0; col < this._grid_width; ++col) {
            const x = col * canvas_width / this._grid_width + (canvas_width / this._grid_width) / 2;
            const y1 = (canvas_height / this._grid_height) / 2;
            const y2 = canvas_height - (canvas_height / this._grid_height) / 2;
            svg.append('line')
                .attr('x1', x)
                .attr('y1', y1)
                .attr('x2', x)
                .attr('y2', y2)
                .style('stroke', 'rgb(170, 170, 170)');
        }
        this.svgLinks = svg.selectAll("links")
            .data(this.links)
            .join("line");
        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
            .attr("r", 20)
            .attr("class", "circle")
            .style("fill", "#69b3a2");
        this.simulate(svg);
    }
    simulate(svg) {
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_0__["forceSimulation"](this.nodes)
            .force("link", d3__WEBPACK_IMPORTED_MODULE_0__["forceLink"]()
            .links(this.links))
            .on("tick", this.ticked.bind(this));
    }
    stop() {
    }
    ticked() {
        this.svgLinks
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        this.svgNodes
            .each((d) => {
            let gridpoint = this.grid.getCell(d);
            if (gridpoint) {
                d.x += (gridpoint.x - d.x);
                d.y += (gridpoint.y - d.y);
            }
        })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}


/***/ }),

/***/ "Nf+H":
/*!*****************************************************************************!*\
  !*** ./src/app/components/graph-constructor/graph-constructor.component.ts ***!
  \*****************************************************************************/
/*! exports provided: GraphConstructorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphConstructorComponent", function() { return GraphConstructorComponent; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "RyHr");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_translate_translate_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/_services/translate/translate.service */ "/74g");
/* harmony import */ var src_app_services_graph_constructor_graph_constructor_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/_services/graph-constructor/graph-constructor.service */ "LGDz");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");







const _c0 = ["canvas"];
function GraphConstructorComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GraphConstructorComponent_button_17_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4); const tool_r2 = ctx.$implicit; const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r3.selectTool(tool_r2); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const tool_r2 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("active", ctx_r1.selected_tool === tool_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r1.getToolName(tool_r2), " ");
} }
class GraphConstructorComponent {
    constructor(translator, graphConstructorService) {
        this.translator = translator;
        this.graphConstructorService = graphConstructorService;
        this.selected_tool = 'add-node';
        this.tools = [];
        this.zoom_level = 0;
        this.raycaster = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"]();
        this.mouse = new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"]();
        this.animationFrameId = 0;
        this.groundPlane = new three__WEBPACK_IMPORTED_MODULE_0__["Plane"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 1), 0);
        this.dragPlane = new three__WEBPACK_IMPORTED_MODULE_0__["Plane"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 1), 0);
        this.intersectionPoint = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        this.nodeGeometry = new three__WEBPACK_IMPORTED_MODULE_0__["SphereGeometry"](0.35, 32, 32);
        this.nodes = [];
        this.links = [];
        this.nextNodeId = 1;
        this.placing_link = false;
        this.from = null;
        this.draggedNode = null;
        this.movingNodeOriginalPosition = null;
        this.defaultNodeColor = 0x66cdaa;
        this.selectedNodeColor = 0x05b800;
        this.animate = () => {
            this.animationFrameId = requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        this.onResize = () => {
            if (!this.renderer || !this.camera)
                return;
            const host = this.canvas.nativeElement;
            const width = host.clientWidth || 800;
            const height = host.clientHeight || 600;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        };
        this.onCanvasClick = (event) => {
            if (this.draggedNode)
                return;
            if (this.selected_tool === 'add-node') {
                const point = this.getPointOnPlane(event, this.groundPlane);
                if (!point)
                    return;
                this.drawNode({ x: point.x, y: point.y });
            }
            else {
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
        this.onPointerDown = (event) => {
            if (this.selected_tool !== 'move')
                return;
            const node = this.getClickedNode(event);
            if (!node)
                return;
            this.draggedNode = node;
            this.controls.enabled = false;
            this.movingNodeOriginalPosition = {
                x: node.mesh.position.x,
                y: node.mesh.position.y
            };
            node.mesh.material.emissive.setHex(0x222222);
        };
        this.onPointerMove = (event) => {
            if (this.selected_tool !== 'move' || !this.draggedNode)
                return;
            const point = this.getPointOnPlane(event, this.dragPlane);
            if (!point)
                return;
            this.draggedNode.mesh.position.set(point.x, point.y, 0);
            this.updateLinksForNode(this.draggedNode);
        };
        this.onPointerUp = () => {
            if (this.selected_tool !== 'move' || !this.draggedNode || !this.movingNodeOriginalPosition) {
                return;
            }
            const node = this.draggedNode;
            const endPosition = {
                x: node.mesh.position.x,
                y: node.mesh.position.y
            };
            this.graphConstructorService.toolAction(this.selected_tool, this.movingNodeOriginalPosition, endPosition);
            this.draggedNode = null;
            this.movingNodeOriginalPosition = null;
            this.controls.enabled = true;
        };
    }
    ngAfterViewInit() {
        this.tools = this.graphConstructorService.tools;
        this.initGraphEdition();
        this.animate();
    }
    ngOnDestroy() {
        var _a, _b;
        cancelAnimationFrame(this.animationFrameId);
        (_a = this.controls) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.renderer) === null || _b === void 0 ? void 0 : _b.dispose();
    }
    initGraphEdition() {
        this.graphConstructorService.reset();
        this.selected_tool = this.tools[0];
        const host = this.canvas.nativeElement;
        const width = host.clientWidth || 800;
        const height = host.clientHeight || 600;
        this.scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](0xf5f6fa);
        this.camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](60, width / height, 0.1, 1000);
        this.camera.position.set(0, -12, 12);
        this.camera.lookAt(0, 0, 0);
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        host.innerHTML = '';
        host.appendChild(this.renderer.domElement);
        this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__["OrbitControls"](this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__["AmbientLight"](0xffffff, 0.72);
        this.scene.add(ambientLight);
        const dirLight1 = new three__WEBPACK_IMPORTED_MODULE_0__["DirectionalLight"](0xffffff, 0.9);
        dirLight1.position.set(10, 10, 14);
        this.scene.add(dirLight1);
        const dirLight2 = new three__WEBPACK_IMPORTED_MODULE_0__["DirectionalLight"](0xffffff, 0.35);
        dirLight2.position.set(-8, -10, 8);
        this.scene.add(dirLight2);
        const grid = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](40, 40, 0xd0d0d0, 0xe7ebf2);
        grid.rotation.x = Math.PI / 2;
        this.scene.add(grid);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](new three__WEBPACK_IMPORTED_MODULE_0__["PlaneGeometry"](60, 60), new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"]
        }));
        planeMesh.name = 'interaction-plane';
        this.scene.add(planeMesh);
        this.renderer.domElement.addEventListener('click', this.onCanvasClick);
        this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
        this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
        this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
        window.addEventListener('resize', this.onResize);
    }
    drawNode(position) {
        this.graphConstructorService.toolAction(this.selected_tool, position);
        const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshStandardMaterial"]({
            color: this.defaultNodeColor,
            metalness: 0.35,
            roughness: 0.35,
            transparent: true,
            opacity: 0.95
        });
        const mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](this.nodeGeometry, material);
        mesh.position.set(position.x, position.y, 0);
        mesh.userData['type'] = 'node';
        this.scene.add(mesh);
        this.nodes.push({
            id: this.nextNodeId++,
            mesh
        });
    }
    handleClickOnNode(node) {
        switch (this.selected_tool) {
            case 'add-link':
                if (!this.placing_link) {
                    this.highlightNode(node, true);
                    this.from = node;
                }
                else {
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
    drawLink(from, to) {
        const fromPosition = this.convertNodeToPosition(from);
        const toPosition = this.convertNodeToPosition(to);
        this.graphConstructorService.toolAction(this.selected_tool, fromPosition, toPosition);
        const points = [
            new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](fromPosition.x, fromPosition.y, 0),
            new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](toPosition.x, toPosition.y, 0)
        ];
        const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]().setFromPoints(points);
        const material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({
            color: 0xd0d0d0
        });
        const line = new three__WEBPACK_IMPORTED_MODULE_0__["Line"](geometry, material);
        line.userData['type'] = 'link';
        this.scene.add(line);
        this.links.push({ source: from, target: to, line });
    }
    removeNode(node) {
        const toDelete = this.links.filter(link => link.source === node || link.target === node);
        for (const link of toDelete) {
            this.removeLine(link);
        }
        this.scene.remove(node.mesh);
        node.mesh.geometry.dispose();
        node.mesh.material.dispose();
        this.nodes = this.nodes.filter(n => n !== node);
        this.graphConstructorService.toolAction(this.selected_tool, this.convertNodeToPosition(node));
    }
    removeLine(link) {
        const source = this.convertNodeToPosition(link.source);
        const target = this.convertNodeToPosition(link.target);
        this.scene.remove(link.line);
        link.line.geometry.dispose();
        link.line.material.dispose();
        this.links = this.links.filter(l => l !== link);
        this.graphConstructorService.toolAction(this.selected_tool, source, target);
    }
    handleClickOnLink(line) {
        if (this.selected_tool === 'remove') {
            this.removeLine(line);
        }
    }
    updateLinksForNode(node) {
        this.links.forEach(link => {
            if (link.source !== node && link.target !== node)
                return;
            const points = [
                new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](link.source.mesh.position.x, link.source.mesh.position.y, 0),
                new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](link.target.mesh.position.x, link.target.mesh.position.y, 0)
            ];
            link.line.geometry.dispose();
            link.line.geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]().setFromPoints(points);
        });
    }
    getClickedNode(event) {
        this.updateMouse(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = this.nodes.map(n => n.mesh);
        const intersects = this.raycaster.intersectObjects(meshes, false);
        if (!intersects.length)
            return null;
        const mesh = intersects[0].object;
        return this.nodes.find(n => n.mesh === mesh) || null;
    }
    getClickedLine(event) {
        this.updateMouse(event);
        this.raycaster.params.Line = { threshold: 0.15 };
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const lines = this.links.map(l => l.line);
        const intersects = this.raycaster.intersectObjects(lines, false);
        if (!intersects.length)
            return null;
        const line = intersects[0].object;
        return this.links.find(l => l.line === line) || null;
    }
    getPointOnPlane(event, plane) {
        this.updateMouse(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const result = this.raycaster.ray.intersectPlane(plane, this.intersectionPoint);
        return result ? this.intersectionPoint.clone() : null;
    }
    updateMouse(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    convertNodeToPosition(node) {
        return {
            x: node.mesh.position.x,
            y: node.mesh.position.y
        };
    }
    resetNodeColor() {
        this.nodes.forEach(node => this.highlightNode(node, false));
    }
    highlightNode(node, selected) {
        const material = node.mesh.material;
        material.color.setHex(selected ? this.selectedNodeColor : this.defaultNodeColor);
    }
    isSelectedTool(tool) {
        return this.selected_tool === tool ? `${tool} selected` : `${tool}`;
    }
    selectTool(tool) {
        if (this.selected_tool === tool)
            return;
        this.resetNodeColor();
        this.placing_link = false;
        this.from = null;
        this.selected_tool = tool;
    }
    getToolName(tool) {
        return this.translator.graphConstructorToolsName(tool);
    }
    saveGraph() {
        this.graphConstructorService.save().then(success => {
            if (success === true) {
                this.resetGraphEdition();
            }
        });
    }
    resetGraphEdition() {
        this.nodes.forEach(node => {
            this.scene.remove(node.mesh);
            node.mesh.geometry.dispose();
            node.mesh.material.dispose();
        });
        this.links.forEach(link => {
            this.scene.remove(link.line);
            link.line.geometry.dispose();
            link.line.material.dispose();
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
GraphConstructorComponent.ɵfac = function GraphConstructorComponent_Factory(t) { return new (t || GraphConstructorComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_translate_translate_service__WEBPACK_IMPORTED_MODULE_3__["TranslateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_graph_constructor_graph_constructor_service__WEBPACK_IMPORTED_MODULE_4__["GraphConstructorService"])); };
GraphConstructorComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: GraphConstructorComponent, selectors: [["app-graph-constructor"]], viewQuery: function GraphConstructorComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 3);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
    } }, decls: 20, vars: 1, consts: [[1, "editor-page"], ["id", "canvas", 1, "editor-canvas"], ["canvas", ""], [1, "top-bar"], [1, "top-buttons"], ["routerLink", "/game-mode-selection", 1, "top-button"], [1, "top-icon"], [1, "top-text"], [1, "top-button", 3, "click"], [1, "bottom-bar"], [1, "tool-buttons"], ["class", "tool-button", 3, "active", "click", 4, "ngFor", "ngForOf"], [1, "tool-button", "save-button", 3, "click"], [1, "tool-button", 3, "click"]], template: function GraphConstructorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "\u2302");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "MENU");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GraphConstructorComponent_Template_button_click_10_listener() { return ctx.resetGraphEdition(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "\u27F2");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "RESET");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, GraphConstructorComponent_button_17_Template, 2, 3, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GraphConstructorComponent_Template_button_click_18_listener() { return ctx.saveGraph(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, " Enregistrer ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.tools);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLink"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"]], styles: [".editor-page[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100vw;\n  height: 100vh;\n  background: #f5f7fb;\n  overflow: hidden;\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.editor-canvas[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n}\n\n.top-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  z-index: 20;\n}\n\n.top-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  background: rgba(255, 255, 255, 0.8);\n  border: 1px solid rgba(0, 0, 0, 0.08);\n  border-radius: 10px;\n  padding: 8px;\n  backdrop-filter: blur(8px);\n}\n\n.top-button[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  padding: 10px 16px;\n  cursor: pointer;\n  border-radius: 8px;\n  color: #666;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  transition: background 0.2s, color 0.2s;\n}\n\n.top-button[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.05);\n  color: #1e88e5;\n}\n\n.top-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n\n.top-text[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 1px;\n}\n\n.bottom-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 20;\n}\n\n.tool-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.tool-button[_ngcontent-%COMP%] {\n  padding: 12px 18px;\n  border: 1px solid rgba(0, 0, 0, 0.08);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.85);\n  color: #444;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.2s, color 0.2s, border-color 0.2s;\n}\n\n.tool-button[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.tool-button.active[_ngcontent-%COMP%] {\n  background: #1e88e5;\n  color: white;\n  border-color: #1e88e5;\n}\n\n.save-button[_ngcontent-%COMP%] {\n  background: #19b37d;\n  color: white;\n  border-color: #19b37d;\n}\n\n.save-button[_ngcontent-%COMP%]:hover {\n  background: #14966a;\n  border-color: #14966a;\n}\n\n@media (max-width: 768px) {\n  .top-bar[_ngcontent-%COMP%] {\n    top: 12px;\n    left: 12px;\n  }\n\n  .bottom-bar[_ngcontent-%COMP%] {\n    bottom: 12px;\n    width: calc(100% - 24px);\n  }\n\n  .tool-buttons[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .tool-button[_ngcontent-%COMP%] {\n    font-size: 13px;\n    padding: 10px 14px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxncmFwaC1jb25zdHJ1Y3Rvci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EseUNBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtBQUNGOztBQUVBO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFdBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSxTQUFBO0VBQ0Esb0NBQUE7RUFDQSxxQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLDBCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSx1Q0FBQTtBQUNGOztBQUVBO0VBQ0UsK0JBQUE7RUFDQSxjQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQUNGOztBQUVBO0VBQ0Usa0JBQUE7RUFDQSxZQUFBO0VBQ0EsU0FBQTtFQUNBLDJCQUFBO0VBQ0EsV0FBQTtBQUNGOztBQUVBO0VBQ0UsYUFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0EsdUJBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EscUNBQUE7RUFDQSxrQkFBQTtFQUNBLHFDQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSwwREFBQTtBQUNGOztBQUVBO0VBQ0UsK0JBQUE7QUFDRjs7QUFFQTtFQUNFLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLHFCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxxQkFBQTtBQUNGOztBQUVBO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtBQUNGOztBQUVBO0VBQ0U7SUFDRSxTQUFBO0lBQ0EsVUFBQTtFQUNGOztFQUVBO0lBQ0UsWUFBQTtJQUNBLHdCQUFBO0VBQ0Y7O0VBRUE7SUFDRSxXQUFBO0VBQ0Y7O0VBRUE7SUFDRSxlQUFBO0lBQ0Esa0JBQUE7RUFDRjtBQUNGIiwiZmlsZSI6ImdyYXBoLWNvbnN0cnVjdG9yLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmVkaXRvci1wYWdlIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgYmFja2dyb3VuZDogI2Y1ZjdmYjtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xyXG59XHJcblxyXG4uZWRpdG9yLWNhbnZhcyB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGluc2V0OiAwO1xyXG59XHJcblxyXG4udG9wLWJhciB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMjBweDtcclxuICBsZWZ0OiAyMHB4O1xyXG4gIHotaW5kZXg6IDIwO1xyXG59XHJcblxyXG4udG9wLWJ1dHRvbnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZ2FwOiAxMHB4O1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcclxuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDgpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgcGFkZGluZzogOHB4O1xyXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cig4cHgpO1xyXG59XHJcblxyXG4udG9wLWJ1dHRvbiB7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIHBhZGRpbmc6IDEwcHggMTZweDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gIGNvbG9yOiAjNjY2O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogNHB4O1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycywgY29sb3IgMC4ycztcclxufVxyXG5cclxuLnRvcC1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4wNSk7XHJcbiAgY29sb3I6ICMxZTg4ZTU7XHJcbn1cclxuXHJcbi50b3AtaWNvbiB7XHJcbiAgZm9udC1zaXplOiAxOHB4O1xyXG59XHJcblxyXG4udG9wLXRleHQge1xyXG4gIGZvbnQtc2l6ZTogMTFweDtcclxuICBmb250LXdlaWdodDogNjAwO1xyXG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XHJcbn1cclxuXHJcbi5ib3R0b20tYmFyIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm90dG9tOiAyMHB4O1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XHJcbiAgei1pbmRleDogMjA7XHJcbn1cclxuXHJcbi50b29sLWJ1dHRvbnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZ2FwOiAxMHB4O1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuLnRvb2wtYnV0dG9uIHtcclxuICBwYWRkaW5nOiAxMnB4IDE4cHg7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjA4KTtcclxuICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg1KTtcclxuICBjb2xvcjogIzQ0NDtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzLCBjb2xvciAwLjJzLCBib3JkZXItY29sb3IgMC4ycztcclxufVxyXG5cclxuLnRvb2wtYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMDUpO1xyXG59XHJcblxyXG4udG9vbC1idXR0b24uYWN0aXZlIHtcclxuICBiYWNrZ3JvdW5kOiAjMWU4OGU1O1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBib3JkZXItY29sb3I6ICMxZTg4ZTU7XHJcbn1cclxuXHJcbi5zYXZlLWJ1dHRvbiB7XHJcbiAgYmFja2dyb3VuZDogIzE5YjM3ZDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyLWNvbG9yOiAjMTliMzdkO1xyXG59XHJcblxyXG4uc2F2ZS1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQ6ICMxNDk2NmE7XHJcbiAgYm9yZGVyLWNvbG9yOiAjMTQ5NjZhO1xyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcclxuICAudG9wLWJhciB7XHJcbiAgICB0b3A6IDEycHg7XHJcbiAgICBsZWZ0OiAxMnB4O1xyXG4gIH1cclxuXHJcbiAgLmJvdHRvbS1iYXIge1xyXG4gICAgYm90dG9tOiAxMnB4O1xyXG4gICAgd2lkdGg6IGNhbGMoMTAwJSAtIDI0cHgpO1xyXG4gIH1cclxuXHJcbiAgLnRvb2wtYnV0dG9ucyB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICB9XHJcblxyXG4gIC50b29sLWJ1dHRvbiB7XHJcbiAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XHJcbiAgfVxyXG59Il19 */"] });


/***/ }),

/***/ "O2ao":
/*!************************************************!*\
  !*** ./src/app/models/Graph/Grid/Tore/tore.ts ***!
  \************************************************/
/*! exports provided: Tore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tore", function() { return Tore; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../graph */ "Z/gq");


class Tore extends _graph__WEBPACK_IMPORTED_MODULE_1__["Graph"] {
    constructor(nodes, links, width, height) {
        super(nodes, links, "tore");
        this.grid = {
            cells: [],
            init: function (tab_width, tab_height, canvas_width, canvas_height) {
                this.cells = [];
                for (let row = 0; row < tab_height; ++row) {
                    const y = row * canvas_height / tab_height + (canvas_height / tab_height) / 2;
                    for (let col = 0; col < tab_width; ++col) {
                        const x = col * canvas_width / tab_width + (canvas_width / tab_width) / 2;
                        this.cells.push({
                            id: row * tab_width + col,
                            x: x,
                            y: y,
                            occupied: false
                        });
                    }
                }
            },
            getCell: function (d) {
                return this.cells[d.index];
            }
        };
        this._grid_width = width;
        this._grid_height = height;
    }
    get width() {
        return this._grid_width;
    }
    get height() {
        return this._grid_height;
    }
    draw(svg) {
        const canvas_width = parseInt(svg.style("width"), 10);
        const canvas_height = parseInt(svg.style("height"), 10);
        this.grid.init(this._grid_width, this._grid_height, canvas_width, canvas_height);
        for (let row = 0; row < this._grid_height; ++row) {
            const y = row * canvas_height / this._grid_height + (canvas_height / this._grid_height) / 2;
            const margin = ((canvas_width / this._grid_width) / 2) / 2;
            const x1 = (canvas_width / this._grid_width) / 2 - margin;
            const x2 = canvas_width - (canvas_width / this._grid_width) / 2 + margin;
            svg.append('line')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', canvas_width)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)')
                .style('stroke-dasharray', '4, 10');
            svg.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .style('stroke', 'rgb(170, 170, 170)');
        }
        for (let col = 0; col < this._grid_width; ++col) {
            const x = col * canvas_width / this._grid_width + (canvas_width / this._grid_width) / 2;
            const margin = ((canvas_height / this._grid_height) / 2) / 2;
            const y1 = (canvas_height / this._grid_height) / 2 - margin;
            const y2 = canvas_height - (canvas_height / this._grid_height) / 2 + margin;
            svg.append('line')
                .attr('x1', x)
                .attr('y1', y1)
                .attr('x2', x)
                .attr('y2', y2)
                .style('stroke', 'rgb(170, 170, 170)');
            svg.append('line')
                .attr('x1', x)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', canvas_height)
                .style('stroke', 'rgb(170, 170, 170)')
                .style('stroke-dasharray', '4, 10');
        }
        this.svgLinks = svg.selectAll("links")
            .data(this.links)
            .join("line");
        this.svgNodes = svg.selectAll("nodes")
            .data(this.nodes)
            .join("circle")
            .attr("r", 20)
            .attr("class", "circle")
            .style("fill", "#69b3a2");
        this.simulate(svg);
    }
    simulate(svg) {
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_0__["forceSimulation"](this.nodes)
            .force("link", d3__WEBPACK_IMPORTED_MODULE_0__["forceLink"]()
            .links(this.links))
            .on("tick", this.ticked.bind(this));
    }
    stop() {
    }
    ticked() {
        this.svgLinks
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        this.svgNodes
            .each((d) => {
            let gridpoint = this.grid.getCell(d);
            if (gridpoint) {
                d.x += (gridpoint.x - d.x);
                d.y += (gridpoint.y - d.y);
            }
        })
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}


/***/ }),

/***/ "PDYC":
/*!***************************************************************!*\
  !*** ./src/app/components/game-board/game-board.component.ts ***!
  \***************************************************************/
/*! exports provided: GameBoardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameBoardComponent", function() { return GameBoardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "RyHr");
/* harmony import */ var three_examples_jsm_controls_DragControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/controls/DragControls */ "I+5t");
/* harmony import */ var src_app_models_Pawn_Cops_cops__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/models/Pawn/Cops/cops */ "PXcp");
/* harmony import */ var src_app_models_Pawn_Thief_thief__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/models/Pawn/Thief/thief */ "tT8E");
/* harmony import */ var src_app_models_GameAction_game_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/models/GameAction/game-action */ "RsS5");
/* harmony import */ var src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/models/Pawn/PawnState/pawn-states */ "KjiV");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_graph_graph_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/_services/graph/graph.service */ "daKe");
/* harmony import */ var src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/_services/game/game.service */ "eiSD");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_app_services_Adventure_adventure_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/_services/Adventure/adventure.service */ "rB2e");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ "ofXK");















const _c0 = ["visualizer"];
function GameBoardComponent_ng_container_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.getRemainingTurnCount());
} }
function GameBoardComponent_ng_container_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "\u26A0 0");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} }
function GameBoardComponent_ng_container_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "FIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
} }
function GameBoardComponent_button_48_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_button_48_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r7.cancelAction(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "\u27F5");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Annuler");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r4.isGameActionEmpty() || ctx_r4.getTurnCount() === 0);
} }
function GameBoardComponent_button_49_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_button_49_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r9.seeWarningZone(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "\u25C8");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "Zone danger");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} }
function GameBoardComponent_button_50_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_button_50_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](); return ctx_r11.moveNodeMode(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "\u2725");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("is-active", ctx_r6.movingNodes);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r6.movingNodes ? "Verrouiller" : "D\u00E9placer les noeuds");
} }
class GameBoardComponent {
    constructor(graphService, gameManager, activatedRoute, adventureService, cdr) {
        this.graphService = graphService;
        this.gameManager = gameManager;
        this.activatedRoute = activatedRoute;
        this.adventureService = adventureService;
        this.cdr = cdr;
        this.warningZone = false;
        this.thiefs = [];
        this.cops = [];
        this.isAdventure = false;
        this.movingNodes = false;
        this.raycaster = new three__WEBPACK_IMPORTED_MODULE_1__["Raycaster"]();
        this.mouse = new three__WEBPACK_IMPORTED_MODULE_1__["Vector2"]();
        this.nodeMeshes = [];
        this.pawnSprites = [];
        this.nodeMeshMap = new Map();
        this.animationFrameId = 0;
        this._lerpTarget = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
        this.isAnimating = false;
        this.nodeRadius = 0.42;
        this.edgeRadius = 0.09;
        this.gridSpacing = 2.8;
        this.wrapOffset = 1.15;
        this.wrapHeight = 1.1;
        this.nodeZ = 0.35;
        this.pawnZ = 1.25;
    }
    ngOnInit() {
        var _a;
        this.activatedRoute.queryParams.subscribe(params => {
            this.gameMode = params['gameMode'];
            this.isAdventure = params['adventure'] === 'true';
            this.gameManager.setIsAdventure(this.isAdventure);
        });
        if ((_a = this.canvasContainer) === null || _a === void 0 ? void 0 : _a.nativeElement) {
            this.canvasContainer.nativeElement.style.visibility = 'hidden';
        }
    }
    ngAfterViewInit() {
        var _a;
        this.initThreeJs();
        this.initGameLogic();
        this.drawGraph3D();
        this.initDragControls();
        if ((_a = this.canvasContainer) === null || _a === void 0 ? void 0 : _a.nativeElement) {
            this.canvasContainer.nativeElement.style.visibility = 'visible';
        }
        this.animate();
        this.gameManager.update();
        this.cdr.detectChanges();
    }
    initThreeJs() {
        const width = this.canvasContainer.nativeElement.clientWidth;
        const height = this.canvasContainer.nativeElement.clientHeight;
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__["Scene"]();
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__["Color"](0xf5f6fa);
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__["PerspectiveCamera"](75, width / height, 0.1, 1000);
        this.camera.position.set(0, -10, 18);
        this.camera.lookAt(0, 0, 0);
        this.addLights();
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__["WebGLRenderer"]({ antialias: true, alpha: false });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);
        this.orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__["OrbitControls"](this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.minDistance = 8;
        this.orbitControls.maxDistance = 40;
        this.orbitControls.maxPolarAngle = Math.PI / 2.05;
        this.orbitControls.update();
        this.renderer.domElement.addEventListener('pointerdown', (e) => this.onMouseClick(e));
    }
    addLights() {
        this.scene.add(new three__WEBPACK_IMPORTED_MODULE_1__["AmbientLight"](0xffffff, 0.72));
        const dirLight1 = new three__WEBPACK_IMPORTED_MODULE_1__["DirectionalLight"](0xffffff, 0.9);
        dirLight1.position.set(10, 10, 14);
        this.scene.add(dirLight1);
        const dirLight2 = new three__WEBPACK_IMPORTED_MODULE_1__["DirectionalLight"](0xffffff, 0.35);
        dirLight2.position.set(-8, -10, 8);
        this.scene.add(dirLight2);
    }
    getNodeId(node) {
        return String(node.id !== undefined ? node.id : node.index);
    }
    getEdgeEndpointId(endpoint) {
        if ((endpoint === null || endpoint === void 0 ? void 0 : endpoint.id) !== undefined)
            return String(endpoint.id);
        if ((endpoint === null || endpoint === void 0 ? void 0 : endpoint.index) !== undefined)
            return String(endpoint.index);
        return String(endpoint);
    }
    getGridDimensions(graphData, nodeCount) {
        const width = graphData.width || Math.ceil(Math.sqrt(nodeCount));
        const height = graphData.height || Math.ceil(nodeCount / width);
        return { width, height };
    }
    getGridPosition(index, width, height) {
        return new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]((index % width - (width - 1) / 2) * this.gridSpacing, -(Math.floor(index / width) - (height - 1) / 2) * this.gridSpacing, this.nodeZ);
    }
    getGridBounds(width, height) {
        return {
            left: -((width - 1) / 2) * this.gridSpacing,
            right: ((width - 1) / 2) * this.gridSpacing,
            top: ((height - 1) / 2) * this.gridSpacing,
            bottom: -((height - 1) / 2) * this.gridSpacing
        };
    }
    getIndexFromId(graphData, id) {
        return graphData.nodes.findIndex((n) => this.getNodeId(n) === id);
    }
    isHorizontalWrapEdge(sourceIndex, targetIndex, width) {
        const sRow = Math.floor(sourceIndex / width);
        const tRow = Math.floor(targetIndex / width);
        const sCol = sourceIndex % width;
        const tCol = targetIndex % width;
        return sRow === tRow && Math.abs(sCol - tCol) === width - 1;
    }
    isVerticalWrapEdge(sourceIndex, targetIndex, width, height) {
        const sRow = Math.floor(sourceIndex / width);
        const tRow = Math.floor(targetIndex / width);
        const sCol = sourceIndex % width;
        const tCol = targetIndex % width;
        return sCol === tCol && Math.abs(sRow - tRow) === height - 1;
    }
    drawNodeGraph3D(nodeData, x, y, z = this.nodeZ) {
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](this.nodeRadius, 32, 32);
        const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
            color: 0x66cdaa,
            metalness: 0.35,
            roughness: 0.35,
            transparent: true,
            opacity: 0.95
        });
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        mesh.position.set(x, y, z);
        const id = nodeData.id !== undefined ? nodeData.id : nodeData.index;
        mesh.userData = {
            id: String(id),
            infosNode: nodeData
        };
        this.scene.add(mesh);
        return mesh;
    }
    drawEdgeGraph3D(sourcePos, targetPos, edgeData) {
        const distance = sourcePos.distanceTo(targetPos);
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["CylinderGeometry"](this.edgeRadius, this.edgeRadius, distance, 10);
        const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
            color: 0xd0d0d0,
            metalness: 0.2,
            roughness: 0.75
        });
        const cylinder = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        const midpoint = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]().addVectors(sourcePos, targetPos).multiplyScalar(0.5);
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
    drawToroidalWrapEdge3D(sourcePos, targetPos, edgeData, sourceIndex, targetIndex, width, height) {
        const bounds = this.getGridBounds(width, height);
        const sourceCol = sourceIndex % width;
        const targetCol = targetIndex % width;
        const sourceRow = Math.floor(sourceIndex / width);
        const targetRow = Math.floor(targetIndex / width);
        let points = [];
        if (this.isHorizontalWrapEdge(sourceIndex, targetIndex, width)) {
            const outerX = (sourceCol === 0 || targetCol === 0)
                ? bounds.left - this.wrapOffset
                : bounds.right + this.wrapOffset;
            points = [
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, sourcePos.y, sourcePos.z),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](outerX, sourcePos.y, this.wrapHeight * 0.45),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](outerX, sourcePos.y, this.wrapHeight),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](targetPos.x, targetPos.y, targetPos.z)
            ];
        }
        else if (this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)) {
            const outerY = (sourceRow === 0 || targetRow === 0)
                ? bounds.top + this.wrapOffset
                : bounds.bottom - this.wrapOffset;
            points = [
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, sourcePos.y, sourcePos.z),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, outerY, this.wrapHeight * 0.45),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, outerY, this.wrapHeight),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](targetPos.x, targetPos.y, targetPos.z)
            ];
        }
        else {
            return this.drawEdgeGraph3D(sourcePos, targetPos, edgeData);
        }
        const curve = new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](points);
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__["TubeGeometry"](curve, 36, this.edgeRadius * 0.92, 10, false);
        const material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshStandardMaterial"]({
            color: 0xd8d8d8,
            metalness: 0.18,
            roughness: 0.82
        });
        const tube = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        tube.userData = {
            sourceId: this.getEdgeEndpointId(edgeData.source),
            targetId: this.getEdgeEndpointId(edgeData.target),
            isEdge: true,
            isWrapEdge: true
        };
        this.scene.add(tube);
        return tube;
    }
    drawGraph3D() {
        var _a;
        const graphData = this.graphService.getGraph();
        if (!((_a = graphData === null || graphData === void 0 ? void 0 : graphData.nodes) === null || _a === void 0 ? void 0 : _a.length))
            return;
        this.nodeMeshMap.clear();
        this.nodeMeshes = [];
        const nodes = graphData.nodes;
        const typology = graphData.typology;
        const { width, height } = this.getGridDimensions(graphData, nodes.length);
        nodes.forEach((node, index) => {
            let position = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
            switch (typology) {
                case 'grid':
                case 'tore':
                    position = this.getGridPosition(index, width, height);
                    break;
                case 'cycle': {
                    const angle = (index / nodes.length) * Math.PI * 2;
                    const radius = Math.max(5, nodes.length * 0.5);
                    position.set(radius * Math.cos(angle), radius * Math.sin(angle), this.nodeZ);
                    break;
                }
                case 'tree': {
                    const level = Math.floor(Math.log2(index + 1));
                    const posInLevel = index - (Math.pow(2, level) - 1);
                    const nodesInLevel = Math.pow(2, level);
                    position.set((posInLevel - nodesInLevel / 2 + 0.5) * (20 / nodesInLevel), 10 - level * 3, this.nodeZ);
                    break;
                }
                default:
                    if (node.x !== undefined &&
                        node.y !== undefined &&
                        !isNaN(node.x) &&
                        !isNaN(node.y)) {
                        position = this.getSpecificGraphPosition(node, nodes);
                    }
                    else {
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
        edges.forEach((edge) => {
            const sourceId = this.getEdgeEndpointId(edge.source);
            const targetId = this.getEdgeEndpointId(edge.target);
            const sourceMesh = this.nodeMeshMap.get(sourceId);
            const targetMesh = this.nodeMeshMap.get(targetId);
            if (!sourceMesh || !targetMesh)
                return;
            if (typology === 'tore') {
                const sourceIndex = this.getIndexFromId(graphData, sourceId);
                const targetIndex = this.getIndexFromId(graphData, targetId);
                if (this.isHorizontalWrapEdge(sourceIndex, targetIndex, width) ||
                    this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)) {
                    this.drawToroidalWrapEdge3D(sourceMesh.position.clone(), targetMesh.position.clone(), edge, sourceIndex, targetIndex, width, height);
                }
                else {
                    this.drawEdgeGraph3D(sourceMesh.position.clone(), targetMesh.position.clone(), edge);
                }
            }
            else {
                this.drawEdgeGraph3D(sourceMesh.position.clone(), targetMesh.position.clone(), edge);
            }
        });
    }
    initGameLogic() {
        this.gameManager.setValidateTurnCallback(this.validateTurn.bind(this));
        this.gameManager.setDisplayWarningZone(this.seeWarningZone.bind(this));
        this.cops = [];
        this.thiefs = [];
        for (let i = 0; i < this.gameManager.getCopsNumber(); i++) {
            this.cops.push(new src_app_models_Pawn_Cops_cops__WEBPACK_IMPORTED_MODULE_4__["Cops"](this.gameManager, this.graphService, -12, i * 2, i));
        }
        this.thiefs.push(new src_app_models_Pawn_Thief_thief__WEBPACK_IMPORTED_MODULE_5__["Thief"](this.gameManager, this.graphService, -12, -5));
        this.gameManager.setGameMode(this.gameMode);
        this.graphService.setGameMode(this.gameMode);
        this.gameManager.setPawns(this.thiefs, this.cops);
        this.gameManager.calculateMaxTurnCount();
        this.initPawnsVisuals3D();
    }
    initPawnsVisuals3D() {
        const loader = new three__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]();
        const thiefTexture = loader.load('assets/board/thief.svg');
        const policeTexture = loader.load('assets/board/police.svg');
        const thiefMat = new three__WEBPACK_IMPORTED_MODULE_1__["SpriteMaterial"]({ map: thiefTexture, transparent: true });
        const policeMat = new three__WEBPACK_IMPORTED_MODULE_1__["SpriteMaterial"]({ map: policeTexture, transparent: true });
        this.pawnSprites = [];
        this.thiefs.forEach(thief => {
            const sprite = new three__WEBPACK_IMPORTED_MODULE_1__["Sprite"](thiefMat.clone());
            sprite.scale.set(1.5, 1.5, 1);
            sprite.position.set(-12, 5, this.pawnZ);
            sprite.userData = { logicPawn: thief, type: 'thief' };
            this.scene.add(sprite);
            this.pawnSprites.push(sprite);
        });
        this.cops.forEach(cop => {
            const sprite = new three__WEBPACK_IMPORTED_MODULE_1__["Sprite"](policeMat.clone());
            sprite.scale.set(1.5, 1.5, 1);
            sprite.position.set(-12, 0, this.pawnZ);
            sprite.userData = { logicPawn: cop, type: 'cop' };
            this.scene.add(sprite);
            this.pawnSprites.push(sprite);
        });
        thiefMat.dispose();
        policeMat.dispose();
    }
    onMouseClick(event) {
        if (this.movingNodes || this.isAnimating)
            return;
        const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodeMeshes);
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            this.handleNodeClick(Number(clickedMesh.userData['id']));
        }
    }
    handleNodeClick(nodeId) {
        const graph = this.graphService.getGraph();
        const clickedNode = graph.nodes.find((n) => String(n.id !== undefined ? n.id : n.index) === String(nodeId));
        if (!clickedNode)
            return;
        if (!this.gameManager.gameHasStarted()) {
            const aiSide = this.gameManager.getAiSide();
            let pawnToPlace = null;
            if (aiSide === 'cops') {
                if (this.gameManager.copsArePlaced()) {
                    pawnToPlace = this.thiefs.find(t => t.isWaitingPlacement());
                }
            }
            else if (aiSide === 'thief') {
                pawnToPlace = this.cops.find(c => c.isWaitingPlacement());
            }
            else {
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
                pawnToPlace.state = src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_7__["GlobalPawnStates"].waitingTurnState;
                this.gameManager.update();
            }
        }
        else if (this.gameManager.isPlayerTurn()) {
            const isThiefTurn = this.gameManager.isThiefTurn();
            let activePawn = [...this.cops, ...this.thiefs].find(p => p.onTurn());
            if (!activePawn) {
                activePawn = isThiefTurn
                    ? this.thiefs.find(t => !t.hasPlayed())
                    : this.cops.find(c => !c.hasPlayed());
            }
            if (activePawn) {
                const currentNode = graph.nodes.find((n) => String(n.id !== undefined ? n.id : n.index) === String(activePawn.currentNodeId));
                const speed = activePawn.role.includes('thief')
                    ? this.gameManager.getThiefSpeed()
                    : 1;
                const accessibleNodes = this.graphService.showPossibleMove({ __data__: currentNode }, speed);
                const isAccessible = accessibleNodes.some((n) => String(n.id !== undefined ? n.id : n.index) === String(nodeId));
                if (isAccessible) {
                    const normalizedId = clickedNode.id !== undefined
                        ? Number(clickedNode.id)
                        : Number(clickedNode.index);
                    this.gameManager.addGameAction(new src_app_models_GameAction_game_action__WEBPACK_IMPORTED_MODULE_6__["GameAction"](activePawn, currentNode, clickedNode));
                    activePawn.currentNodeId = normalizedId;
                    if (activePawn instanceof src_app_models_Pawn_Thief_thief__WEBPACK_IMPORTED_MODULE_5__["Thief"]) {
                        this.gameManager.updateThiefPosition(activePawn, clickedNode);
                    }
                    else {
                        this.gameManager.updateCopsPosition(activePawn, clickedNode);
                    }
                    activePawn.state = src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_7__["GlobalPawnStates"].waitingTurnState;
                    this.gameManager.update();
                }
            }
        }
    }
    updateStraightEdgeTransform(mesh, sourcePos, targetPos) {
        const geometry = mesh.geometry;
        const baseHeight = geometry.parameters.height || 1;
        const distance = sourcePos.distanceTo(targetPos);
        const midpoint = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]().addVectors(sourcePos, targetPos).multiplyScalar(0.5);
        mesh.position.copy(midpoint);
        mesh.lookAt(targetPos);
        mesh.rotateX(Math.PI / 2);
        mesh.scale.set(1, distance / baseHeight, 1);
    }
    rebuildWrapEdgeGeometry(mesh, sourcePos, targetPos, sourceId, targetId, graphData, width, height) {
        const sourceIndex = this.getIndexFromId(graphData, sourceId);
        const targetIndex = this.getIndexFromId(graphData, targetId);
        const bounds = this.getGridBounds(width, height);
        const sourceCol = sourceIndex % width;
        const targetCol = targetIndex % width;
        const sourceRow = Math.floor(sourceIndex / width);
        const targetRow = Math.floor(targetIndex / width);
        let points = [];
        if (this.isHorizontalWrapEdge(sourceIndex, targetIndex, width)) {
            const outerX = (sourceCol === 0 || targetCol === 0)
                ? bounds.left - this.wrapOffset
                : bounds.right + this.wrapOffset;
            points = [
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, sourcePos.y, sourcePos.z),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](outerX, sourcePos.y, this.wrapHeight * 0.45),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](outerX, sourcePos.y, this.wrapHeight),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](targetPos.x, targetPos.y, targetPos.z)
            ];
        }
        else if (this.isVerticalWrapEdge(sourceIndex, targetIndex, width, height)) {
            const outerY = (sourceRow === 0 || targetRow === 0)
                ? bounds.top + this.wrapOffset
                : bounds.bottom - this.wrapOffset;
            points = [
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, sourcePos.y, sourcePos.z),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, outerY, this.wrapHeight * 0.45),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](sourcePos.x, outerY, this.wrapHeight),
                new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](targetPos.x, targetPos.y, targetPos.z)
            ];
        }
        const curve = new three__WEBPACK_IMPORTED_MODULE_1__["CatmullRomCurve3"](points);
        const newGeometry = new three__WEBPACK_IMPORTED_MODULE_1__["TubeGeometry"](curve, 36, this.edgeRadius * 0.92, 10, false);
        mesh.geometry.dispose();
        mesh.geometry = newGeometry;
    }
    updateLinesPositions() {
        var _a;
        const graphData = this.graphService.getGraph();
        const typology = graphData === null || graphData === void 0 ? void 0 : graphData.typology;
        const { width, height } = this.getGridDimensions(graphData, ((_a = graphData === null || graphData === void 0 ? void 0 : graphData.nodes) === null || _a === void 0 ? void 0 : _a.length) || 0);
        this.scene.children.forEach(child => {
            if (!child.userData['isEdge'])
                return;
            const edgeMesh = child;
            const sourceId = String(edgeMesh.userData['sourceId']);
            const targetId = String(edgeMesh.userData['targetId']);
            const sourceMesh = this.nodeMeshes.find(m => String(m.userData['id']) === sourceId);
            const targetMesh = this.nodeMeshes.find(m => String(m.userData['id']) === targetId);
            if (!sourceMesh || !targetMesh)
                return;
            if (typology === 'tore' && edgeMesh.userData['isWrapEdge']) {
                this.rebuildWrapEdgeGeometry(edgeMesh, sourceMesh.position.clone(), targetMesh.position.clone(), sourceId, targetId, graphData, width, height);
            }
            else {
                this.updateStraightEdgeTransform(edgeMesh, sourceMesh.position.clone(), targetMesh.position.clone());
            }
        });
    }
    moveNodeMode() {
        this.movingNodes = !this.movingNodes;
        this.graphService.movingPermission(this.movingNodes);
        if (this.dragControls) {
            this.dragControls.enabled = this.movingNodes;
        }
    }
    onWindowResize() {
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
    cancelAction() {
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
    seeWarningZone() {
        this.warningZone = !this.warningZone;
    }
    getSpecificGraphPosition(node, allNodes) {
        const validNodes = allNodes.filter((n) => n.x !== undefined &&
            n.y !== undefined &&
            !isNaN(n.x) &&
            !isNaN(n.y));
        if (validNodes.length === 0) {
            return new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](0, 0, this.nodeZ);
        }
        const minX = Math.min(...validNodes.map((n) => n.x));
        const maxX = Math.max(...validNodes.map((n) => n.x));
        const minY = Math.min(...validNodes.map((n) => n.y));
        const maxY = Math.max(...validNodes.map((n) => n.y));
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
        return new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]((node.x - centerX) * scale, -(node.y - centerY) * scale, this.nodeZ);
    }
    validateTurn() {
        var _a, _b, _c;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.isAnimating)
                return;
            this.warningZone = false;
            const res = yield this.gameManager.validateTurn();
            if (res && res.gameTimer !== undefined) {
                res.gameTimer = Math.trunc(res.gameTimer / 1000);
                if (res.wonByPlayer !== undefined || ((_a = res.result) === null || _a === void 0 ? void 0 : _a.isConfirmed)) {
                    if (res.isAdventure) {
                        if (res.wonByPlayer || ((_b = res.result) === null || _b === void 0 ? void 0 : _b.isConfirmed)) {
                            if (yield this.adventureService.goToNextLevel()) {
                                this.replay();
                            }
                            else {
                                this.gameManager.reset();
                            }
                        }
                        else {
                            sweetalert2__WEBPACK_IMPORTED_MODULE_8___default.a.fire('Réssayer', 'Échec.', 'error').then(() => this.replay());
                        }
                    }
                    else {
                        this.replay();
                    }
                }
                else if (!((_c = res.result) === null || _c === void 0 ? void 0 : _c.isConfirmed)) {
                    this.gameManager.goBackToMenu();
                }
            }
        });
    }
    updateNodesColor() {
        const dangerousNodes = new Set();
        const accessibleNodes = new Set();
        const graphData = this.graphService.getGraph();
        if (this.warningZone) {
            this.cops.forEach(cop => {
                if (cop.currentNodeId !== undefined && cop.currentNodeId !== -1) {
                    dangerousNodes.add(String(cop.currentNodeId));
                    const node = graphData.nodes.find((n) => String(n.id !== undefined ? n.id : n.index) === String(cop.currentNodeId));
                    if (node) {
                        this.graphService.edges(node).forEach((neighbor) => {
                            dangerousNodes.add(String(neighbor.id !== undefined ? neighbor.id : neighbor.index));
                        });
                    }
                }
            });
        }
        if (this.gameManager.isPlayerTurn() && this.gameManager.gameHasStarted()) {
            const isThiefTurn = this.gameManager.isThiefTurn();
            const activePawn = [...this.cops, ...this.thiefs].find(p => p.onTurn()) ||
                (isThiefTurn ? this.thiefs.find(t => !t.hasPlayed()) : this.cops.find(c => !c.hasPlayed()));
            if (activePawn && activePawn.currentNodeId !== undefined && activePawn.currentNodeId !== -1) {
                const node = graphData.nodes.find((n) => String(n.id !== undefined ? n.id : n.index) === String(activePawn.currentNodeId));
                if (node) {
                    const speed = activePawn.role.includes('thief') ? this.gameManager.getThiefSpeed() : 1;
                    this.graphService.showPossibleMove({ __data__: node }, speed).forEach((n) => {
                        accessibleNodes.add(String(n.id !== undefined ? n.id : n.index));
                    });
                }
            }
        }
        this.nodeMeshes.forEach(mesh => {
            const material = mesh.material;
            const nodeId = String(mesh.userData['id']);
            if (this.warningZone && dangerousNodes.has(nodeId)) {
                material.color.set(0xff0000);
            }
            else if (accessibleNodes.has(nodeId)) {
                material.color.set(0x05b800);
            }
            else {
                material.color.set(0x66cdaa);
            }
            material.needsUpdate = true;
        });
    }
    initDragControls() {
        this.dragControls = new three_examples_jsm_controls_DragControls__WEBPACK_IMPORTED_MODULE_3__["DragControls"](this.nodeMeshes, this.camera, this.renderer.domElement);
        this.dragControls.enabled = this.movingNodes;
        this.dragControls.addEventListener('dragstart', (event) => {
            this.orbitControls.enabled = false;
            const material = event.object.material;
            material.emissive.setHex(0x333333);
        });
        this.dragControls.addEventListener('dragend', (event) => {
            this.orbitControls.enabled = true;
            const material = event.object.material;
            material.emissive.setHex(0x000000);
            const mesh = event.object;
            if (mesh.userData['infosNode']) {
                mesh.userData['infosNode'].x = mesh.position.x;
                mesh.userData['infosNode'].y = mesh.position.y;
            }
        });
    }
    replay() {
        this.gameManager.replay().then(() => {
            this.scene.traverse((obj) => {
                if (obj.geometry)
                    obj.geometry.dispose();
                if (obj.material) {
                    Array.isArray(obj.material)
                        ? obj.material.forEach((m) => m.dispose())
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
    updatePawnsPositions3D() {
        let stillAnimating = false;
        this.pawnSprites.forEach(sprite => {
            const logicPawn = sprite.userData['logicPawn'];
            if (logicPawn.currentNodeId === undefined ||
                logicPawn.currentNodeId === null ||
                logicPawn.currentNodeId === -1) {
                return;
            }
            const targetNode = this.nodeMeshes.find(mesh => String(mesh.userData['id']) === String(logicPawn.currentNodeId));
            if (!targetNode)
                return;
            const material = sprite.material;
            const hasPlayed = logicPawn.state === src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_7__["GlobalPawnStates"].waitingTurnState;
            material.opacity = (hasPlayed && !this.gameManager.isPlayerTurn()) ? 0.5 : 1;
            this._lerpTarget.set(targetNode.position.x, targetNode.position.y, this.pawnZ);
            if (sprite.position.distanceTo(this._lerpTarget) > 0.05) {
                sprite.position.lerp(this._lerpTarget, 0.1);
                stillAnimating = true;
            }
            else {
                sprite.position.copy(this._lerpTarget);
            }
        });
        this.isAnimating = stillAnimating;
    }
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        if (this.movingNodes) {
            this.updateLinesPositions();
        }
        this.updatePawnsPositions3D();
        this.updateNodesColor();
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
    displayInfo() {
        sweetalert2__WEBPACK_IMPORTED_MODULE_8___default.a.fire({
            title: 'Règles',
            text: 'Capturez le voleur !',
            icon: 'info'
        });
    }
    ngOnDestroy() {
        var _a, _b, _c, _d;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.traverse((obj) => {
            if (obj.geometry)
                obj.geometry.dispose();
            if (obj.material) {
                Array.isArray(obj.material)
                    ? obj.material.forEach((m) => m.dispose())
                    : obj.material.dispose();
            }
        });
        (_b = this.dragControls) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.orbitControls) === null || _c === void 0 ? void 0 : _c.dispose();
        (_d = this.renderer) === null || _d === void 0 ? void 0 : _d.dispose();
    }
}
GameBoardComponent.ɵfac = function GameBoardComponent_Factory(t) { return new (t || GameBoardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_graph_graph_service__WEBPACK_IMPORTED_MODULE_10__["GraphService"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_11__["GameService"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_services_Adventure_adventure_service__WEBPACK_IMPORTED_MODULE_13__["AdventureService"]), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ChangeDetectorRef"])); };
GameBoardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({ type: GameBoardComponent, selectors: [["app-game-board"]], viewQuery: function GameBoardComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuery"](_c0, 3);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵloadQuery"]()) && (ctx.canvasContainer = _t.first);
    } }, hostBindings: function GameBoardComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("resize", function GameBoardComponent_resize_HostBindingHandler() { return ctx.onWindowResize(); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresolveWindow"]);
    } }, decls: 51, vars: 9, consts: [[1, "game-container"], ["id", "visualizer"], ["visualizer", ""], [1, "scanlines"], [1, "corner", "corner--tl"], [1, "corner", "corner--tr"], [1, "corner", "corner--bl"], [1, "corner", "corner--br"], ["id", "top-hud"], [1, "hud-block", "menu-buttons"], ["title", "Menu", 1, "icon-btn", 3, "click"], [1, "icon-btn__icon"], [1, "icon-btn__label"], [1, "btn-divider"], ["title", "Rejouer", 1, "icon-btn", 3, "click"], ["title", "R\u00E8gles", 1, "icon-btn", 3, "click"], [1, "hud-block", "turn-info"], [1, "turn-counter"], [1, "label"], [1, "value"], [4, "ngIf"], [1, "turn-divider"], [1, "turn-status"], ["id", "top-hud-turn-information-details", 1, "value", "status-text"], ["id", "bottom-hud"], [1, "actions-panel"], [1, "action-btn", "action-btn--validate", 3, "disabled", "click"], [1, "action-btn__glyph"], ["class", "action-btn action-btn--cancel", 3, "disabled", "click", 4, "ngIf"], ["class", "action-btn action-btn--danger", 3, "click", 4, "ngIf"], ["class", "action-btn action-btn--toggle", 3, "is-active", "click", 4, "ngIf"], [1, "action-btn", "action-btn--cancel", 3, "disabled", "click"], [1, "action-btn", "action-btn--danger", 3, "click"], [1, "action-btn", "action-btn--toggle", 3, "click"]], template: function GameBoardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "div", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](7, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_Template_button_click_10_listener() { return ctx.gameManager.goBackToMenu(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12, "\u2302");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](14, "Menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](15, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_Template_button_click_16_listener() { return ctx.replay(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18, "\u21BA");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, "Replay");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](21, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_Template_button_click_22_listener() { return ctx.displayInfo(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24, "?");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](25, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](26, "R\u00E8gles");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30, "TOURS");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](32, GameBoardComponent_ng_container_32_Template, 2, 1, "ng-container", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](33, GameBoardComponent_ng_container_33_Template, 2, 0, "ng-container", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](34, GameBoardComponent_ng_container_34_Template, 2, 0, "ng-container", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](35, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](37, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](38, "STATUT");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "span", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](40, "Initialisation...");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](42, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](43, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function GameBoardComponent_Template_button_click_43_listener() { return ctx.validateTurn(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "span", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](45, "\u25B6");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](46, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](47, "Finir le tour");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](48, GameBoardComponent_button_48_Template, 5, 1, "button", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](49, GameBoardComponent_button_49_Template, 5, 0, "button", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](50, GameBoardComponent_button_50_Template, 5, 3, "button", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassProp"]("critical", ctx.getRemainingTurnCount() <= 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.getRemainingTurnCount() > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.getRemainingTurnCount() == 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.getRemainingTurnCount() < 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", !ctx.gameHasStarted() || !ctx.isPlayerTurn());
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.gameMode !== "extreme");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.gameMode == "easy");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.isNodeMoveable());
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_14__["NgIf"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap\");\n[_nghost-%COMP%] {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n  overflow: hidden;\n  background: linear-gradient(180deg, #f8fbff 0%, #eef3f9 100%);\n  font-family: \"Rajdhani\", \"Orbitron\", \"Share Tech Mono\", monospace;\n  user-select: none;\n  -webkit-user-select: none;\n}\n.game-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n#visualizer[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  touch-action: none;\n}\n.scanlines[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  pointer-events: none;\n  background: repeating-linear-gradient(to bottom, transparent 0px, transparent 4px, rgba(0, 0, 0, 0.03) 4px, rgba(0, 0, 0, 0.03) 5px);\n}\n.corner[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 5;\n  width: 32px;\n  height: 32px;\n  pointer-events: none;\n  opacity: 0.4;\n}\n.corner[_ngcontent-%COMP%]::before, .corner[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  background: #009fd4;\n}\n.corner[_ngcontent-%COMP%]::before {\n  width: 2px;\n  height: 100%;\n}\n.corner[_ngcontent-%COMP%]::after {\n  width: 100%;\n  height: 2px;\n}\n.corner--tl[_ngcontent-%COMP%] {\n  top: 16px;\n  left: 16px;\n}\n.corner--tr[_ngcontent-%COMP%] {\n  top: 16px;\n  right: 16px;\n  transform: scaleX(-1);\n}\n.corner--bl[_ngcontent-%COMP%] {\n  bottom: 16px;\n  left: 16px;\n  transform: scaleY(-1);\n}\n.corner--br[_ngcontent-%COMP%] {\n  bottom: 16px;\n  right: 16px;\n  transform: scale(-1);\n}\n.hud-block[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: rgba(255, 255, 255, 0.75);\n  border: 1px solid rgba(0, 120, 180, 0.15);\n  border-radius: 6px;\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);\n  overflow: hidden;\n  position: relative;\n}\n.hud-block[_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 10%;\n  right: 10%;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, #009fd4, transparent);\n  opacity: 0.5;\n}\n#top-hud[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 24px;\n  left: 24px;\n  right: 24px;\n  z-index: 10;\n  display: flex;\n  justify-content: space-between;\n  pointer-events: none;\n  gap: 16px;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  pointer-events: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 10px 18px;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  color: rgba(30, 42, 54, 0.5);\n  transition: all 0.2s;\n}\n.icon-btn__label[_ngcontent-%COMP%] {\n  font-size: 0.6rem;\n  font-weight: 600;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n}\n.icon-btn[_ngcontent-%COMP%]:hover {\n  color: #009fd4;\n  background: rgba(0, 159, 212, 0.08);\n}\n.turn-counter[_ngcontent-%COMP%], .turn-status[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 10px 28px;\n}\n.turn-counter[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%], .turn-status[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.55rem;\n  letter-spacing: 0.2em;\n  color: rgba(30, 42, 54, 0.5);\n  text-transform: uppercase;\n}\n.turn-counter[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%], .turn-status[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #1e2a36;\n}\n.turn-counter[_ngcontent-%COMP%]   .value.critical[_ngcontent-%COMP%], .turn-status[_ngcontent-%COMP%]   .value.critical[_ngcontent-%COMP%] {\n  color: #e5485d;\n  animation: pulse-red 1s infinite;\n}\n.turn-counter[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%], .turn-status[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  color: #009fd4;\n  font-weight: 600;\n}\n#bottom-hud[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 24px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 10;\n}\n.actions-panel[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n}\n.action-btn[_ngcontent-%COMP%] {\n  padding: 12px 22px;\n  border: 1px solid rgba(0, 120, 180, 0.15);\n  border-radius: 6px;\n  background: rgba(255, 255, 255, 0.75);\n  backdrop-filter: blur(20px);\n  color: #1e2a36;\n  font-weight: 600;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  cursor: pointer;\n  transition: all 0.2s;\n  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);\n}\n.action-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n}\n.action-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.action-btn--validate[_ngcontent-%COMP%] {\n  color: #00b894;\n  border-color: rgba(0, 184, 148, 0.3);\n}\n.action-btn--validate[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 184, 148, 0.08);\n  border-color: #00b894;\n}\n.action-btn--danger[_ngcontent-%COMP%] {\n  color: #e5485d;\n  border-color: rgba(229, 72, 93, 0.3);\n}\n.action-btn--danger[_ngcontent-%COMP%]:hover {\n  background: rgba(229, 72, 93, 0.08);\n  border-color: #e5485d;\n}\n.action-btn--toggle[_ngcontent-%COMP%] {\n  color: rgba(30, 42, 54, 0.5);\n}\n.action-btn--toggle[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 159, 212, 0.08);\n  color: #009fd4;\n}\n.action-btn--toggle.is-active[_ngcontent-%COMP%] {\n  background: rgba(0, 159, 212, 0.08);\n  color: #009fd4;\n  border-color: #009fd4;\n}\n@keyframes pulse-red {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@media (max-width: 768px) {\n  #top-hud[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: center;\n    top: 12px;\n    left: 12px;\n    right: 12px;\n  }\n\n  .actions-panel[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxnYW1lLWJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdCUSxrR0FBQTtBQUlSO0VBQ0UsY0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7RUFFQSw2REFBQTtFQU1BLGlFQXBCWTtFQXFCWixpQkFBQTtFQUNBLHlCQUFBO0FBaENGO0FBcUNBO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQWxDRjtBQXVDQTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFVBQUE7RUFDQSxrQkFBQTtBQXBDRjtBQXlDQTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFVBQUE7RUFDQSxvQkFBQTtFQUNBLG9JQUFBO0FBdENGO0FBaURBO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtFQUNBLFlBQUE7QUE5Q0Y7QUFnREU7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFyRlU7QUF1Q2Q7QUFnREU7RUFBWSxVQUFBO0VBQVksWUFBQTtBQTVDMUI7QUE2Q0U7RUFBWSxXQUFBO0VBQWEsV0FBQTtBQXpDM0I7QUEyQ0U7RUFBUSxTQUFBO0VBQVcsVUFBQTtBQXZDckI7QUF3Q0U7RUFBUSxTQUFBO0VBQVcsV0FBQTtFQUFhLHFCQUFBO0FBbkNsQztBQW9DRTtFQUFRLFlBQUE7RUFBYyxVQUFBO0VBQVkscUJBQUE7QUEvQnBDO0FBZ0NFO0VBQVEsWUFBQTtFQUFjLFdBQUE7RUFBYSxvQkFBQTtBQTNCckM7QUFnQ0E7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0F6R1k7RUEwR1oseUNBQUE7RUFDQSxrQkFBQTtFQUVBLDJCQUFBO0VBQ0EsbUNBQUE7RUFFQSxrSEFDRTtFQUlGLGdCQUFBO0VBQ0Esa0JBQUE7QUFuQ0Y7QUFxQ0U7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQVEsU0FBQTtFQUFXLFVBQUE7RUFDbkIsV0FBQTtFQUNBLHFFQUFBO0VBQ0EsWUFBQTtBQWpDSjtBQXVDQTtFQUNFLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG9CQUFBO0VBQ0EsU0FBQTtBQXBDRjtBQXlDQTtFQUNFLG9CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUVBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUVBLDRCQTlJWTtFQStJWixvQkFBQTtBQXhDRjtBQTBDRTtFQUNFLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0FBeENKO0FBMkNFO0VBQ0UsY0FyS1U7RUFzS1YsbUNBcktVO0FBNEhkO0FBK0NBOztFQUVFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUE1Q0Y7QUE4Q0U7O0VBQ0Usa0JBQUE7RUFDQSxxQkFBQTtFQUNBLDRCQTFLVTtFQTJLVix5QkFBQTtBQTNDSjtBQThDRTs7RUFDRSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FsTFU7QUF1SWQ7QUE2Q0k7O0VBQ0UsY0E3TFE7RUE4TFIsZ0NBQUE7QUExQ047QUE4Q0U7O0VBQ0UsY0F0TVU7RUF1TVYsZ0JBQUE7QUEzQ0o7QUFpREE7RUFDRSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxTQUFBO0VBQ0EsMkJBQUE7RUFDQSxXQUFBO0FBOUNGO0FBaURBO0VBQ0UsYUFBQTtFQUNBLFNBQUE7QUE5Q0Y7QUFtREE7RUFDRSxrQkFBQTtFQUNBLHlDQUFBO0VBQ0Esa0JBQUE7RUFFQSxxQ0FyT1k7RUFzT1osMkJBQUE7RUFFQSxjQXpOWTtFQTBOWixnQkFBQTtFQUNBLHFCQUFBO0VBQ0EseUJBQUE7RUFFQSxlQUFBO0VBQ0Esb0JBQUE7RUFFQSwwQ0FBQTtBQXBERjtBQXNERTtFQUNFLDJCQUFBO0FBcERKO0FBdURFO0VBQ0UsWUFBQTtFQUNBLG1CQUFBO0FBckRKO0FBd0RFO0VBQ0UsY0FsUFU7RUFtUFYsb0NBQUE7QUF0REo7QUF3REk7RUFDRSxtQ0FyUFE7RUFzUFIscUJBdlBRO0FBaU1kO0FBMERFO0VBQ0UsY0EvUFU7RUFnUVYsb0NBQUE7QUF4REo7QUEwREk7RUFDRSxtQ0FsUVE7RUFtUVIscUJBcFFRO0FBNE1kO0FBNERFO0VBQ0UsNEJBaFFVO0FBc01kO0FBNERJO0VBQ0UsbUNBOVFRO0VBK1FSLGNBaFJRO0FBc05kO0FBNkRJO0VBQ0UsbUNBblJRO0VBb1JSLGNBclJRO0VBc1JSLHFCQXRSUTtBQTJOZDtBQWtFQTtFQUNFO0lBQVcsVUFBQTtFQTlEWDtFQStEQTtJQUFNLFlBQUE7RUE1RE47QUFDRjtBQWdFQTtFQUNFO0lBQ0Usc0JBQUE7SUFDQSxtQkFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBO0lBQ0EsV0FBQTtFQTlERjs7RUFpRUE7SUFDRSxlQUFBO0lBQ0EsdUJBQUE7RUE5REY7QUFDRiIsImZpbGUiOiJnYW1lLWJvYXJkLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiRiZzogICAgICAgICAgI2Y0ZjdmYjtcclxuJHN1cmZhY2U6ICAgICByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpO1xyXG4kYm9yZGVyOiAgICAgIHJnYmEoMCwgMTIwLCAxODAsIDAuMTUpO1xyXG4kYm9yZGVyLWhvdDogIHJnYmEoMCwgMTIwLCAxODAsIDAuMzUpO1xyXG5cclxuJGN5YW46ICAgICAgICAjMDA5ZmQ0O1xyXG4kY3lhbi1kaW06ICAgIHJnYmEoMCwgMTU5LCAyMTIsIDAuMDgpO1xyXG5cclxuJHJlZDogICAgICAgICAjZTU0ODVkO1xyXG4kcmVkLWRpbTogICAgIHJnYmEoMjI5LCA3MiwgOTMsIDAuMDgpO1xyXG5cclxuJGdyZWVuOiAgICAgICAjMDBiODk0O1xyXG4kZ3JlZW4tZGltOiAgIHJnYmEoMCwgMTg0LCAxNDgsIDAuMDgpO1xyXG5cclxuJGFtYmVyOiAgICAgICAjZTFhMjNjO1xyXG5cclxuJHRleHQ6ICAgICAgICAjMWUyYTM2O1xyXG4kdGV4dC1tdXRlZDogIHJnYmEoMzAsIDQyLCA1NCwgMC41KTtcclxuXHJcbiRmb250LWh1ZDogICAgJ1JhamRoYW5pJywgJ09yYml0cm9uJywgJ1NoYXJlIFRlY2ggTW9ubycsIG1vbm9zcGFjZTtcclxuXHJcblxyXG5cclxuQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9UmFqZGhhbmk6d2dodEA0MDA7NTAwOzYwMDs3MDAmZGlzcGxheT1zd2FwJyk7XHJcblxyXG5cclxuXHJcbjpob3N0IHtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgaGVpZ2h0OiAxMDB2aDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cclxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoXHJcbiAgICAxODBkZWcsXHJcbiAgICAjZjhmYmZmIDAlLFxyXG4gICAgI2VlZjNmOSAxMDAlXHJcbiAgKTtcclxuXHJcbiAgZm9udC1mYW1pbHk6ICRmb250LWh1ZDtcclxuICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xyXG59XHJcblxyXG5cclxuXHJcbi5nYW1lLWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuXHJcblxyXG4jdmlzdWFsaXplciB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGluc2V0OiAwO1xyXG4gIHotaW5kZXg6IDE7XHJcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xyXG59XHJcblxyXG5cclxuXHJcbi5zY2FubGluZXMge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBpbnNldDogMDtcclxuICB6LWluZGV4OiAyO1xyXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gIGJhY2tncm91bmQ6IHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoXHJcbiAgICB0byBib3R0b20sXHJcbiAgICB0cmFuc3BhcmVudCAwcHgsXHJcbiAgICB0cmFuc3BhcmVudCA0cHgsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDMpIDRweCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wMykgNXB4XHJcbiAgKTtcclxufVxyXG5cclxuXHJcblxyXG4uY29ybmVyIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgei1pbmRleDogNTtcclxuICB3aWR0aDogMzJweDtcclxuICBoZWlnaHQ6IDMycHg7XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgb3BhY2l0eTogMC40O1xyXG5cclxuICAmOjpiZWZvcmUsICY6OmFmdGVyIHtcclxuICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgYmFja2dyb3VuZDogJGN5YW47XHJcbiAgfVxyXG4gICY6OmJlZm9yZSB7IHdpZHRoOiAycHg7IGhlaWdodDogMTAwJTsgfVxyXG4gICY6OmFmdGVyICB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDJweDsgfVxyXG5cclxuICAmLS10bCB7IHRvcDogMTZweDsgbGVmdDogMTZweDsgfVxyXG4gICYtLXRyIHsgdG9wOiAxNnB4OyByaWdodDogMTZweDsgdHJhbnNmb3JtOiBzY2FsZVgoLTEpOyB9XHJcbiAgJi0tYmwgeyBib3R0b206IDE2cHg7IGxlZnQ6IDE2cHg7IHRyYW5zZm9ybTogc2NhbGVZKC0xKTsgfVxyXG4gICYtLWJyIHsgYm90dG9tOiAxNnB4OyByaWdodDogMTZweDsgdHJhbnNmb3JtOiBzY2FsZSgtMSk7IH1cclxufVxyXG5cclxuXHJcblxyXG4uaHVkLWJsb2NrIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZDogJHN1cmZhY2U7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcclxuICBib3JkZXItcmFkaXVzOiA2cHg7XHJcblxyXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyMHB4KTtcclxuICAtd2Via2l0LWJhY2tkcm9wLWZpbHRlcjogYmx1cigyMHB4KTtcclxuXHJcbiAgYm94LXNoYWRvdzpcclxuICAgIDAgMCAwIDFweCByZ2JhKDAsIDAsIDAsIDAuMDMpLFxyXG4gICAgMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAwLjA4KSxcclxuICAgIGluc2V0IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjYpO1xyXG5cclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgJjo6YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwOyBsZWZ0OiAxMCU7IHJpZ2h0OiAxMCU7XHJcbiAgICBoZWlnaHQ6IDFweDtcclxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQsICRjeWFuLCB0cmFuc3BhcmVudCk7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbiN0b3AtaHVkIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAyNHB4O1xyXG4gIGxlZnQ6IDI0cHg7XHJcbiAgcmlnaHQ6IDI0cHg7XHJcbiAgei1pbmRleDogMTA7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgZ2FwOiAxNnB4O1xyXG59XHJcblxyXG5cclxuXHJcbi5pY29uLWJ0biB7XHJcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gIHBhZGRpbmc6IDEwcHggMThweDtcclxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG5cclxuICBjb2xvcjogJHRleHQtbXV0ZWQ7XHJcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XHJcblxyXG4gICZfX2xhYmVsIHtcclxuICAgIGZvbnQtc2l6ZTogMC42cmVtO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIH1cclxuXHJcbiAgJjpob3ZlciB7XHJcbiAgICBjb2xvcjogJGN5YW47XHJcbiAgICBiYWNrZ3JvdW5kOiAkY3lhbi1kaW07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbi50dXJuLWNvdW50ZXIsXHJcbi50dXJuLXN0YXR1cyB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcGFkZGluZzogMTBweCAyOHB4O1xyXG5cclxuICAubGFiZWwge1xyXG4gICAgZm9udC1zaXplOiAwLjU1cmVtO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMmVtO1xyXG4gICAgY29sb3I6ICR0ZXh0LW11dGVkO1xyXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICB9XHJcblxyXG4gIC52YWx1ZSB7XHJcbiAgICBmb250LXNpemU6IDEuMXJlbTtcclxuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICBjb2xvcjogJHRleHQ7XHJcblxyXG4gICAgJi5jcml0aWNhbCB7XHJcbiAgICAgIGNvbG9yOiAkcmVkO1xyXG4gICAgICBhbmltYXRpb246IHB1bHNlLXJlZCAxcyBpbmZpbml0ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC5zdGF0dXMtdGV4dCB7XHJcbiAgICBjb2xvcjogJGN5YW47XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG4jYm90dG9tLWh1ZCB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGJvdHRvbTogMjRweDtcclxuICBsZWZ0OiA1MCU7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xyXG4gIHotaW5kZXg6IDEwO1xyXG59XHJcblxyXG4uYWN0aW9ucy1wYW5lbCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBnYXA6IDEwcHg7XHJcbn1cclxuXHJcblxyXG5cclxuLmFjdGlvbi1idG4ge1xyXG4gIHBhZGRpbmc6IDEycHggMjJweDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xyXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcclxuXHJcbiAgYmFja2dyb3VuZDogJHN1cmZhY2U7XHJcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpO1xyXG5cclxuICBjb2xvcjogJHRleHQ7XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuXHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xyXG5cclxuICBib3gtc2hhZG93OiAwIDZweCAyMHB4IHJnYmEoMCwwLDAsMC4wOCk7XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xyXG4gIH1cclxuXHJcbiAgJjpkaXNhYmxlZCB7XHJcbiAgICBvcGFjaXR5OiAwLjM7XHJcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gIH1cclxuXHJcbiAgJi0tdmFsaWRhdGUge1xyXG4gICAgY29sb3I6ICRncmVlbjtcclxuICAgIGJvcmRlci1jb2xvcjogcmdiYSgwLDE4NCwxNDgsMC4zKTtcclxuXHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgYmFja2dyb3VuZDogJGdyZWVuLWRpbTtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAkZ3JlZW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLS1kYW5nZXIge1xyXG4gICAgY29sb3I6ICRyZWQ7XHJcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjI5LDcyLDkzLDAuMyk7XHJcblxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgIGJhY2tncm91bmQ6ICRyZWQtZGltO1xyXG4gICAgICBib3JkZXItY29sb3I6ICRyZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLS10b2dnbGUge1xyXG4gICAgY29sb3I6ICR0ZXh0LW11dGVkO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kOiAkY3lhbi1kaW07XHJcbiAgICAgIGNvbG9yOiAkY3lhbjtcclxuICAgIH1cclxuXHJcbiAgICAmLmlzLWFjdGl2ZSB7XHJcbiAgICAgIGJhY2tncm91bmQ6ICRjeWFuLWRpbTtcclxuICAgICAgY29sb3I6ICRjeWFuO1xyXG4gICAgICBib3JkZXItY29sb3I6ICRjeWFuO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5Aa2V5ZnJhbWVzIHB1bHNlLXJlZCB7XHJcbiAgMCUsIDEwMCUgeyBvcGFjaXR5OiAxOyB9XHJcbiAgNTAlIHsgb3BhY2l0eTogMC41OyB9XHJcbn1cclxuXHJcblxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XHJcbiAgI3RvcC1odWQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICB0b3A6IDEycHg7XHJcbiAgICBsZWZ0OiAxMnB4O1xyXG4gICAgcmlnaHQ6IDEycHg7XHJcbiAgfVxyXG5cclxuICAuYWN0aW9ucy1wYW5lbCB7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICB9XHJcbn0iXX0= */"] });


/***/ }),

/***/ "PXcp":
/*!******************************************!*\
  !*** ./src/app/models/Pawn/Cops/cops.ts ***!
  \******************************************/
/*! exports provided: Cops */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cops", function() { return Cops; });
/* harmony import */ var _pawn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pawn */ "sESa");
/* harmony import */ var _Strategy_Cop_OneCopsWinStrategy_one_cops_win_strategy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy */ "1+hw");


class Cops extends _pawn__WEBPACK_IMPORTED_MODULE_0__["Pawns"] {
    constructor(gameM, graphServ, x, y, id) {
        super(gameM, graphServ, x, y);
        this.gameM = gameM;
        this.graphServ = graphServ;
        this.role = "cops" + id;
        this.strategy = new _Strategy_Cop_OneCopsWinStrategy_one_cops_win_strategy__WEBPACK_IMPORTED_MODULE_1__["OneCopsWinStrategy"]();
    }
    updatePosition(node) {
        if (node) {
            this.currentNodeId = node.id !== undefined ? Number(node.id) : Number(node.index);
            this.gameM.updateCopsPosition(this, node);
        }
    }
}


/***/ }),

/***/ "RYiN":
/*!*******************************************!*\
  !*** ./src/app/models/Graph/Tree/tree.ts ***!
  \*******************************************/
/*! exports provided: Tree */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tree", function() { return Tree; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graph */ "Z/gq");


class Tree extends _graph__WEBPACK_IMPORTED_MODULE_1__["Graph"] {
    constructor(nodes, links) {
        super(nodes, links, "tree");
    }
    simulate(svg) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_0__["forceSimulation"](this.nodes)
            .force("link", d3__WEBPACK_IMPORTED_MODULE_0__["forceLink"]()
            .links(this.links))
            .force("center", d3__WEBPACK_IMPORTED_MODULE_0__["forceCenter"](width / 2, height / 2))
            .force("charge", d3__WEBPACK_IMPORTED_MODULE_0__["forceManyBody"]().strength(-500))
            .on("tick", this.ticked.bind(this));
    }
    stop() {
        this.simulation.stop();
    }
    ticked() {
        this.svgLinks
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        this.svgNodes
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}


/***/ }),

/***/ "RsS5":
/*!**************************************************!*\
  !*** ./src/app/models/GameAction/game-action.ts ***!
  \**************************************************/
/*! exports provided: GameAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameAction", function() { return GameAction; });
class GameAction {
    constructor(pawn, start, end) {
        this.pawn = pawn;
        this.startPosition = start;
        this.endPosition = end;
    }
    cancelAction() {
        this.pawn.undoMove(this.startPosition);
        const speed = this.pawn.role.includes('thief') ? this.pawn.gameManager.getThiefSpeed() : 1;
    }
    getPawn() {
        return this.pawn;
    }
    getStartPosition() {
        return this.startPosition;
    }
    getEndPosition() {
        return this.endPosition;
    }
}


/***/ }),

/***/ "Rvdi":
/*!******************************************!*\
  !*** ./src/app/models/Adventure/mode.ts ***!
  \******************************************/
/*! exports provided: Mode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mode", function() { return Mode; });
var Mode;
(function (Mode) {
    Mode["INTRUDER"] = "intruder";
    Mode["CLASSIC"] = "classic";
})(Mode || (Mode = {}));


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AppComponent {
    constructor() {
        this.title = 'Terra-Numerica';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["@charset \"UTF-8\";\n[_nghost-%COMP%] {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 14px;\n  color: #333;\n  box-sizing: border-box;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  padding: 8px;\n}\nh1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], h5[_ngcontent-%COMP%], h6[_ngcontent-%COMP%] {\n  margin: 8px 0;\n}\np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.toolbar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  background-color: #1976d2;\n  color: white;\n  font-weight: 600;\n}\n.toolbar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  margin: 0 16px;\n}\n.toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%] {\n  height: 40px;\n  margin: 0 16px;\n}\n.toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  margin: 82px auto 32px;\n  padding: 0 16px;\n  max-width: 960px;\n  flex-direction: column;\n  align-items: center;\n}\nsvg.material-icons[_ngcontent-%COMP%] {\n  height: 24px;\n  width: auto;\n}\nsvg.material-icons[_ngcontent-%COMP%]:not(:last-child) {\n  margin-right: 8px;\n}\n.card[_ngcontent-%COMP%]   svg.material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n  fill: #888;\n}\n.card-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin-top: 16px;\n}\n.card[_ngcontent-%COMP%] {\n  border-radius: 4px;\n  border: 1px solid #eee;\n  background-color: #fafafa;\n  height: 40px;\n  width: 200px;\n  margin: 0 8px 16px;\n  padding: 16px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  transition: all 0.2s ease-in-out;\n  line-height: 24px;\n}\n.card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(:last-child) {\n  margin-right: 0;\n}\n.card.card-small[_ngcontent-%COMP%] {\n  height: 16px;\n  width: 168px;\n}\n.card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card) {\n  cursor: pointer;\n}\n.card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover {\n  transform: translateY(-3px);\n  box-shadow: 0 4px 17px rgba(0, 0, 0, 0.35);\n}\n.card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover   .material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n  fill: #696767;\n}\n.card.highlight-card[_ngcontent-%COMP%] {\n  background-color: #1976d2;\n  color: white;\n  font-weight: 600;\n  border: none;\n  width: auto;\n  min-width: 30%;\n  position: relative;\n}\n.card.card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 60px;\n}\nsvg#rocket[_ngcontent-%COMP%] {\n  width: 80px;\n  position: absolute;\n  left: -10px;\n  top: -24px;\n}\nsvg#rocket-smoke[_ngcontent-%COMP%] {\n  height: calc(100vh - 95px);\n  position: absolute;\n  top: 10px;\n  right: 180px;\n  z-index: -10;\n}\na[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:visited, a[_ngcontent-%COMP%]:hover {\n  color: #1976d2;\n  text-decoration: none;\n}\na[_ngcontent-%COMP%]:hover {\n  color: #125699;\n}\n.terminal[_ngcontent-%COMP%] {\n  position: relative;\n  width: 80%;\n  max-width: 600px;\n  border-radius: 6px;\n  padding-top: 45px;\n  margin-top: 8px;\n  overflow: hidden;\n  background-color: #0f0f10;\n}\n.terminal[_ngcontent-%COMP%]::before {\n  content: \"\u2022\u2022\u2022\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 4px;\n  background: #3a3a3a;\n  color: #c2c3c4;\n  width: 100%;\n  font-size: 2rem;\n  line-height: 0;\n  padding: 14px 0;\n  text-indent: 4px;\n}\n.terminal[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;\n  color: white;\n  padding: 0 1rem 1rem;\n  margin: 0;\n}\n.circle-link[_ngcontent-%COMP%] {\n  height: 40px;\n  width: 40px;\n  border-radius: 40px;\n  margin: 8px;\n  background-color: white;\n  border: 1px solid #eeeeee;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: 1s ease-out;\n}\n.circle-link[_ngcontent-%COMP%]:hover {\n  transform: translateY(-0.25rem);\n  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);\n}\nfooter[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  display: flex;\n  align-items: center;\n  line-height: 20px;\n}\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.github-star-badge[_ngcontent-%COMP%] {\n  color: #24292e;\n  display: flex;\n  align-items: center;\n  font-size: 12px;\n  padding: 3px 10px;\n  border: 1px solid rgba(27, 31, 35, 0.2);\n  border-radius: 3px;\n  background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);\n  margin-left: 4px;\n  font-weight: 600;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;\n}\n.github-star-badge[_ngcontent-%COMP%]:hover {\n  background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);\n  border-color: rgba(27, 31, 35, 0.35);\n  background-position: -0.5em;\n}\n.github-star-badge[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  height: 16px;\n  width: 16px;\n  margin-right: 4px;\n}\nsvg#clouds[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: -160px;\n  left: -230px;\n  z-index: -10;\n  width: 1920px;\n}\n@media screen and (max-width: 767px) {\n  .card-container[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.circle-link), .terminal[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .card[_ngcontent-%COMP%]:not(.highlight-card) {\n    height: 16px;\n    margin: 8px 0;\n  }\n\n  .card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    margin-left: 72px;\n  }\n\n  svg#rocket-smoke[_ngcontent-%COMP%] {\n    right: 120px;\n    transform: rotate(-5deg);\n  }\n}\n@media screen and (max-width: 575px) {\n  svg#rocket-smoke[_ngcontent-%COMP%] {\n    display: none;\n    visibility: hidden;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUFoQjtFQUNFLDBKQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLG1DQUFBO0VBQ0Esa0NBQUE7RUFFQSxrQkFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLE1BQUE7RUFDQSxZQUFBO0FBQ0Y7QUFFRTs7Ozs7O0VBTUUsYUFBQTtBQUNKO0FBRUU7RUFDRSxTQUFBO0FBQ0o7QUFFRTtFQUNFLE9BQUE7QUFDSjtBQUVFO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUFDSjtBQUVFO0VBQ0UsY0FBQTtBQUNKO0FBRUU7RUFDRSxZQUFBO0VBQ0EsY0FBQTtBQUNKO0FBRUU7RUFDRSxZQUFBO0FBQ0o7QUFFRTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUFDSjtBQUVFO0VBQ0UsWUFBQTtFQUNBLFdBQUE7QUFDSjtBQUVFO0VBQ0UsaUJBQUE7QUFDSjtBQUVFO0VBQ0UsVUFBQTtBQUNKO0FBRUU7RUFDRSxhQUFBO0VBQ0EsZUFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUFDSjtBQUVFO0VBQ0Usa0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0NBQUE7RUFDQSxpQkFBQTtBQUNKO0FBRUU7RUFDRSxlQUFBO0FBQ0o7QUFFRTtFQUNFLFlBQUE7RUFDQSxZQUFBO0FBQ0o7QUFFRTtFQUNFLGVBQUE7QUFDSjtBQUVFO0VBQ0UsMkJBQUE7RUFDQSwwQ0FBQTtBQUNKO0FBRUU7RUFDRSxhQUFBO0FBQ0o7QUFFRTtFQUNFLHlCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7QUFDSjtBQUVFO0VBQ0UsaUJBQUE7QUFDSjtBQUVFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7QUFDSjtBQUVFO0VBQ0UsMEJBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtBQUNKO0FBRUU7OztFQUdFLGNBQUE7RUFDQSxxQkFBQTtBQUNKO0FBRUU7RUFDRSxjQUFBO0FBQ0o7QUFFRTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0FBQ0o7QUFFRTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsV0FBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQUNKO0FBRUU7RUFDRSx3RUFBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtFQUNBLFNBQUE7QUFDSjtBQUVFO0VBQ0UsWUFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7RUFDQSx1QkFBQTtFQUNBLHlCQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0Esd0VBQUE7RUFDQSx1QkFBQTtBQUNKO0FBRUU7RUFDRSwrQkFBQTtFQUNBLDJDQUFBO0FBQ0o7QUFFRTtFQUNFLGVBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtBQUNKO0FBRUU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7QUFDSjtBQUVFO0VBQ0UsY0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLHVDQUFBO0VBQ0Esa0JBQUE7RUFDQSxnRUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSwwSUFBQTtBQUNKO0FBRUU7RUFDRSxnRUFBQTtFQUNBLG9DQUFBO0VBQ0EsMkJBQUE7QUFDSjtBQUVFO0VBQ0UsWUFBQTtFQUNBLFdBQUE7RUFDQSxpQkFBQTtBQUNKO0FBRUU7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtBQUNKO0FBSUU7RUFFRTs7SUFFRSxXQUFBO0VBRko7O0VBS0U7SUFDRSxZQUFBO0lBQ0EsYUFBQTtFQUZKOztFQUtFO0lBQ0UsaUJBQUE7RUFGSjs7RUFLRTtJQUNFLFlBQUE7SUFDQSx3QkFBQTtFQUZKO0FBQ0Y7QUFLRTtFQUNFO0lBQ0UsYUFBQTtJQUNBLGtCQUFBO0VBSEo7QUFDRiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAY2hhcnNldCBcIlVURi04XCI7XG46aG9zdCB7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIjtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBjb2xvcjogIzMzMztcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgdG9wOiAwO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNiB7XG4gIG1hcmdpbjogOHB4IDA7XG59XG5cbnAge1xuICBtYXJnaW46IDA7XG59XG5cbi5zcGFjZXIge1xuICBmbGV4OiAxO1xufVxuXG4udG9vbGJhciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgaGVpZ2h0OiA2MHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTk3NmQyO1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi50b29sYmFyIGltZyB7XG4gIG1hcmdpbjogMCAxNnB4O1xufVxuXG4udG9vbGJhciAjdHdpdHRlci1sb2dvIHtcbiAgaGVpZ2h0OiA0MHB4O1xuICBtYXJnaW46IDAgMTZweDtcbn1cblxuLnRvb2xiYXIgI3R3aXR0ZXItbG9nbzpob3ZlciB7XG4gIG9wYWNpdHk6IDAuODtcbn1cblxuLmNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW46IDgycHggYXV0byAzMnB4O1xuICBwYWRkaW5nOiAwIDE2cHg7XG4gIG1heC13aWR0aDogOTYwcHg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbnN2Zy5tYXRlcmlhbC1pY29ucyB7XG4gIGhlaWdodDogMjRweDtcbiAgd2lkdGg6IGF1dG87XG59XG5cbnN2Zy5tYXRlcmlhbC1pY29uczpub3QoOmxhc3QtY2hpbGQpIHtcbiAgbWFyZ2luLXJpZ2h0OiA4cHg7XG59XG5cbi5jYXJkIHN2Zy5tYXRlcmlhbC1pY29ucyBwYXRoIHtcbiAgZmlsbDogIzg4ODtcbn1cblxuLmNhcmQtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogMTZweDtcbn1cblxuLmNhcmQge1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gIGhlaWdodDogNDBweDtcbiAgd2lkdGg6IDIwMHB4O1xuICBtYXJnaW46IDAgOHB4IDE2cHg7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlLWluLW91dDtcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XG59XG5cbi5jYXJkLWNvbnRhaW5lciAuY2FyZDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgbWFyZ2luLXJpZ2h0OiAwO1xufVxuXG4uY2FyZC5jYXJkLXNtYWxsIHtcbiAgaGVpZ2h0OiAxNnB4O1xuICB3aWR0aDogMTY4cHg7XG59XG5cbi5jYXJkLWNvbnRhaW5lciAuY2FyZDpub3QoLmhpZ2hsaWdodC1jYXJkKSB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmNhcmQtY29udGFpbmVyIC5jYXJkOm5vdCguaGlnaGxpZ2h0LWNhcmQpOmhvdmVyIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpO1xuICBib3gtc2hhZG93OiAwIDRweCAxN3B4IHJnYmEoMCwgMCwgMCwgMC4zNSk7XG59XG5cbi5jYXJkLWNvbnRhaW5lciAuY2FyZDpub3QoLmhpZ2hsaWdodC1jYXJkKTpob3ZlciAubWF0ZXJpYWwtaWNvbnMgcGF0aCB7XG4gIGZpbGw6ICM2OTY3Njc7XG59XG5cbi5jYXJkLmhpZ2hsaWdodC1jYXJkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzE5NzZkMjtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXdlaWdodDogNjAwO1xuICBib3JkZXI6IG5vbmU7XG4gIHdpZHRoOiBhdXRvO1xuICBtaW4td2lkdGg6IDMwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uY2FyZC5jYXJkLmhpZ2hsaWdodC1jYXJkIHNwYW4ge1xuICBtYXJnaW4tbGVmdDogNjBweDtcbn1cblxuc3ZnI3JvY2tldCB7XG4gIHdpZHRoOiA4MHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IC0xMHB4O1xuICB0b3A6IC0yNHB4O1xufVxuXG5zdmcjcm9ja2V0LXNtb2tlIHtcbiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gOTVweCk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogMTgwcHg7XG4gIHotaW5kZXg6IC0xMDtcbn1cblxuYSxcbmE6dmlzaXRlZCxcbmE6aG92ZXIge1xuICBjb2xvcjogIzE5NzZkMjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG5hOmhvdmVyIHtcbiAgY29sb3I6ICMxMjU2OTk7XG59XG5cbi50ZXJtaW5hbCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDgwJTtcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBwYWRkaW5nLXRvcDogNDVweDtcbiAgbWFyZ2luLXRvcDogOHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGYwZjEwO1xufVxuXG4udGVybWluYWw6OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwi4oCi4oCi4oCiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBoZWlnaHQ6IDRweDtcbiAgYmFja2dyb3VuZDogIzNhM2EzYTtcbiAgY29sb3I6ICNjMmMzYzQ7XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LXNpemU6IDJyZW07XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwYWRkaW5nOiAxNHB4IDA7XG4gIHRleHQtaW5kZW50OiA0cHg7XG59XG5cbi50ZXJtaW5hbCBwcmUge1xuICBmb250LWZhbWlseTogU0ZNb25vLVJlZ3VsYXIsIENvbnNvbGFzLCBMaWJlcmF0aW9uIE1vbm8sIE1lbmxvLCBtb25vc3BhY2U7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogMCAxcmVtIDFyZW07XG4gIG1hcmdpbjogMDtcbn1cblxuLmNpcmNsZS1saW5rIHtcbiAgaGVpZ2h0OiA0MHB4O1xuICB3aWR0aDogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogNDBweDtcbiAgbWFyZ2luOiA4cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlZWVlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjEyKSwgMCAxcHggMnB4IHJnYmEoMCwgMCwgMCwgMC4yNCk7XG4gIHRyYW5zaXRpb246IDFzIGVhc2Utb3V0O1xufVxuXG4uY2lyY2xlLWxpbms6aG92ZXIge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuMjVyZW0pO1xuICBib3gtc2hhZG93OiAwcHggM3B4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xufVxuXG5mb290ZXIge1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xufVxuXG5mb290ZXIgYSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5naXRodWItc3Rhci1iYWRnZSB7XG4gIGNvbG9yOiAjMjQyOTJlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDEycHg7XG4gIHBhZGRpbmc6IDNweCAxMHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI3LCAzMSwgMzUsIDAuMik7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KC0xODBkZWcsICNmYWZiZmMsICNlZmYzZjYgOTAlKTtcbiAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgU2Vnb2UgVUksIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYsIEFwcGxlIENvbG9yIEVtb2ppLCBTZWdvZSBVSSBFbW9qaSwgU2Vnb2UgVUkgU3ltYm9sO1xufVxuXG4uZ2l0aHViLXN0YXItYmFkZ2U6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoLTE4MGRlZywgI2YwZjNmNiwgI2U2ZWJmMSA5MCUpO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjcsIDMxLCAzNSwgMC4zNSk7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IC0wLjVlbTtcbn1cblxuLmdpdGh1Yi1zdGFyLWJhZGdlIC5tYXRlcmlhbC1pY29ucyB7XG4gIGhlaWdodDogMTZweDtcbiAgd2lkdGg6IDE2cHg7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xufVxuXG5zdmcjY2xvdWRzIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBib3R0b206IC0xNjBweDtcbiAgbGVmdDogLTIzMHB4O1xuICB6LWluZGV4OiAtMTA7XG4gIHdpZHRoOiAxOTIwcHg7XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2N3B4KSB7XG4gIC5jYXJkLWNvbnRhaW5lciA+ICo6bm90KC5jaXJjbGUtbGluayksXG4udGVybWluYWwge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG5cbiAgLmNhcmQ6bm90KC5oaWdobGlnaHQtY2FyZCkge1xuICAgIGhlaWdodDogMTZweDtcbiAgICBtYXJnaW46IDhweCAwO1xuICB9XG5cbiAgLmNhcmQuaGlnaGxpZ2h0LWNhcmQgc3BhbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDcycHg7XG4gIH1cblxuICBzdmcjcm9ja2V0LXNtb2tlIHtcbiAgICByaWdodDogMTIwcHg7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTVkZWcpO1xuICB9XG59XG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1NzVweCkge1xuICBzdmcjcm9ja2V0LXNtb2tlIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxufSJdfQ== */"] });


/***/ }),

/***/ "XxV+":
/*!********************************************************************************!*\
  !*** ./src/app/_services/graph-file-validator/graph-file-validator.service.ts ***!
  \********************************************************************************/
/*! exports provided: GraphFileValidatorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphFileValidatorService", function() { return GraphFileValidatorService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class GraphFileValidatorService {
    constructor() {
        this.BASIC_PROPERTIES = ['typology', 'nodes', 'links'];
        this.GRID_PROPERTIES = ['width', 'height'];
        this.TREE_PROPERTY = ['arity'];
        this.TYPOLOGY_VALUES = ['grid', 'tore', 'tree', 'cycle', 'common', 'copsAlwaysWin'];
        this.MIN_NODES_NUM = 4;
        this.MAX_NODES_NUM = 70;
    }
    setContentToValidate(fileContent) {
        this.fileContent = fileContent;
    }
    get missing_properties() {
        const missing = [];
        const present_properties = Object.keys(this.fileContent);
        this.BASIC_PROPERTIES.forEach(prop => {
            if (!present_properties.includes(prop))
                missing.push(prop);
        });
        switch (this.fileContent[this.BASIC_PROPERTIES[0]]) {
            case 'tore':
            case 'grid':
                this.GRID_PROPERTIES.forEach(prop => {
                    if (!present_properties.includes(prop))
                        missing.push(prop);
                });
                break;
            case 'tree':
                this.TREE_PROPERTY.forEach(prop => {
                    if (!present_properties.includes(prop))
                        missing.push(prop);
                });
                break;
            default:
                break;
        }
        return missing;
    }
    get invalid_properties() {
        const invalid = [];
        const typology = this.fileContent[this.BASIC_PROPERTIES[0]];
        const nodes = this.fileContent[this.BASIC_PROPERTIES[1]];
        const links = this.fileContent[this.BASIC_PROPERTIES[2]];
        if (typology && !this.TYPOLOGY_VALUES.includes(typology)) {
            invalid.push(`- ${typology} n'est pas une valeur connu de typologie. Les typologies possible sont les suivantes : ${this.TYPOLOGY_VALUES}`);
        }
        if (nodes && (nodes.length < this.MIN_NODES_NUM || nodes.length > this.MAX_NODES_NUM)) {
            invalid.push(`Le nombre de noeuds doit être compris entre ${this.MIN_NODES_NUM} et ${this.MAX_NODES_NUM}. Votre nombre de noeuds actuel est de ${nodes.length}`);
        }
        if (links && links.length === 0) {
            invalid.push(`Le tableau des liens est vide.`);
        }
        return invalid;
    }
}
GraphFileValidatorService.ɵfac = function GraphFileValidatorService_Factory(t) { return new (t || GraphFileValidatorService)(); };
GraphFileValidatorService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: GraphFileValidatorService, factory: GraphFileValidatorService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "YUlo":
/*!*************************************************************************************************!*\
  !*** ./src/app/models/Pawn/PawnState/PawnStateWaitingPlacement/pawn-state-waiting-placement.ts ***!
  \*************************************************************************************************/
/*! exports provided: PawnStateWaitingPlacement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PawnStateWaitingPlacement", function() { return PawnStateWaitingPlacement; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _pawn_states__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pawn-states */ "KjiV");


class PawnStateWaitingPlacement {
    constructor() {
        this.edges = null;
    }
    dragstarted(event, d) {
        d.lastPosX = event.x;
        d.lastPosY = event.y;
        d.settedPosition = false;
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event, d) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("." + d.role).attr("cx", event.x).attr("cy", event.y);
        if (d.graphService.gameMode === "easy") {
            let edges = this.edges;
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".circle")
                .each((nodeData, id, elements) => {
                let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
                let distance = d.detectRadius;
                if (h <= distance) {
                    d.graphService.showPossibleMove(elements[id]);
                }
            });
        }
    }
    dragended(event, d) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).attr("stroke", null);
        let position = {
            x: d.lastPosX,
            y: d.lastPosY,
        };
        let distance = d.detectRadius;
        let node;
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".circle").each((nodeData, id, elements) => {
            let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
            if (h <= distance
                && ((d.role.includes('thief') && d.gameManager.copsArePlaced()) || d.role.includes('cops'))) {
                node = nodeData;
                distance = h;
                position.x = nodeData.x;
                position.y = nodeData.y;
                d.settedPosition = true;
                d.possiblePoints = d.graphService.showPossibleMove(elements[id]);
                d.lastSlot = elements[id];
            }
        });
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("." + d.role).attr("cx", d.x = position.x).attr("cy", d.y = position.y);
        d.updatePosition(node);
        if (!d.settedPosition) {
            return this;
        }
        else {
            return _pawn_states__WEBPACK_IMPORTED_MODULE_1__["GlobalPawnStates"].waitingTurnState;
        }
    }
}


/***/ }),

/***/ "Z/gq":
/*!***************************************!*\
  !*** ./src/app/models/Graph/graph.ts ***!
  \***************************************/
/*! exports provided: Graph */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Graph", function() { return Graph; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");

class Graph {
    constructor(nodes, links, typology) {
        this.allowedToMove = false;
        this._nodes = [...nodes];
        this._links = [...links];
        this._typology = typology;
    }
    setAllowedToMove(allowedToMove) {
        this.allowedToMove = allowedToMove;
    }
    draw(svg) {
        this.svgLinks = svg.selectAll("line")
            .data(this.links)
            .join("line")
            .style("stroke", "#aaa");
        this.svgNodes = svg.selectAll("circle")
            .data(this.nodes)
            .join("circle")
            .attr("r", 20)
            .attr("class", "circle")
            .attr("index", d => d.index)
            .style("fill", "#69b3a2")
            .call(d3__WEBPACK_IMPORTED_MODULE_0__["drag"]()
            .on('start', (event) => {
            this.dragstarted(event);
        })
            .on('drag', (event) => {
            this.dragged(event);
        })
            .on('end', (event) => {
            this.dragended(event);
        }));
        this.simulate(svg);
    }
    dragstarted(event) {
        if (this.allowedToMove) {
            this.movingCircleOriginalPosition = {
                x: event.sourceEvent.target.cx.baseVal.value,
                y: event.sourceEvent.target.cy.baseVal.value
            };
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target).attr('stroke', 'black');
        }
    }
    dragged(event) {
        if (this.allowedToMove) {
            const circle = event.sourceEvent.target;
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](circle).raise().attr("cx", event.x).attr("cy", event.y);
        }
    }
    dragended(event) {
        if (this.allowedToMove) {
            const circle = d3__WEBPACK_IMPORTED_MODULE_0__["select"](event.sourceEvent.target);
            circle.attr('stroke', null);
            this.moveNode(this.movingCircleOriginalPosition, { x: +circle.attr('cx'), y: +circle.attr('cy') });
        }
    }
    moveNode(movingCircle, endPosition) {
        const nodeIndex = this.nodes.findIndex(node => this.checkApproximativeCirclePosition(node, movingCircle));
        this.links.forEach((link) => {
            if (link.source.index === nodeIndex || link.source === nodeIndex) {
                const lines = d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('line').nodes();
                for (const l of lines) {
                    const tmp = d3__WEBPACK_IMPORTED_MODULE_0__["select"](l);
                    if ((tmp.attr('x1') == link.source.x && tmp.attr('y1') == link.source.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x1', endPosition.x).attr('y1', endPosition.y);
                        break;
                    }
                }
            }
            else if (link.target.index === nodeIndex || link.target === nodeIndex) {
                const lines = d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('line').nodes();
                for (const l of lines) {
                    const tmp = d3__WEBPACK_IMPORTED_MODULE_0__["select"](l);
                    if ((tmp.attr('x2') == link.target.x && tmp.attr('y2') == link.target.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x2', endPosition.x).attr('y2', endPosition.y);
                        break;
                    }
                }
            }
        });
        const circles = d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('circle');
        for (const circle of circles) {
            const tmp = d3__WEBPACK_IMPORTED_MODULE_0__["select"](circle);
            if (tmp.attr('index') == nodeIndex) {
                tmp.attr('cx', endPosition.x).attr('cy', endPosition.y);
            }
        }
        this.nodes[nodeIndex].x = endPosition.x;
        this.nodes[nodeIndex].y = endPosition.y;
    }
    checkApproximativeCirclePosition(originalPosition, newPosition) {
        return (originalPosition.x - 1 < newPosition.x && newPosition.x < originalPosition.x + 1)
            && (originalPosition.y - 1 < newPosition.y && newPosition.y < originalPosition.y + 1);
    }
    getRandomEdge() {
        return Object.assign({}, this._nodes[this.getRandomInt(this._nodes.length)]);
    }
    edges(node, speed = 1, exclude = []) {
        const edges = [];
        if (!node)
            return edges;
        if (node.index === undefined && node.__data__) {
            node = node.__data__;
        }
        const nodeIndex = node.id !== undefined ? node.id : node.index;
        if (nodeIndex === undefined)
            return edges;
        for (const l of this._links) {
            let source = l.source;
            let target = l.target;
            const sIndex = (source && source.index !== undefined) ? source.index : ((source && source.id !== undefined) ? source.id : source);
            const tIndex = (target && target.index !== undefined) ? target.index : ((target && target.id !== undefined) ? target.id : target);
            if (sIndex === nodeIndex) {
                const neighbor = this._nodes.find(n => (n.id !== undefined ? n.id : n.index) === tIndex);
                if (neighbor)
                    edges.push(neighbor);
            }
            else if (tIndex === nodeIndex) {
                const neighbor = this._nodes.find(n => (n.id !== undefined ? n.id : n.index) === sIndex);
                if (neighbor)
                    edges.push(neighbor);
            }
        }
        if (speed > 1) {
            return this.globalEdges(edges, --speed, exclude);
        }
        return edges;
    }
    globalEdges(edges, speed, exclude = []) {
        let result = [...edges];
        let new_edges = [...edges];
        while (speed !== 0) {
            const tmp = [];
            for (const e of new_edges) {
                if (!exclude.includes(e)) {
                    this.edges(e).forEach(n => {
                        const nId = n.id !== undefined ? n.id : n.index;
                        if (!result.find(el => (el.id !== undefined ? el.id : el.index) === nId) && !exclude.some(el => (el.id !== undefined ? el.id : el.index) === nId)) {
                            result.push(n);
                            tmp.push(n);
                        }
                    });
                }
            }
            new_edges = tmp;
            speed--;
        }
        return result;
    }
    getRandomAccessibleEdges(n, speed) {
        const edges = this.edges(n, speed);
        if (edges.length === 0)
            return n;
        return edges[this.getRandomInt(edges.length)];
    }
    distance(n1, n2) {
        if (!n1 || n2 === undefined || n2 === null)
            return -1;
        const n1Id = n1.id !== undefined ? n1.id : n1.index;
        const n2Id = n2.id !== undefined ? n2.id : (n2.index !== undefined ? n2.index : +n2);
        let distance = 0;
        let marked = [];
        marked.push(n1Id);
        if (n1Id === n2Id) {
            return distance;
        }
        let edges = this.edges(n1).filter(e => {
            const eId = e.id !== undefined ? e.id : e.index;
            return !(marked.includes(eId));
        });
        while (edges.length > 0) {
            distance++;
            for (const e of edges) {
                const eId = e.id !== undefined ? e.id : e.index;
                if (eId == n2Id)
                    return distance;
            }
            const save = edges;
            edges = [];
            for (const e of save) {
                const eId = e.id !== undefined ? e.id : e.index;
                this.edges(e).forEach(edge => {
                    const edgeId = edge.id !== undefined ? edge.id : edge.index;
                    if (!(marked.includes(edgeId))) {
                        let isIn = false;
                        for (const i of edges) {
                            if ((i.id !== undefined ? i.id : i.index) === edgeId) {
                                isIn = true;
                            }
                        }
                        if (!isIn)
                            edges.push(edge);
                    }
                });
                marked.push(eId);
            }
        }
        return -1;
    }
    get nodes() {
        return this._nodes;
    }
    get links() {
        return this._links;
    }
    get typology() {
        return this._typology;
    }
    get svgNodes() {
        return this._svgNodes;
    }
    get svgLinks() {
        return this._svgLinks;
    }
    set nodes(n) {
        this._nodes = n;
    }
    set links(l) {
        this._links = l;
    }
    set typology(type) {
        this._typology = type;
    }
    set svgNodes(nodes) {
        this._svgNodes = nodes;
    }
    set svgLinks(links) {
        this._svgLinks = links;
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}


/***/ }),

/***/ "Z22J":
/*!*************************************************************!*\
  !*** ./src/app/components/game-menu/game-menu.component.ts ***!
  \*************************************************************/
/*! exports provided: GameMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameMenuComponent", function() { return GameMenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_graph_graph_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/_services/graph/graph.service */ "daKe");
/* harmony import */ var src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/_services/game/game.service */ "eiSD");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var src_app_services_random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/_services/random-graph/random-graph.service */ "0HIH");
/* harmony import */ var src_app_services_translate_translate_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/_services/translate/translate.service */ "/74g");
/* harmony import */ var src_app_services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/_services/statistic/statistic.service */ "cDp4");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "3Pt+");











const _c0 = ["param1Input"];
const _c1 = ["param2Input"];
const _c2 = ["copsNumberInput"];
function GameMenuComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_button_19_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r7); const type_r5 = ctx.$implicit; const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r6.selectGraphType(type_r5); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "img", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const type_r5 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx_r0.isSelectedGraphType(type_r5) === "selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpropertyInterpolate1"]("src", "assets/menu/graph-img/", type_r5, ".svg", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("alt", ctx_r0.translator.graphTypeName(type_r5));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r0.translator.graphTypeName(type_r5));
} }
function GameMenuComponent_div_26_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "label", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_26_div_3_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r11.updateNumberFieldValue("graphParam1", ctx_r11.config, ctx_r11.update_action.decrease); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "\u2212");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "input", 53, 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_div_26_div_3_Template_input_ngModelChange_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return (ctx_r13.config["graphParam1"] = $event); })("blur", function GameMenuComponent_div_26_div_3_Template_input_blur_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r14.onBlur($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_26_div_3_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r15.updateNumberFieldValue("graphParam1", ctx_r15.config, ctx_r15.update_action.increase); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "+");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r8.paramsNames[0]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r8.config["graphParam1"])("min", ctx_r8.paramsBoundaries[ctx_r8.selectedGraphType].param1);
} }
function GameMenuComponent_div_26_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "label", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_26_div_4_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r17.updateNumberFieldValue("graphParam2", ctx_r17.config, ctx_r17.update_action.decrease); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "\u2212");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "input", 55, 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_div_26_div_4_Template_input_ngModelChange_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r18); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return (ctx_r19.config["graphParam2"] = $event); })("blur", function GameMenuComponent_div_26_div_4_Template_input_blur_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r18); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r20.onBlur($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_26_div_4_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r18); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r21.updateNumberFieldValue("graphParam2", ctx_r21.config, ctx_r21.update_action.increase); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "+");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r9.paramsNames[1]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r9.config["graphParam2"])("min", ctx_r9.paramsBoundaries[ctx_r9.selectedGraphType].param2);
} }
function GameMenuComponent_div_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "h3", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Param\u00E8tres");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, GameMenuComponent_div_26_div_3_Template, 10, 3, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, GameMenuComponent_div_26_div_4_Template, 10, 3, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.paramsNames.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.paramsNames.length > 1);
} }
function GameMenuComponent_button_34_Template(rf, ctx) { if (rf & 1) {
    const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_button_34_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r24); const type_r22 = ctx.$implicit; const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r23.selectPlayer(type_r22); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const type_r22 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx_r2.isSelectedOponent(type_r22) === "selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpropertyInterpolate1"]("src", "assets/menu/opponent-type/vs_", type_r22, ".svg", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("alt", ctx_r2.translator.opponentTypeName(type_r22));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r2.translator.opponentTypeName(type_r22));
} }
function GameMenuComponent_div_35_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "h3", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Votre camp");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_35_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r26); const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r25.setSelectedAi("cops"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Voleur");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_div_35_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r26); const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r27.setSelectedAi("thief"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](9, "img", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Gendarme");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx_r3.isSelectedCopsAi() === "selected");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx_r3.isSelectedThiefAi() === "selected");
} }
class GameMenuComponent {
    constructor(graphService, gameService, router, randomGraph, translator, statisticService, cdr) {
        this.graphService = graphService;
        this.gameService = gameService;
        this.router = router;
        this.randomGraph = randomGraph;
        this.translator = translator;
        this.statisticService = statisticService;
        this.cdr = cdr;
        this.selectedGraphType = 'grid';
        this.selectedOpponentType = 'ai';
        this.availableGraphType = ['grid', 'tore', 'cycle', 'tree', 'copsAlwaysWin', 'petersen', 'dodecahedron'];
        this.availableOpponentType = ['ai', 'player'];
        this.paramsBoundaries = {
            grid: {
                param1: 3,
                param2: 3
            },
            tore: {
                param1: 3,
                param2: 3
            },
            cycle: {
                param1: 5,
                param2: -1
            },
            tree: {
                param1: 5,
                param2: 2
            },
            copsAlwaysWin: {
                param1: 6,
                param2: -1
            },
            random: {
                param1: -1,
                param2: -1
            },
            petersen: {
                param1: -1,
                param2: -1
            },
            dodecahedron: {
                param1: -1,
                param2: -1
            },
            import: {
                param1: -1,
                param2: -1
            }
        };
        this.selectedFileName = undefined;
        this.inputGraphJSONFile = null;
        this.graphGeneration = true;
        this.graphImportation = false;
        this.gameModeSelected = 'easy';
        this.selectedAi = 'cops';
        this.config = {
            'graphParam1': 0,
            'graphParam2': 0,
            'copsNumber': 1,
            'thiefSpeed': 1,
        };
        this.update_action = {
            increase: 'INCREASE',
            decrease: 'DECREASE'
        };
    }
    ngOnInit() {
        this.getDataFromLocalStorage();
        if (navigator.userAgent.includes('Android')
            || navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPhone')) {
            this.selectedOpponentType = 'ai';
        }
        this.selectGraphType(this.selectedGraphType);
        this.updateParamsName();
        this.randomGraph.loadGraphs();
    }
    getDataFromLocalStorage() {
        if (localStorage.getItem('graphType')) {
            this.selectedGraphType = localStorage.getItem('graphType');
        }
        if (localStorage.getItem('graphParam1')) {
            this.config['graphParam1'] = +localStorage.getItem('graphParam1');
        }
        if (localStorage.getItem('graphParam2')) {
            this.config['graphParam2'] = +localStorage.getItem('graphParam2');
        }
        if (localStorage.getItem('opponentType')) {
            this.selectedOpponentType = localStorage.getItem('opponentType');
        }
        if (localStorage.getItem('selectedAi')) {
            this.selectedAi = localStorage.getItem('selectedAi');
        }
        if (localStorage.getItem('gameMode')) {
            this.gameModeSelected = localStorage.getItem('gameMode');
        }
        if (localStorage.getItem('speed')) {
            this.config['thiefSpeed'] = +localStorage.getItem('speed');
        }
        if (localStorage.getItem('copsNum')) {
            this.config['copsNumber'] = +localStorage.getItem('copsNum');
        }
    }
    setDataToLocalStorage() {
        localStorage.setItem('graphType', this.selectedGraphType);
        localStorage.setItem('graphParam1', `${this.config['graphParam1']}`);
        localStorage.setItem('graphParam2', `${this.config['graphParam2']}`);
        localStorage.setItem('opponentType', this.selectedOpponentType);
        localStorage.setItem('selectedAi', this.selectedAi);
        localStorage.setItem('gameMode', this.gameModeSelected);
        localStorage.setItem('speed', `${this.config['thiefSpeed']}`);
        localStorage.setItem('copsNum', `${this.config['copsNumber']}`);
    }
    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
    selectGraphType(type) {
        this.selectedGraphType = type;
        if (type !== 'import') {
            this.graphImportation = false;
            this.graphGeneration = true;
        }
        this.updateParamsName();
        this.updateGraphParams();
        this.paramSafetyCheck();
    }
    updateGraphParams() {
        this.config['graphParam1'] = this.paramsBoundaries[this.selectedGraphType].param1;
        this.config['graphParam2'] = this.paramsBoundaries[this.selectedGraphType].param2;
    }
    updateParamsName() {
        switch (this.selectedGraphType) {
            case 'grid':
                this.paramsNames = ['Largeur :', 'Longueur :'];
                break;
            case 'tore':
                this.paramsNames = ['Largeur :', 'Longueur :'];
                break;
            case 'cycle':
                this.paramsNames = ['Nombre de noeuds :'];
                break;
            case 'tree':
                this.paramsNames = ['Nombre de noeuds :', 'Arité de l\'arbre :'];
                break;
            case 'copsAlwaysWin':
                this.paramsNames = ['Nombre de noeuds :'];
                break;
            case 'random':
                this.paramsNames = [];
                break;
            default:
                this.paramsNames = [];
                break;
        }
    }
    selectPlayer(opponent) {
        this.selectedOpponentType = opponent;
    }
    validateParams() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.paramSafetyCheck()) {
                if (this.graphGeneration) {
                    yield this.graphService.generateGraph(this.selectedGraphType, [this.config['graphParam1'], this.config['graphParam2']]);
                }
                switch (this.gameModeSelected) {
                    case "easy":
                        break;
                    case "medium":
                        break;
                    case "hard":
                        break;
                    case "extreme":
                        break;
                }
                const extras = {
                    queryParams: {
                        gameMode: this.gameModeSelected
                    }
                };
                this.gameService.setOpponentType(this.selectedOpponentType);
                this.gameService.setCopsNumber(this.config['copsNumber']);
                this.gameService.setThiefSpeed(this.config['thiefSpeed']);
                if (this.selectedOpponentType === 'ai') {
                    this.gameService.setAiSide(this.selectedAi);
                }
                else {
                    this.gameService.setAiSide(undefined);
                }
                this.setDataToLocalStorage();
                this.router.navigate(['/board'], extras);
            }
        });
    }
    navigateToDashboard() {
        this.router.navigate(['/dashboard']);
    }
    paramSafetyCheck() {
        if (this.inputGraphJSONFile && this.graphImportation) {
            return true;
        }
        if (this.graphGeneration) {
            if (!this.config['graphParam1'])
                this.config['graphParam1'] = 0;
            if (!this.config['graphParam2'])
                this.config['graphParam2'] = 0;
            return true;
        }
        return false;
    }
    setSelectedAi(side) {
        this.selectedAi = side;
    }
    isSelectedOponent(type) {
        return type === this.selectedOpponentType ? 'selected' : '';
    }
    isSelectedGraphType(typology) {
        return typology === this.selectedGraphType ? 'selected' : '';
    }
    selectGraphGeneration() {
        this.graphGeneration = true;
        this.graphImportation = false;
    }
    selectGraphImportation() {
        this.graphGeneration = false;
        this.graphImportation = true;
    }
    isSeletectedGraphGeneration() {
        return this.graphGeneration ? 'selected' : '';
    }
    isSeletectedGraphImportation() {
        return this.graphImportation ? 'selected' : '';
    }
    isSelectedEasy() {
        return this.gameModeSelected === 'easy' ? 'selected' : '';
    }
    isSelectedMedium() {
        return this.gameModeSelected === 'medium' ? 'selected' : '';
    }
    isSelectedHard() {
        return this.gameModeSelected === 'hard' ? 'selected' : '';
    }
    isSelectedExtreme() {
        return this.gameModeSelected === 'extreme' ? 'selected' : '';
    }
    isSelectedCopsAi() {
        return this.selectedAi === 'cops' ? 'selected' : '';
    }
    isSelectedThiefAi() {
        return this.selectedAi === 'thief' ? 'selected' : '';
    }
    onFileChange(file) {
        if (file) {
            this.inputGraphJSONFile = file;
            this.selectedFileName = this.inputGraphJSONFile.name;
            this.graphService.loadGraphFromFile(file);
            this.graphGeneration = false;
            this.graphImportation = true;
        }
        else {
            this.selectedFileName = undefined;
        }
    }
    onBlur(event) {
        if (+event.target.min > +event.target.value) {
            event.target.value = event.target.min;
        }
        if (event.target.max !== '') {
            if (+event.target.max < +event.target.value) {
                event.target.value = event.target.max;
            }
        }
    }
    checkGraphParamIssues() {
        let paramValidity = this.copsNumberInputRef.nativeElement.validity.valid;
        if (this.param1InputRef && this.paramsNames.length > 0) {
            paramValidity = paramValidity && this.param1InputRef.nativeElement.validity.valid && this.param1InputRef.nativeElement.value !== '';
            if (this.param2InputRef && this.paramsNames.length > 1) {
                paramValidity = paramValidity && this.param2InputRef.nativeElement.validity.valid && this.param2InputRef.nativeElement.value !== '';
            }
        }
        paramValidity = paramValidity && this.config['thiefSpeed'] > 0;
        paramValidity = paramValidity && this.config['copsNumber'] > 0;
        return !paramValidity;
    }
    getMaxCopsNumber() {
        switch (this.selectedGraphType) {
            case 'grid':
            case 'tore':
                return (this.config['graphParam1'] * this.config['graphParam2']) - 1;
            case 'cycle':
            case 'tree':
            case 'copsAlwaysWin':
                return this.config['graphParam1'] - 1;
            case 'random':
            default:
                return 5;
        }
    }
    displayRules() {
        sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a.fire({
            icon: 'info',
            html: this.gameService.rulesHtml()
        });
    }
    updateNumberFieldValue(field_id, config, action) {
        switch (action) {
            case this.update_action.increase:
                config[field_id]++;
                break;
            case this.update_action.decrease:
                config[field_id]--;
                break;
            default:
                break;
        }
    }
}
GameMenuComponent.ɵfac = function GameMenuComponent_Factory(t) { return new (t || GameMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_graph_graph_service__WEBPACK_IMPORTED_MODULE_3__["GraphService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_game_game_service__WEBPACK_IMPORTED_MODULE_4__["GameService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_6__["RandomGraphService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_translate_translate_service__WEBPACK_IMPORTED_MODULE_7__["TranslateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_8__["StatisticService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"])); };
GameMenuComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: GameMenuComponent, selectors: [["app-game-menu"]], viewQuery: function GameMenuComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c2, 3);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.param1InputRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.param2InputRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.copsNumberInputRef = _t.first);
    } }, decls: 89, vars: 23, consts: [[1, "game-menu"], [1, "gm-header"], ["routerLink", "/game-mode-selection", "title", "Retour", 1, "gm-header__back"], ["src", "assets/arrow.svg", "alt", "retour"], [1, "gm-header__center"], [1, "gm-header__eyebrow"], [1, "gm-header__title"], [1, "gm-header__rules", 3, "click"], [1, "gm-body"], [1, "gm-col", "gm-col--graph"], [1, "section-card"], [1, "section-card__title"], [1, "section-card__num"], [1, "topology-grid"], ["class", "topo-tile", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], [1, "topo-tile", "topo-tile--import", 3, "click"], ["id", "graph-file-input", "name", "graph-file-input", "type", "file", "accept", "application/json", 1, "sr-only", 3, "change"], [1, "topo-tile__icon"], [1, "topo-tile__label"], ["class", "extra-params", 4, "ngIf"], [1, "gm-col", "gm-col--options"], [1, "option-tiles"], ["class", "option-tile", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["class", "ai-camp", 4, "ngIf"], [1, "section-card", "section-card--row"], [1, "mini-section"], [1, "param-row__controls"], [1, "stepper-btn", 3, "click"], ["min", "1", "id", "copsNum", "type", "number", "name", "cops", 1, "stepper-input", "stepper-input--lg", 3, "ngModel", "max", "ngModelChange", "blur"], ["copsNumberInput", ""], [1, "mini-section-divider"], ["type", "number", "min", "1", "id", "thiefSpeed", "name", "thiefSpeed", 1, "stepper-input", "stepper-input--lg", 3, "ngModel", "ngModelChange", "blur"], [1, "diff-tiles"], [1, "diff-tile", "diff-tile--easy", 3, "click"], [1, "diff-tile__label"], ["type", "radio", "id", "mode1", "name", "mode", "value", "easy", 1, "sr-only", 3, "ngModel", "ngModelChange"], [1, "diff-tile", "diff-tile--normal", 3, "click"], ["type", "radio", "id", "mode2", "name", "mode", "value", "medium", 1, "sr-only", 3, "ngModel", "ngModelChange"], [1, "diff-tile", "diff-tile--hard", 3, "click"], ["type", "radio", "id", "mode3", "name", "mode", "value", "hard", 1, "sr-only", 3, "ngModel", "ngModelChange"], [1, "diff-tile", "diff-tile--extreme", 3, "click"], ["type", "radio", "id", "mode4", "name", "mode", "value", "extreme", 1, "sr-only", 3, "ngModel", "ngModelChange"], [1, "gm-footer"], [1, "start-btn", 3, "disabled", "click"], [1, "start-btn__label"], [1, "start-btn__arrow"], [1, "topo-tile", 3, "click"], [1, "topo-tile__img", 3, "src", "alt"], [1, "extra-params"], [1, "extra-params__title"], ["class", "param-row", 4, "ngIf"], [1, "param-row"], [1, "param-row__label"], ["id", "param1", "type", "number", "name", "param1", 1, "stepper-input", 3, "ngModel", "min", "ngModelChange", "blur"], ["param1Input", ""], ["id", "param2", "type", "number", "name", "param2", 1, "stepper-input", 3, "ngModel", "min", "ngModelChange", "blur"], ["param2Input", ""], [1, "option-tile", 3, "click"], [1, "option-tile__img", 3, "src", "alt"], [1, "option-tile__label"], [1, "ai-camp"], [1, "ai-camp__label"], [1, "camp-tiles"], [1, "camp-tile", 3, "click"], ["src", "assets/menu/opponent-type/thief.svg", "alt", "Voleur"], ["src", "assets/menu/opponent-type/police.svg", "alt", "Gendarme"]], template: function GameMenuComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Terra Numerica");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "h1", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "Jeu libre");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_9_listener() { return ctx.displayRules(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "R\u00E8gles");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "main", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "section", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "01");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Plateau de jeu ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, GameMenuComponent_button_19_Template, 4, 5, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "label", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_label_click_20_listener() { return ctx.selectGraphType("import"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function GameMenuComponent_Template_input_change_21_listener($event) { return ctx.onFileChange($event.target.files[0]); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, "\u2191");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](26, GameMenuComponent_div_26_Template, 5, 2, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "section", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31, "02");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "Adversaire ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](34, GameMenuComponent_button_34_Template, 4, 5, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](35, GameMenuComponent_div_35_Template, 12, 4, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](37, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](39, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](40, "03");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](41, "Policiers ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](42, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](43, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_43_listener() { return ctx.updateNumberFieldValue("copsNumber", ctx.config, ctx.update_action.decrease); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](44, "\u2212");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](45, "input", 28, 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_45_listener($event) { return (ctx.config["copsNumber"] = $event); })("blur", function GameMenuComponent_Template_input_blur_45_listener($event) { return ctx.onBlur($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](47, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_47_listener() { return ctx.updateNumberFieldValue("copsNumber", ctx.config, ctx.update_action.increase); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](48, "+");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](49, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](50, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](51, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](52, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](53, "04");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](54, "Vitesse du voleur ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](55, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](56, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_56_listener() { return ctx.updateNumberFieldValue("thiefSpeed", ctx.config, ctx.update_action.decrease); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](57, "\u2212");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](58, "input", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_58_listener($event) { return (ctx.config["thiefSpeed"] = $event); })("blur", function GameMenuComponent_Template_input_blur_58_listener($event) { return ctx.onBlur($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](59, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_59_listener() { return ctx.updateNumberFieldValue("thiefSpeed", ctx.config, ctx.update_action.increase); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](60, "+");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](61, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](62, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](63, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](64, "05");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](65, "Difficult\u00E9 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](66, "div", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](67, "button", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_67_listener() { return ctx.gameModeSelected = "easy"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](68, "span", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](69, "Facile");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](70, "input", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_70_listener($event) { return ctx.gameModeSelected = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](71, "button", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_71_listener() { return ctx.gameModeSelected = "medium"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](72, "span", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](73, "Normal");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](74, "input", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_74_listener($event) { return ctx.gameModeSelected = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](75, "button", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_75_listener() { return ctx.gameModeSelected = "hard"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](76, "span", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](77, "Difficile");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](78, "input", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_78_listener($event) { return ctx.gameModeSelected = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](79, "button", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_79_listener() { return ctx.gameModeSelected = "extreme"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](80, "span", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](81, "Extr\u00EAme");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](82, "input", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameMenuComponent_Template_input_ngModelChange_82_listener($event) { return ctx.gameModeSelected = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](83, "div", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](84, "button", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameMenuComponent_Template_button_click_84_listener() { return ctx.validateParams(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](85, "span", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](86, "Commencer la partie");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](87, "span", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](88, "\u2192");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.availableGraphType);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx.isSelectedGraphType("import") === "selected");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.selectedFileName || "Importer un graphe");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.paramsNames.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.availableOpponentType);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.selectedOpponentType === "ai");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.config["copsNumber"])("max", ctx.getMaxCopsNumber());
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.config["thiefSpeed"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx.isSelectedEasy() === "selected");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.gameModeSelected);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx.isSelectedMedium() === "selected");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.gameModeSelected);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx.isSelectedHard() === "selected");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.gameModeSelected);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("is-selected", ctx.isSelectedExtreme() === "selected");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.gameModeSelected);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.checkGraphParamIssues());
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLink"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NumberValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_10__["RadioControlValueAccessor"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Nunito:wght@400;500;600;700&display=swap\");\n  body {\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n  background: linear-gradient(180deg, #fbf8f2 0%, #f2ede4 100%);\n  font-family: \"Nunito\", sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.game-menu[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 12px;\n  color: #2c241c;\n  font-family: \"Nunito\", sans-serif;\n  background: radial-gradient(circle at top left, rgba(217, 139, 31, 0.06), transparent 24%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.04), transparent 24%), linear-gradient(180deg, #fbf8f2 0%, #f2ede4 100%);\n}\n.gm-header[_ngcontent-%COMP%] {\n  max-width: 1080px;\n  margin: 0 auto 14px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.gm-header__back[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  border: 1.5px solid rgba(26, 22, 18, 0.25);\n  border-radius: 8px;\n  background: #f7f3ed;\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  box-shadow: 0 2px 4px rgba(26, 22, 18, 0.05), 0 6px 18px rgba(26, 22, 18, 0.07);\n  transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;\n}\n.gm-header__back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  filter: brightness(0) saturate(100%) invert(8%) sepia(11%) saturate(870%) hue-rotate(349deg) brightness(94%) contrast(96%);\n}\n.gm-header__back[_ngcontent-%COMP%]:hover {\n  background: #fdf0ec;\n  border-color: #c0392b;\n  transform: translateX(-3px);\n}\n.gm-header__center[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n}\n.gm-header__eyebrow[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.62rem;\n  font-weight: 700;\n  letter-spacing: 0.2em;\n  text-transform: uppercase;\n  color: #d7a928;\n}\n.gm-header__title[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: clamp(1.6rem, 2.8vw, 2.4rem);\n  font-weight: 700;\n  color: #2c241c;\n}\n.gm-header__rules[_ngcontent-%COMP%] {\n  width: 72px;\n  height: 52px;\n  border: 1.5px solid rgba(80, 60, 30, 0.22);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.86);\n  color: #2c241c;\n  font-weight: 800;\n  cursor: pointer;\n  box-shadow: 0 6px 16px rgba(60, 40, 20, 0.05);\n  transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;\n}\n.gm-header__rules[_ngcontent-%COMP%]:hover {\n  background: #fdf0ec;\n  border-color: #c0392b;\n  transform: translateY(-2px);\n}\n.gm-body[_ngcontent-%COMP%] {\n  max-width: 1080px;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1.05fr 1fr;\n  gap: 14px;\n}\n.gm-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.section-card[_ngcontent-%COMP%] {\n  padding: 16px;\n  background: rgba(255, 255, 255, 0.86);\n  border: 1.5px solid rgba(80, 60, 30, 0.12);\n  border-radius: 14px;\n  box-shadow: 0 8px 22px rgba(60, 40, 20, 0.07);\n  backdrop-filter: blur(10px);\n}\n.section-card--row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  gap: 14px;\n  align-items: center;\n}\n.section-card__title[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: 1.15rem;\n  color: #2c241c;\n}\n.section-card__num[_ngcontent-%COMP%] {\n  font-family: \"Nunito\", sans-serif;\n  font-size: 0.68rem;\n  font-weight: 800;\n  color: #d7a928;\n  letter-spacing: 0.1em;\n}\n.topology-grid[_ngcontent-%COMP%], .option-tiles[_ngcontent-%COMP%], .camp-tiles[_ngcontent-%COMP%], .diff-tiles[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n}\n.topology-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.option-tiles[_ngcontent-%COMP%], .camp-tiles[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.diff-tiles[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.topo-tile[_ngcontent-%COMP%], .option-tile[_ngcontent-%COMP%], .camp-tile[_ngcontent-%COMP%], .diff-tile[_ngcontent-%COMP%] {\n  min-height: 82px;\n  padding: 10px;\n  border: 1.5px solid rgba(80, 60, 30, 0.12);\n  border-radius: 11px;\n  background: rgba(255, 255, 255, 0.96);\n  color: #2c241c;\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  font-family: \"Nunito\", sans-serif;\n  font-size: 0.9rem;\n  font-weight: 700;\n  box-shadow: 0 6px 16px rgba(60, 40, 20, 0.05);\n  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;\n}\n.topo-tile[_ngcontent-%COMP%]:hover, .option-tile[_ngcontent-%COMP%]:hover, .camp-tile[_ngcontent-%COMP%]:hover, .diff-tile[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  border-color: #d7a928;\n  background: #fffdf8;\n}\n.topo-tile.is-selected[_ngcontent-%COMP%], .option-tile.is-selected[_ngcontent-%COMP%], .camp-tile.is-selected[_ngcontent-%COMP%], .diff-tile.is-selected[_ngcontent-%COMP%] {\n  border-color: #d7a928;\n  background: rgba(215, 169, 40, 0.12);\n  box-shadow: 0 0 0 2px rgba(215, 169, 40, 0.08), 0 8px 22px rgba(60, 40, 20, 0.07);\n}\n.topo-tile__img[_ngcontent-%COMP%], .option-tile__img[_ngcontent-%COMP%], .camp-tile[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  object-fit: contain;\n}\n.topo-tile__label[_ngcontent-%COMP%], .option-tile__label[_ngcontent-%COMP%], .camp-tile[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .diff-tile__label[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #2c241c;\n  line-height: 1.1;\n}\n.topo-tile__icon[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  color: #d7a928;\n}\n.extra-params[_ngcontent-%COMP%], .ai-camp[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  padding-top: 12px;\n  border-top: 1px solid rgba(80, 60, 30, 0.12);\n}\n.extra-params__title[_ngcontent-%COMP%], .ai-camp__label[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: 0.98rem;\n  color: #7c6d5d;\n}\n.param-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  margin-top: 8px;\n}\n.param-row__label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  color: #7c6d5d;\n}\n.param-row__controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n.stepper-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border: 1.5px solid rgba(80, 60, 30, 0.12);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.96);\n  color: #2c241c;\n  font-size: 1rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;\n}\n.stepper-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(215, 169, 40, 0.12);\n  border-color: #d7a928;\n}\n.stepper-input[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 32px;\n  border: 1.5px solid rgba(80, 60, 30, 0.12);\n  border-radius: 8px;\n  background: #fff;\n  color: #2c241c;\n  text-align: center;\n  font-size: 0.9rem;\n  font-weight: 800;\n  font-family: \"Nunito\", sans-serif;\n}\n.stepper-input--lg[_ngcontent-%COMP%] {\n  width: 74px;\n}\n.mini-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.mini-section-divider[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 64px;\n  background: rgba(80, 60, 30, 0.12);\n}\n.diff-tile[_ngcontent-%COMP%] {\n  min-height: 58px;\n}\n.diff-tile--easy.is-selected[_ngcontent-%COMP%] {\n  border-color: #5aa469;\n  background: rgba(90, 164, 105, 0.12);\n}\n.diff-tile--normal.is-selected[_ngcontent-%COMP%] {\n  border-color: #d7a928;\n  background: rgba(215, 169, 40, 0.12);\n}\n.diff-tile--hard.is-selected[_ngcontent-%COMP%] {\n  border-color: #d98b1f;\n  background: rgba(217, 139, 31, 0.12);\n}\n.diff-tile--extreme.is-selected[_ngcontent-%COMP%] {\n  border-color: #c0392b;\n  background: rgba(192, 57, 43, 0.12);\n}\n.gm-footer[_ngcontent-%COMP%] {\n  max-width: 520px;\n  margin: 16px auto 0;\n}\n.start-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 22px;\n  border: none;\n  border-radius: 999px;\n  background: #d7a928;\n  color: white;\n  font-family: \"Playfair Display\", Georgia, serif;\n  font-size: 0.95rem;\n  font-weight: 700;\n  font-style: italic;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  box-shadow: 0 8px 20px rgba(215, 169, 40, 0.2);\n  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;\n}\n.start-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #dcb342;\n  box-shadow: 0 10px 24px rgba(215, 169, 40, 0.24);\n}\n.start-btn[_ngcontent-%COMP%]:hover:not(:disabled)   .start-btn__arrow[_ngcontent-%COMP%] {\n  transform: translateX(4px);\n}\n.start-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n.start-btn__arrow[_ngcontent-%COMP%] {\n  transition: transform 0.18s ease;\n}\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n  pointer-events: none;\n}\n@media (max-width: 950px) {\n  .gm-body[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .topology-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .diff-tiles[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 620px) {\n  .game-menu[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n\n  .gm-header[_ngcontent-%COMP%] {\n    margin-bottom: 12px;\n  }\n\n  .gm-header__back[_ngcontent-%COMP%], .gm-header__rules[_ngcontent-%COMP%] {\n    width: 46px;\n    height: 46px;\n  }\n\n  .gm-header__back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    width: 22px;\n    height: 22px;\n  }\n\n  .gm-header__title[_ngcontent-%COMP%] {\n    font-size: clamp(1.35rem, 6vw, 1.9rem);\n  }\n\n  .gm-body[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n\n  .section-card[_ngcontent-%COMP%] {\n    padding: 14px;\n  }\n\n  .section-card--row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .mini-section-divider[_ngcontent-%COMP%] {\n    display: none;\n  }\n\n  .topology-grid[_ngcontent-%COMP%], .option-tiles[_ngcontent-%COMP%], .camp-tiles[_ngcontent-%COMP%], .diff-tiles[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .topo-tile[_ngcontent-%COMP%], .option-tile[_ngcontent-%COMP%], .camp-tile[_ngcontent-%COMP%], .diff-tile[_ngcontent-%COMP%] {\n    min-height: 74px;\n    padding: 8px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxnYW1lLW1lbnUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQVEsb0pBQUE7QUFxQlI7RUFDRSxTQUFBO0VBQ0EsVUFBQTtFQUNBLGlCQUFBO0VBQ0EsNkRBQUE7RUFDQSxpQ0FYVTtBQVJaO0FBc0JBO0VBQ0Usc0JBQUE7QUFuQkY7QUFzQkE7RUFDRSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxjQXpCSztFQTBCTCxpQ0F0QlU7RUF1QlYsaU9BQ0U7QUFwQko7QUF5QkE7RUFDRSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtBQXRCRjtBQXlCQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsMENBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7RUFDQSwrRUFBQTtFQUNBLGdGQUFBO0FBdEJGO0FBd0JFO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSwwSEFBQTtBQXRCSjtBQXlCRTtFQUNFLG1CQUFBO0VBQ0EscUJBL0RLO0VBZ0VMLDJCQUFBO0FBdkJKO0FBMkJBO0VBQ0UsT0FBQTtFQUNBLGtCQUFBO0FBeEJGO0FBMkJBO0VBQ0UsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FsRks7QUEwRFA7QUEyQkE7RUFDRSxlQUFBO0VBQ0EsK0NBaEZXO0VBaUZYLHVDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQXRGSztBQThEUDtBQTJCQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsMENBQUE7RUFDQSxrQkFBQTtFQUNBLHFDQXRHUTtFQXVHUixjQS9GSztFQWdHTCxnQkFBQTtFQUNBLGVBQUE7RUFDQSw2Q0EzRlk7RUE0RlosZ0ZBQUE7QUF4QkY7QUEwQkU7RUFDRSxtQkFBQTtFQUNBLHFCQXhHSztFQXlHTCwyQkFBQTtBQXhCSjtBQTRCQTtFQUNFLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSxpQ0FBQTtFQUNBLFNBQUE7QUF6QkY7QUE0QkE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBekJGO0FBNEJBO0VBQ0UsYUFBQTtFQUNBLHFDQXBJUTtFQXFJUiwwQ0FBQTtFQUNBLG1CQXpITztFQTBIUCw2Q0F6SFk7RUEwSFosMkJBQUE7QUF6QkY7QUE0QkE7RUFDRSxhQUFBO0VBQ0EsbUNBQUE7RUFDQSxTQUFBO0VBQ0EsbUJBQUE7QUF6QkY7QUE0QkE7RUFDRSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSwrQ0E1SVc7RUE2SVgsa0JBQUE7RUFDQSxjQWpKSztBQXdIUDtBQTRCQTtFQUNFLGlDQWpKVTtFQWtKVixrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0E1Sks7RUE2SkwscUJBQUE7QUF6QkY7QUE0QkE7Ozs7RUFJRSxhQUFBO0VBQ0EsUUFBQTtBQXpCRjtBQTRCQTtFQUNFLGdEQUFBO0FBekJGO0FBNEJBOztFQUVFLGdEQUFBO0FBekJGO0FBNEJBO0VBQ0UsZ0RBQUE7QUF6QkY7QUE0QkE7Ozs7RUFJRSxnQkFBQTtFQUNBLGFBQUE7RUFDQSwwQ0FBQTtFQUNBLG1CQUFBO0VBQ0EscUNBaE1lO0VBaU1mLGNBMUxLO0VBMkxMLGVBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtFQUNBLGlDQTdMVTtFQThMVixpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsNkNBN0xZO0VBOExaLHVHQUFBO0FBekJGO0FBMkJFOzs7O0VBQ0UsMkJBQUE7RUFDQSxxQkE3TUc7RUE4TUgsbUJBQUE7QUF0Qko7QUF5QkU7Ozs7RUFDRSxxQkFsTkc7RUFtTkgsb0NBbE5PO0VBbU5QLGlGQUFBO0FBcEJKO0FBd0JBOzs7RUFHRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0FBckJGO0FBd0JBOzs7O0VBSUUsa0JBQUE7RUFDQSxjQWpPSztFQWtPTCxnQkFBQTtBQXJCRjtBQXdCQTtFQUNFLGlCQUFBO0VBQ0EsY0EzT0s7QUFzTlA7QUF3QkE7O0VBRUUsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLDRDQUFBO0FBckJGO0FBd0JBOztFQUVFLGdCQUFBO0VBQ0EsK0NBalBXO0VBa1BYLGtCQUFBO0VBQ0EsY0FyUFM7QUFnT1g7QUF3QkE7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0FBckJGO0FBd0JBO0VBQ0UsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBblFTO0FBOE9YO0FBd0JBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FBckJGO0FBd0JBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSwwQ0FBQTtFQUNBLGtCQUFBO0VBQ0EscUNBMVJlO0VBMlJmLGNBcFJLO0VBcVJMLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxnRkFBQTtBQXJCRjtBQXVCRTtFQUNFLG9DQTlSTztFQStSUCxxQkFoU0c7QUEyUVA7QUF5QkE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBdFNLO0VBdVNMLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGlDQXRTVTtBQWdSWjtBQXlCQTtFQUNFLFdBQUE7QUF0QkY7QUF5QkE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtBQXRCRjtBQXlCQTtFQUNFLFVBQUE7RUFDQSxZQUFBO0VBQ0Esa0NBaFVPO0FBMFNUO0FBeUJBO0VBQ0UsZ0JBQUE7QUF0QkY7QUF5QkE7RUFDRSxxQkFBQTtFQUNBLG9DQUFBO0FBdEJGO0FBeUJBO0VBQ0UscUJBM1VLO0VBNFVMLG9DQTNVUztBQXFUWDtBQXlCQTtFQUNFLHFCQXBVTTtFQXFVTixvQ0FBQTtBQXRCRjtBQXlCQTtFQUNFLHFCQWxWTztFQW1WUCxtQ0FBQTtBQXRCRjtBQXlCQTtFQUNFLGdCQUFBO0VBQ0EsbUJBQUE7QUF0QkY7QUF5QkE7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSxtQkFuV0s7RUFvV0wsWUFBQTtFQUNBLCtDQTlWVztFQStWWCxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxTQUFBO0VBQ0EsOENBQUE7RUFDQSw4RUFBQTtBQXRCRjtBQXdCRTtFQUNFLG1CQUFBO0VBQ0EsZ0RBQUE7QUF0Qko7QUF3Qkk7RUFDRSwwQkFBQTtBQXRCTjtBQTBCRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtBQXhCSjtBQTRCQTtFQUNFLGdDQUFBO0FBekJGO0FBNEJBO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7RUFDQSxvQkFBQTtBQXpCRjtBQTRCQTtFQUNFO0lBQ0UsMEJBQUE7RUF6QkY7O0VBNEJBO0lBQ0UsZ0RBQUE7RUF6QkY7O0VBNEJBO0lBQ0UsZ0RBQUE7RUF6QkY7QUFDRjtBQTRCQTtFQUNFO0lBQ0UsYUFBQTtFQTFCRjs7RUE2QkE7SUFDRSxtQkFBQTtFQTFCRjs7RUE2QkE7O0lBRUUsV0FBQTtJQUNBLFlBQUE7RUExQkY7O0VBNkJBO0lBQ0UsV0FBQTtJQUNBLFlBQUE7RUExQkY7O0VBNkJBO0lBQ0Usc0NBQUE7RUExQkY7O0VBNkJBO0lBQ0UsU0FBQTtFQTFCRjs7RUE2QkE7SUFDRSxhQUFBO0VBMUJGOztFQTZCQTtJQUNFLDBCQUFBO0VBMUJGOztFQTZCQTtJQUNFLGFBQUE7RUExQkY7O0VBNkJBOzs7O0lBSUUsMEJBQUE7RUExQkY7O0VBNkJBOzs7O0lBSUUsZ0JBQUE7SUFDQSxZQUFBO0VBMUJGO0FBQ0YiLCJmaWxlIjoiZ2FtZS1tZW51LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9UGxheWZhaXIrRGlzcGxheTppdGFsLHdnaHRAMCw2MDA7MCw3MDA7MSw2MDAmZmFtaWx5PU51bml0bzp3Z2h0QDQwMDs1MDA7NjAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcclxuXHJcbiRiZzogI2Y2ZjRlZjtcclxuJHN1cmZhY2U6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44Nik7XHJcbiRzdXJmYWNlLXN0cm9uZzogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjk2KTtcclxuJGJvcmRlcjogcmdiYSg4MCwgNjAsIDMwLCAwLjEyKTtcclxuJGJvcmRlci1zdHJvbmc6IHJnYmEoODAsIDYwLCAzMCwgMC4yMik7XHJcbiRnb2xkOiAjZDdhOTI4O1xyXG4kZ29sZC1kaW06IHJnYmEoMjE1LCAxNjksIDQwLCAwLjEyKTtcclxuJGdvbGQtc29mdDogcmdiYSgyMTUsIDE2OSwgNDAsIDAuMjIpO1xyXG4kYWNjZW50OiAjYzAzOTJiO1xyXG4kdGV4dDogIzJjMjQxYztcclxuJHRleHQtbWlkOiAjN2M2ZDVkO1xyXG4kdGV4dC1zb2Z0OiAjYTA5MzgyO1xyXG4kZm9udC10aXRsZTogJ1BsYXlmYWlyIERpc3BsYXknLCBHZW9yZ2lhLCBzZXJpZjtcclxuJGZvbnQtYm9keTogJ051bml0bycsIHNhbnMtc2VyaWY7XHJcbiRyYWRpdXM6IDE0cHg7XHJcbiRzaGFkb3ctY2FyZDogMCA4cHggMjJweCByZ2JhKDYwLCA0MCwgMjAsIDAuMDcpO1xyXG4kc2hhZG93LXNvZnQ6IDAgNnB4IDE2cHggcmdiYSg2MCwgNDAsIDIwLCAwLjA1KTtcclxuJGFtYmVyOiAjZDk4YjFmO1xyXG5cclxuOjpuZy1kZWVwIGJvZHkge1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmYmY4ZjIgMCUsICNmMmVkZTQgMTAwJSk7XHJcbiAgZm9udC1mYW1pbHk6ICRmb250LWJvZHk7XHJcbn1cclxuXHJcbioge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn1cclxuXHJcbi5nYW1lLW1lbnUge1xyXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gIHBhZGRpbmc6IDEycHg7XHJcbiAgY29sb3I6ICR0ZXh0O1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1ib2R5O1xyXG4gIGJhY2tncm91bmQ6XHJcbiAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IHRvcCBsZWZ0LCByZ2JhKDIxNywgMTM5LCAzMSwgMC4wNiksIHRyYW5zcGFyZW50IDI0JSksXHJcbiAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGJvdHRvbSByaWdodCwgcmdiYSgxMjQsIDU4LCAyMzcsIDAuMDQpLCB0cmFuc3BhcmVudCAyNCUpLFxyXG4gICAgbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2ZiZjhmMiAwJSwgI2YyZWRlNCAxMDAlKTtcclxufVxyXG5cclxuLmdtLWhlYWRlciB7XHJcbiAgbWF4LXdpZHRoOiAxMDgwcHg7XHJcbiAgbWFyZ2luOiAwIGF1dG8gMTRweDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAxMHB4O1xyXG59XHJcblxyXG4uZ20taGVhZGVyX19iYWNrIHtcclxuICB3aWR0aDogNTJweDtcclxuICBoZWlnaHQ6IDUycHg7XHJcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCByZ2JhKDI2LCAyMiwgMTgsIDAuMjUpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICBiYWNrZ3JvdW5kOiAjZjdmM2VkO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZmxleC1zaHJpbms6IDA7XHJcbiAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMjYsIDIyLCAxOCwgMC4wNSksIDAgNnB4IDE4cHggcmdiYSgyNiwgMjIsIDE4LCAwLjA3KTtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMThzIGVhc2UsIGJvcmRlci1jb2xvciAwLjE4cyBlYXNlLCB0cmFuc2Zvcm0gMC4xNXMgZWFzZTtcclxuXHJcbiAgaW1nIHtcclxuICAgIHdpZHRoOiAyNHB4O1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDApIHNhdHVyYXRlKDEwMCUpIGludmVydCg4JSkgc2VwaWEoMTElKSBzYXR1cmF0ZSg4NzAlKSBodWUtcm90YXRlKDM0OWRlZykgYnJpZ2h0bmVzcyg5NCUpIGNvbnRyYXN0KDk2JSk7XHJcbiAgfVxyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZGYwZWM7XHJcbiAgICBib3JkZXItY29sb3I6ICRhY2NlbnQ7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTNweCk7XHJcbiAgfVxyXG59XHJcblxyXG4uZ20taGVhZGVyX19jZW50ZXIge1xyXG4gIGZsZXg6IDE7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uZ20taGVhZGVyX19leWVicm93IHtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBmb250LXNpemU6IDAuNjJyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICBsZXR0ZXItc3BhY2luZzogMC4yZW07XHJcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICBjb2xvcjogJGdvbGQ7XHJcbn1cclxuXHJcbi5nbS1oZWFkZXJfX3RpdGxlIHtcclxuICBtYXJnaW46IDJweCAwIDA7XHJcbiAgZm9udC1mYW1pbHk6ICRmb250LXRpdGxlO1xyXG4gIGZvbnQtc2l6ZTogY2xhbXAoMS42cmVtLCAyLjh2dywgMi40cmVtKTtcclxuICBmb250LXdlaWdodDogNzAwO1xyXG4gIGNvbG9yOiAkdGV4dDtcclxufVxyXG5cclxuLmdtLWhlYWRlcl9fcnVsZXMge1xyXG4gIHdpZHRoOiA3MnB4O1xyXG4gIGhlaWdodDogNTJweDtcclxuICBib3JkZXI6IDEuNXB4IHNvbGlkICRib3JkZXItc3Ryb25nO1xyXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICBiYWNrZ3JvdW5kOiAkc3VyZmFjZTtcclxuICBjb2xvcjogJHRleHQ7XHJcbiAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgYm94LXNoYWRvdzogJHNoYWRvdy1zb2Z0O1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4xOHMgZWFzZSwgYm9yZGVyLWNvbG9yIDAuMThzIGVhc2UsIHRyYW5zZm9ybSAwLjE1cyBlYXNlO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZGYwZWM7XHJcbiAgICBib3JkZXItY29sb3I6ICRhY2NlbnQ7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgfVxyXG59XHJcblxyXG4uZ20tYm9keSB7XHJcbiAgbWF4LXdpZHRoOiAxMDgwcHg7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbiAgZGlzcGxheTogZ3JpZDtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuMDVmciAxZnI7XHJcbiAgZ2FwOiAxNHB4O1xyXG59XHJcblxyXG4uZ20tY29sIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiAxNHB4O1xyXG59XHJcblxyXG4uc2VjdGlvbi1jYXJkIHtcclxuICBwYWRkaW5nOiAxNnB4O1xyXG4gIGJhY2tncm91bmQ6ICRzdXJmYWNlO1xyXG4gIGJvcmRlcjogMS41cHggc29saWQgJGJvcmRlcjtcclxuICBib3JkZXItcmFkaXVzOiAkcmFkaXVzO1xyXG4gIGJveC1zaGFkb3c6ICRzaGFkb3ctY2FyZDtcclxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XHJcbn1cclxuXHJcbi5zZWN0aW9uLWNhcmQtLXJvdyB7XHJcbiAgZGlzcGxheTogZ3JpZDtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBhdXRvIDFmcjtcclxuICBnYXA6IDE0cHg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnNlY3Rpb24tY2FyZF9fdGl0bGUge1xyXG4gIG1hcmdpbjogMCAwIDEycHg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogOHB4O1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC10aXRsZTtcclxuICBmb250LXNpemU6IDEuMTVyZW07XHJcbiAgY29sb3I6ICR0ZXh0O1xyXG59XHJcblxyXG4uc2VjdGlvbi1jYXJkX19udW0ge1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1ib2R5O1xyXG4gIGZvbnQtc2l6ZTogMC42OHJlbTtcclxuICBmb250LXdlaWdodDogODAwO1xyXG4gIGNvbG9yOiAkZ29sZDtcclxuICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbn1cclxuXHJcbi50b3BvbG9neS1ncmlkLFxyXG4ub3B0aW9uLXRpbGVzLFxyXG4uY2FtcC10aWxlcyxcclxuLmRpZmYtdGlsZXMge1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ2FwOiA4cHg7XHJcbn1cclxuXHJcbi50b3BvbG9neS1ncmlkIHtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7XHJcbn1cclxuXHJcbi5vcHRpb24tdGlsZXMsXHJcbi5jYW1wLXRpbGVzIHtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSk7XHJcbn1cclxuXHJcbi5kaWZmLXRpbGVzIHtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg0LCBtaW5tYXgoMCwgMWZyKSk7XHJcbn1cclxuXHJcbi50b3BvLXRpbGUsXHJcbi5vcHRpb24tdGlsZSxcclxuLmNhbXAtdGlsZSxcclxuLmRpZmYtdGlsZSB7XHJcbiAgbWluLWhlaWdodDogODJweDtcclxuICBwYWRkaW5nOiAxMHB4O1xyXG4gIGJvcmRlcjogMS41cHggc29saWQgJGJvcmRlcjtcclxuICBib3JkZXItcmFkaXVzOiAxMXB4O1xyXG4gIGJhY2tncm91bmQ6ICRzdXJmYWNlLXN0cm9uZztcclxuICBjb2xvcjogJHRleHQ7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGdhcDogNnB4O1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1ib2R5O1xyXG4gIGZvbnQtc2l6ZTogMC45cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgYm94LXNoYWRvdzogJHNoYWRvdy1zb2Z0O1xyXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjE4cyBlYXNlLCBib3JkZXItY29sb3IgMC4xOHMgZWFzZSwgYmFja2dyb3VuZCAwLjE4cyBlYXNlLCBib3gtc2hhZG93IDAuMThzIGVhc2U7XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkZ29sZDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZkZjg7XHJcbiAgfVxyXG5cclxuICAmLmlzLXNlbGVjdGVkIHtcclxuICAgIGJvcmRlci1jb2xvcjogJGdvbGQ7XHJcbiAgICBiYWNrZ3JvdW5kOiAkZ29sZC1kaW07XHJcbiAgICBib3gtc2hhZG93OiAwIDAgMCAycHggcmdiYSgyMTUsIDE2OSwgNDAsIDAuMDgpLCAkc2hhZG93LWNhcmQ7XHJcbiAgfVxyXG59XHJcblxyXG4udG9wby10aWxlX19pbWcsXHJcbi5vcHRpb24tdGlsZV9faW1nLFxyXG4uY2FtcC10aWxlIGltZyB7XHJcbiAgd2lkdGg6IDM2cHg7XHJcbiAgaGVpZ2h0OiAzNnB4O1xyXG4gIG9iamVjdC1maXQ6IGNvbnRhaW47XHJcbn1cclxuXHJcbi50b3BvLXRpbGVfX2xhYmVsLFxyXG4ub3B0aW9uLXRpbGVfX2xhYmVsLFxyXG4uY2FtcC10aWxlIHNwYW4sXHJcbi5kaWZmLXRpbGVfX2xhYmVsIHtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgY29sb3I6ICR0ZXh0O1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbn1cclxuXHJcbi50b3BvLXRpbGVfX2ljb24ge1xyXG4gIGZvbnQtc2l6ZTogMS42cmVtO1xyXG4gIGNvbG9yOiAkZ29sZDtcclxufVxyXG5cclxuLmV4dHJhLXBhcmFtcyxcclxuLmFpLWNhbXAge1xyXG4gIG1hcmdpbi10b3A6IDE0cHg7XHJcbiAgcGFkZGluZy10b3A6IDEycHg7XHJcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICRib3JkZXI7XHJcbn1cclxuXHJcbi5leHRyYS1wYXJhbXNfX3RpdGxlLFxyXG4uYWktY2FtcF9fbGFiZWwge1xyXG4gIG1hcmdpbjogMCAwIDEwcHg7XHJcbiAgZm9udC1mYW1pbHk6ICRmb250LXRpdGxlO1xyXG4gIGZvbnQtc2l6ZTogMC45OHJlbTtcclxuICBjb2xvcjogJHRleHQtbWlkO1xyXG59XHJcblxyXG4ucGFyYW0tcm93IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMTBweDtcclxuICBtYXJnaW4tdG9wOiA4cHg7XHJcbn1cclxuXHJcbi5wYXJhbS1yb3dfX2xhYmVsIHtcclxuICBmb250LXNpemU6IDAuOXJlbTtcclxuICBmb250LXdlaWdodDogNzAwO1xyXG4gIGNvbG9yOiAkdGV4dC1taWQ7XHJcbn1cclxuXHJcbi5wYXJhbS1yb3dfX2NvbnRyb2xzIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgZ2FwOiA2cHg7XHJcbn1cclxuXHJcbi5zdGVwcGVyLWJ0biB7XHJcbiAgd2lkdGg6IDMycHg7XHJcbiAgaGVpZ2h0OiAzMnB4O1xyXG4gIGJvcmRlcjogMS41cHggc29saWQgJGJvcmRlcjtcclxuICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgYmFja2dyb3VuZDogJHN1cmZhY2Utc3Ryb25nO1xyXG4gIGNvbG9yOiAkdGV4dDtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjE4cyBlYXNlLCBib3JkZXItY29sb3IgMC4xOHMgZWFzZSwgdHJhbnNmb3JtIDAuMTVzIGVhc2U7XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZDogJGdvbGQtZGltO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkZ29sZDtcclxuICB9XHJcbn1cclxuXHJcbi5zdGVwcGVyLWlucHV0IHtcclxuICB3aWR0aDogNjBweDtcclxuICBoZWlnaHQ6IDMycHg7XHJcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCAkYm9yZGVyO1xyXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICBiYWNrZ3JvdW5kOiAjZmZmO1xyXG4gIGNvbG9yOiAkdGV4dDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgZm9udC1zaXplOiAwLjlyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICBmb250LWZhbWlseTogJGZvbnQtYm9keTtcclxufVxyXG5cclxuLnN0ZXBwZXItaW5wdXQtLWxnIHtcclxuICB3aWR0aDogNzRweDtcclxufVxyXG5cclxuLm1pbmktc2VjdGlvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5taW5pLXNlY3Rpb24tZGl2aWRlciB7XHJcbiAgd2lkdGg6IDFweDtcclxuICBoZWlnaHQ6IDY0cHg7XHJcbiAgYmFja2dyb3VuZDogJGJvcmRlcjtcclxufVxyXG5cclxuLmRpZmYtdGlsZSB7XHJcbiAgbWluLWhlaWdodDogNThweDtcclxufVxyXG5cclxuLmRpZmYtdGlsZS0tZWFzeS5pcy1zZWxlY3RlZCB7XHJcbiAgYm9yZGVyLWNvbG9yOiAjNWFhNDY5O1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoOTAsIDE2NCwgMTA1LCAwLjEyKTtcclxufVxyXG5cclxuLmRpZmYtdGlsZS0tbm9ybWFsLmlzLXNlbGVjdGVkIHtcclxuICBib3JkZXItY29sb3I6ICRnb2xkO1xyXG4gIGJhY2tncm91bmQ6ICRnb2xkLWRpbTtcclxufVxyXG5cclxuLmRpZmYtdGlsZS0taGFyZC5pcy1zZWxlY3RlZCB7XHJcbiAgYm9yZGVyLWNvbG9yOiAkYW1iZXI7XHJcbiAgYmFja2dyb3VuZDogcmdiYSgyMTcsIDEzOSwgMzEsIDAuMTIpO1xyXG59XHJcblxyXG4uZGlmZi10aWxlLS1leHRyZW1lLmlzLXNlbGVjdGVkIHtcclxuICBib3JkZXItY29sb3I6ICRhY2NlbnQ7XHJcbiAgYmFja2dyb3VuZDogcmdiYSgxOTIsIDU3LCA0MywgMC4xMik7XHJcbn1cclxuXHJcbi5nbS1mb290ZXIge1xyXG4gIG1heC13aWR0aDogNTIwcHg7XHJcbiAgbWFyZ2luOiAxNnB4IGF1dG8gMDtcclxufVxyXG5cclxuLnN0YXJ0LWJ0biB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgcGFkZGluZzogMTJweCAyMnB4O1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICBiYWNrZ3JvdW5kOiAkZ29sZDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgZm9udC1mYW1pbHk6ICRmb250LXRpdGxlO1xyXG4gIGZvbnQtc2l6ZTogMC45NXJlbTtcclxuICBmb250LXdlaWdodDogNzAwO1xyXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGdhcDogMTBweDtcclxuICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMjE1LCAxNjksIDQwLCAwLjIpO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4xOHMgZWFzZSwgdHJhbnNmb3JtIDAuMThzIGVhc2UsIGJveC1zaGFkb3cgMC4xOHMgZWFzZTtcclxuXHJcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICBiYWNrZ3JvdW5kOiBsaWdodGVuKCRnb2xkLCA2JSk7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDIxNSwgMTY5LCA0MCwgMC4yNCk7XHJcblxyXG4gICAgLnN0YXJ0LWJ0bl9fYXJyb3cge1xyXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoNHB4KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICY6ZGlzYWJsZWQge1xyXG4gICAgb3BhY2l0eTogMC40NTtcclxuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgfVxyXG59XHJcblxyXG4uc3RhcnQtYnRuX19hcnJvdyB7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMThzIGVhc2U7XHJcbn1cclxuXHJcbi5zci1vbmx5IHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgd2lkdGg6IDFweDtcclxuICBoZWlnaHQ6IDFweDtcclxuICBvcGFjaXR5OiAwO1xyXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogOTUwcHgpIHtcclxuICAuZ20tYm9keSB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICB9XHJcblxyXG4gIC50b3BvbG9neS1ncmlkIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTtcclxuICB9XHJcblxyXG4gIC5kaWZmLXRpbGVzIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA2MjBweCkge1xyXG4gIC5nYW1lLW1lbnUge1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICB9XHJcblxyXG4gIC5nbS1oZWFkZXIge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICB9XHJcblxyXG4gIC5nbS1oZWFkZXJfX2JhY2ssXHJcbiAgLmdtLWhlYWRlcl9fcnVsZXMge1xyXG4gICAgd2lkdGg6IDQ2cHg7XHJcbiAgICBoZWlnaHQ6IDQ2cHg7XHJcbiAgfVxyXG5cclxuICAuZ20taGVhZGVyX19iYWNrIGltZyB7XHJcbiAgICB3aWR0aDogMjJweDtcclxuICAgIGhlaWdodDogMjJweDtcclxuICB9XHJcblxyXG4gIC5nbS1oZWFkZXJfX3RpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS4zNXJlbSwgNnZ3LCAxLjlyZW0pO1xyXG4gIH1cclxuXHJcbiAgLmdtLWJvZHkge1xyXG4gICAgZ2FwOiAxMnB4O1xyXG4gIH1cclxuXHJcbiAgLnNlY3Rpb24tY2FyZCB7XHJcbiAgICBwYWRkaW5nOiAxNHB4O1xyXG4gIH1cclxuXHJcbiAgLnNlY3Rpb24tY2FyZC0tcm93IHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gIH1cclxuXHJcbiAgLm1pbmktc2VjdGlvbi1kaXZpZGVyIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAudG9wb2xvZ3ktZ3JpZCxcclxuICAub3B0aW9uLXRpbGVzLFxyXG4gIC5jYW1wLXRpbGVzLFxyXG4gIC5kaWZmLXRpbGVzIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gIH1cclxuXHJcbiAgLnRvcG8tdGlsZSxcclxuICAub3B0aW9uLXRpbGUsXHJcbiAgLmNhbXAtdGlsZSxcclxuICAuZGlmZi10aWxlIHtcclxuICAgIG1pbi1oZWlnaHQ6IDc0cHg7XHJcbiAgICBwYWRkaW5nOiA4cHg7XHJcbiAgfVxyXG59Il19 */"] });


/***/ }),

/***/ "Z8kk":
/*!*******************************************************!*\
  !*** ./src/app/components/credit/credit.component.ts ***!
  \*******************************************************/
/*! exports provided: CreditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreditComponent", function() { return CreditComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class CreditComponent {
    constructor() { }
    ngOnInit() {
    }
}
CreditComponent.ɵfac = function CreditComponent_Factory(t) { return new (t || CreditComponent)(); };
CreditComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CreditComponent, selectors: [["app-credit"]], decls: 64, vars: 0, consts: [[1, "credits-page"], [1, "header", "card"], ["routerLink", "/game-mode-selection", "aria-label", "Retour", 1, "back-button"], ["src", "assets/arrow.svg", "alt", ""], [1, "subtitle"], [1, "credit-grid"], [1, "credit-card", "card"], ["href", "https://www.flaticon.com/fr/", "target", "_blank", "rel", "noopener"], [1, "link-list"], ["href", "https://www.flaticon.com/fr/icone-gratuite/robotique_862537?related_item_id=862537&term=robot", "target", "_blank", "rel", "noopener"], ["href", "https://www.flaticon.com/fr/auteurs/freepik", "target", "_blank", "rel", "noopener"], ["href", "https://creativemarket.com/eucalyp", "target", "_blank", "rel", "noopener"], ["href", "https://www.flaticon.com/authors/dave-gandy", "target", "_blank", "rel", "noopener"], ["href", "https://www.flaticon.com/fr/auteurs/smartline", "target", "_blank", "rel", "noopener"], ["href", "https://www.flaticon.com/authors/kirill-kazachek", "target", "_blank", "rel", "noopener"], ["href", "https://www.flaticon.com/authors/pixel-perfect", "target", "_blank", "rel", "noopener"], [1, "dev-list"]], template: function CreditComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "\u00C0 propos");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Cr\u00E9dits");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "section", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Ressources graphiques");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Cette application utilise des ic\u00F4nes et images trouv\u00E9es sur ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Flaticon ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, ". ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Les images ont \u00E9t\u00E9 con\u00E7ues par les artistes suivants :");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "ul", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Good Ware");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Freepik");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Eucalyp");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Dave Gandy");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Smartline");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Kirill Kazachek");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "a", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "Pixel Perfect");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "section", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "\u00C9quipe de d\u00E9veloppement");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, "L\u2019application a \u00E9t\u00E9 d\u00E9velopp\u00E9e et supervis\u00E9e par :");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "ul", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Asmaa BEL HADJ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "Anthony CHOQUARD");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Romain GIUNTINI");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Fr\u00E9d\u00E9ric HAVET");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Gr\u00E9gory HOAREAU");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Dorian MAZAURIC");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "Nicolas NISSE");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Michel SYSKA");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLink"]], styles: ["body {\n  background: #f7f3ed;\n}\n\n.credits-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 56px 24px 80px;\n  background: #f7f3ed;\n  color: #1a1612;\n  font-family: \"Lora\", Georgia, serif;\n}\n\n.card[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid rgba(26, 22, 18, 0.25);\n  border-radius: 12px;\n  box-shadow: 0 2px 4px rgba(26, 22, 18, 0.06), 0 8px 32px rgba(26, 22, 18, 0.08);\n}\n\n.header[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto 32px;\n  padding: 28px 36px;\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  animation: fadeUp 0.6s ease both;\n}\n\n.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(2rem, 4vw, 3rem);\n  font-weight: 600;\n  color: #1a1612;\n  line-height: 1.15;\n}\n\n.subtitle[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-family: \"DM Mono\", \"Courier New\", monospace;\n  font-size: 0.72rem;\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n  color: #8c8278;\n}\n\n.back-button[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border: 1.5px solid rgba(26, 22, 18, 0.25);\n  border-radius: 6px;\n  background: #f7f3ed;\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: background 0.18s, border-color 0.18s, transform 0.15s;\n}\n\n.back-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 24px;\n  filter: brightness(0) saturate(100%);\n}\n\n.back-button[_ngcontent-%COMP%]:hover {\n  background: #fdf0ec;\n  border-color: #c0392b;\n  transform: translateX(-3px);\n}\n\n.credit-grid[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1.25fr 1fr;\n  gap: 24px;\n}\n\n.credit-card[_ngcontent-%COMP%] {\n  padding: 32px 36px;\n  animation: fadeUp 0.6s 0.1s ease both;\n}\n\n.credit-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 18px;\n  font-size: 1.45rem;\n  font-weight: 600;\n  color: #1a1612;\n}\n\n.credit-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 14px;\n  color: #4a443c;\n  line-height: 1.65;\n  font-style: italic;\n}\n\n.credit-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #c0392b;\n  font-weight: 600;\n  text-decoration: none;\n  border-bottom: 1px solid rgba(192, 57, 43, 0.35);\n}\n\n.credit-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  border-bottom-color: #c0392b;\n}\n\n.link-list[_ngcontent-%COMP%], .dev-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 22px 0 0;\n  display: grid;\n  gap: 10px;\n}\n\n.link-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], .dev-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 11px 14px;\n  background: #f7f3ed;\n  border: 1px solid rgba(26, 22, 18, 0.12);\n  border-radius: 6px;\n  color: #4a443c;\n  line-height: 1.4;\n  transition: background 0.18s, border-color 0.18s;\n}\n\n.link-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover, .dev-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background: #ede7dc;\n  border-color: rgba(26, 22, 18, 0.25);\n}\n\n.dev-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #1a1612;\n}\n\n@keyframes fadeUp {\n  from {\n    opacity: 0;\n    transform: translateY(16px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@media (max-width: 850px) {\n  .credits-page[_ngcontent-%COMP%] {\n    padding: 32px 16px 56px;\n  }\n\n  .header[_ngcontent-%COMP%] {\n    padding: 24px;\n  }\n\n  .credit-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .credit-card[_ngcontent-%COMP%] {\n    padding: 28px 24px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxjcmVkaXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYUE7RUFDRSxtQkFkWTtBQUVkOztBQWVBO0VBQ0UsaUJBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQXBCWTtFQXFCWixjQW5CWTtFQW9CWixtQ0FiWTtBQUNkOztBQWVBO0VBQ0UsaUJBQUE7RUFDQSx3Q0FBQTtFQUNBLG1CQUFBO0VBQ0EsK0VBbEJZO0FBTWQ7O0FBZUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsZ0NBQUE7QUFaRjs7QUFjRTtFQUNFLFNBQUE7RUFDQSxpQ0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0EzQ1U7RUE0Q1YsaUJBQUE7QUFaSjs7QUFnQkE7RUFDRSxnQkFBQTtFQUNBLGdEQTFDWTtFQTJDWixrQkFBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQXBEWTtBQXVDZDs7QUFnQkE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFoRVk7RUFpRVosZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGlFQUFBO0FBYkY7O0FBZUU7RUFDRSxXQUFBO0VBQ0Esb0NBQUE7QUFiSjs7QUFnQkU7RUFDRSxtQkF0RVU7RUF1RVYscUJBeEVVO0VBeUVWLDJCQUFBO0FBZEo7O0FBa0JBO0VBQ0UsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtFQUNBLGlDQUFBO0VBQ0EsU0FBQTtBQWZGOztBQWtCQTtFQUNFLGtCQUFBO0VBQ0EscUNBQUE7QUFmRjs7QUFpQkU7RUFDRSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQWhHVTtBQWlGZDs7QUFrQkU7RUFDRSxnQkFBQTtFQUNBLGNBcEdVO0VBcUdWLGlCQUFBO0VBQ0Esa0JBQUE7QUFoQko7O0FBbUJFO0VBQ0UsY0F4R1U7RUF5R1YsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGdEQUFBO0FBakJKOztBQW1CSTtFQUNFLDRCQTlHUTtBQTZGZDs7QUFzQkE7O0VBRUUsZ0JBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsU0FBQTtBQW5CRjs7QUFxQkU7O0VBQ0Usa0JBQUE7RUFDQSxtQkFsSVU7RUFtSVYsd0NBQUE7RUFDQSxrQkFBQTtFQUNBLGNBbElVO0VBbUlWLGdCQUFBO0VBQ0EsZ0RBQUE7QUFsQko7O0FBcUJFOztFQUNFLG1CQTFJVTtFQTJJVixvQ0FwSVU7QUFrSGQ7O0FBc0JBO0VBQ0UsZ0JBQUE7RUFDQSxjQWhKWTtBQTZIZDs7QUFzQkE7RUFDRTtJQUFPLFVBQUE7SUFBWSwyQkFBQTtFQWpCbkI7RUFrQkE7SUFBTyxVQUFBO0lBQVksd0JBQUE7RUFkbkI7QUFDRjs7QUFnQkE7RUFDRTtJQUNFLHVCQUFBO0VBZEY7O0VBaUJBO0lBQ0UsYUFBQTtFQWRGOztFQWlCQTtJQUNFLDBCQUFBO0VBZEY7O0VBaUJBO0lBQ0Usa0JBQUE7RUFkRjtBQUNGIiwiZmlsZSI6ImNyZWRpdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIiRjcmVhbTogICAgICAgI2Y3ZjNlZDtcclxuJGNyZWFtLWRhcms6ICAjZWRlN2RjO1xyXG4kaW5rOiAgICAgICAgICMxYTE2MTI7XHJcbiRpbmstbWlkOiAgICAgIzRhNDQzYztcclxuJGluay1saWdodDogICAjOGM4Mjc4O1xyXG4kYWNjZW50OiAgICAgICNjMDM5MmI7XHJcbiRhY2NlbnQtYmc6ICAgI2ZkZjBlYztcclxuJGJvcmRlcjogICAgICByZ2JhKDI2LCAyMiwgMTgsIDAuMTIpO1xyXG4kYm9yZGVyLWRhcms6IHJnYmEoMjYsIDIyLCAxOCwgMC4yNSk7XHJcbiRmb250LXNlcmlmOiAgJ0xvcmEnLCBHZW9yZ2lhLCBzZXJpZjtcclxuJGZvbnQtbW9ubzogICAnRE0gTW9ubycsICdDb3VyaWVyIE5ldycsIG1vbm9zcGFjZTtcclxuJHNoYWRvdy1jYXJkOiAwIDJweCA0cHggcmdiYSgyNiwyMiwxOCwwLjA2KSwgMCA4cHggMzJweCByZ2JhKDI2LDIyLDE4LDAuMDgpO1xyXG5cclxuOjpuZy1kZWVwIGJvZHkge1xyXG4gIGJhY2tncm91bmQ6ICRjcmVhbTtcclxufVxyXG5cclxuLmNyZWRpdHMtcGFnZSB7XHJcbiAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgcGFkZGluZzogNTZweCAyNHB4IDgwcHg7XHJcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xyXG4gIGNvbG9yOiAkaW5rO1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1zZXJpZjtcclxufVxyXG5cclxuLmNhcmQge1xyXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXItZGFyaztcclxuICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gIGJveC1zaGFkb3c6ICRzaGFkb3ctY2FyZDtcclxufVxyXG5cclxuLmhlYWRlciB7XHJcbiAgbWF4LXdpZHRoOiA5MDBweDtcclxuICBtYXJnaW46IDAgYXV0byAzMnB4O1xyXG4gIHBhZGRpbmc6IDI4cHggMzZweDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAyMnB4O1xyXG4gIGFuaW1hdGlvbjogZmFkZVVwIDAuNnMgZWFzZSBib3RoO1xyXG5cclxuICBoMSB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250LXNpemU6IGNsYW1wKDJyZW0sIDR2dywgM3JlbSk7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgY29sb3I6ICRpbms7XHJcbiAgICBsaW5lLWhlaWdodDogMS4xNTtcclxuICB9XHJcbn1cclxuXHJcbi5zdWJ0aXRsZSB7XHJcbiAgbWFyZ2luOiAwIDAgMTBweDtcclxuICBmb250LWZhbWlseTogJGZvbnQtbW9ubztcclxuICBmb250LXNpemU6IDAuNzJyZW07XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIGNvbG9yOiAkaW5rLWxpZ2h0O1xyXG59XHJcblxyXG4uYmFjay1idXR0b24ge1xyXG4gIHdpZHRoOiA0OHB4O1xyXG4gIGhlaWdodDogNDhweDtcclxuICBib3JkZXI6IDEuNXB4IHNvbGlkICRib3JkZXItZGFyaztcclxuICBib3JkZXItcmFkaXVzOiA2cHg7XHJcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjE4cywgYm9yZGVyLWNvbG9yIDAuMThzLCB0cmFuc2Zvcm0gMC4xNXM7XHJcblxyXG4gIGltZyB7XHJcbiAgICB3aWR0aDogMjRweDtcclxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygwKSBzYXR1cmF0ZSgxMDAlKTtcclxuICB9XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZDogJGFjY2VudC1iZztcclxuICAgIGJvcmRlci1jb2xvcjogJGFjY2VudDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtM3B4KTtcclxuICB9XHJcbn1cclxuXHJcbi5jcmVkaXQtZ3JpZCB7XHJcbiAgbWF4LXdpZHRoOiA5MDBweDtcclxuICBtYXJnaW46IDAgYXV0bztcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMS4yNWZyIDFmcjtcclxuICBnYXA6IDI0cHg7XHJcbn1cclxuXHJcbi5jcmVkaXQtY2FyZCB7XHJcbiAgcGFkZGluZzogMzJweCAzNnB4O1xyXG4gIGFuaW1hdGlvbjogZmFkZVVwIDAuNnMgMC4xcyBlYXNlIGJvdGg7XHJcblxyXG4gIGgyIHtcclxuICAgIG1hcmdpbjogMCAwIDE4cHg7XHJcbiAgICBmb250LXNpemU6IDEuNDVyZW07XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgY29sb3I6ICRpbms7XHJcbiAgfVxyXG5cclxuICBwIHtcclxuICAgIG1hcmdpbjogMCAwIDE0cHg7XHJcbiAgICBjb2xvcjogJGluay1taWQ7XHJcbiAgICBsaW5lLWhlaWdodDogMS42NTtcclxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICB9XHJcblxyXG4gIGEge1xyXG4gICAgY29sb3I6ICRhY2NlbnQ7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoJGFjY2VudCwgMC4zNSk7XHJcblxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICRhY2NlbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4ubGluay1saXN0LFxyXG4uZGV2LWxpc3Qge1xyXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XHJcbiAgcGFkZGluZzogMDtcclxuICBtYXJnaW46IDIycHggMCAwO1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ2FwOiAxMHB4O1xyXG5cclxuICBsaSB7XHJcbiAgICBwYWRkaW5nOiAxMXB4IDE0cHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAkY3JlYW07XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNnB4O1xyXG4gICAgY29sb3I6ICRpbmstbWlkO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEuNDtcclxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4xOHMsIGJvcmRlci1jb2xvciAwLjE4cztcclxuICB9XHJcblxyXG4gIGxpOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6ICRjcmVhbS1kYXJrO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAkYm9yZGVyLWRhcms7XHJcbiAgfVxyXG59XHJcblxyXG4uZGV2LWxpc3QgbGkge1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgY29sb3I6ICRpbms7XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgZmFkZVVwIHtcclxuICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE2cHgpOyB9XHJcbiAgdG8gICB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogODUwcHgpIHtcclxuICAuY3JlZGl0cy1wYWdlIHtcclxuICAgIHBhZGRpbmc6IDMycHggMTZweCA1NnB4O1xyXG4gIH1cclxuXHJcbiAgLmhlYWRlciB7XHJcbiAgICBwYWRkaW5nOiAyNHB4O1xyXG4gIH1cclxuXHJcbiAgLmNyZWRpdC1ncmlkIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gIH1cclxuXHJcbiAgLmNyZWRpdC1jYXJkIHtcclxuICAgIHBhZGRpbmc6IDI4cHggMjRweDtcclxuICB9XHJcbn0iXX0= */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _services_graph_graph_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_services/graph/graph.service */ "daKe");
/* harmony import */ var _services_game_game_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_services/game/game.service */ "eiSD");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _components_game_menu_game_menu_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/game-menu/game-menu.component */ "Z22J");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _services_random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_services/random-graph/random-graph.service */ "0HIH");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _components_game_board_game_board_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/game-board/game-board.component */ "PDYC");
/* harmony import */ var _services_translate_translate_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./_services/translate/translate.service */ "/74g");
/* harmony import */ var _services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./_services/statistic/statistic.service */ "cDp4");
/* harmony import */ var _components_game_dashboard_game_dashboard_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/game-dashboard/game-dashboard.component */ "rCzw");
/* harmony import */ var _services_graph_file_validator_graph_file_validator_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./_services/graph-file-validator/graph-file-validator.service */ "XxV+");
/* harmony import */ var _components_graph_constructor_graph_constructor_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/graph-constructor/graph-constructor.component */ "Nf+H");
/* harmony import */ var _components_tooltip_tooltip_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/tooltip/tooltip.component */ "rdml");
/* harmony import */ var _components_cops_and_robber_game_mode_selection_cops_and_robber_game_mode_selection_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/cops-and-robber-game-mode-selection/cops-and-robber-game-mode-selection.component */ "LRql");
/* harmony import */ var _components_adventure_menu_adventure_menu_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/adventure-menu/adventure-menu.component */ "7zdo");
/* harmony import */ var _components_credit_credit_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/credit/credit.component */ "Z8kk");
/* harmony import */ var _components_rules_rules_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/rules/rules.component */ "Fj4N");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/core */ "fXoL");






















class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineInjector"]({ providers: [
        _services_graph_graph_service__WEBPACK_IMPORTED_MODULE_3__["GraphService"],
        _services_game_game_service__WEBPACK_IMPORTED_MODULE_4__["GameService"],
        _services_random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_8__["RandomGraphService"],
        _services_translate_translate_service__WEBPACK_IMPORTED_MODULE_11__["TranslateService"],
        _services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_12__["StatisticService"],
        _services_graph_file_validator_graph_file_validator_service__WEBPACK_IMPORTED_MODULE_14__["GraphFileValidatorService"]
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
        _components_game_menu_game_menu_component__WEBPACK_IMPORTED_MODULE_6__["GameMenuComponent"],
        _components_game_board_game_board_component__WEBPACK_IMPORTED_MODULE_10__["GameBoardComponent"],
        _components_game_dashboard_game_dashboard_component__WEBPACK_IMPORTED_MODULE_13__["GameDashboardComponent"],
        _components_graph_constructor_graph_constructor_component__WEBPACK_IMPORTED_MODULE_15__["GraphConstructorComponent"],
        _components_tooltip_tooltip_component__WEBPACK_IMPORTED_MODULE_16__["TooltipComponent"],
        _components_cops_and_robber_game_mode_selection_cops_and_robber_game_mode_selection_component__WEBPACK_IMPORTED_MODULE_17__["CopsAndRobberGameModeSelectionComponent"],
        _components_adventure_menu_adventure_menu_component__WEBPACK_IMPORTED_MODULE_18__["AdventureMenuComponent"],
        _components_credit_credit_component__WEBPACK_IMPORTED_MODULE_19__["CreditComponent"],
        _components_rules_rules_component__WEBPACK_IMPORTED_MODULE_20__["RulesComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"]] }); })();


/***/ }),

/***/ "aMqS":
/*!****************************************!*\
  !*** ./src/app/mediation/mediation.ts ***!
  \****************************************/
/*! exports provided: mediation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mediation", function() { return mediation; });
const mediation = {
    'grid-strat': {
        step1: {
            text: "Si on a un nombre de gendarme égal à une largeur de la grille, on peut alors former un mur qui va contraindre le voleur à se retrouver coincé sur un bord de la grille.<br><br>Cependant, il est possible d'optimiser la stratégie.",
            img: 'assets/mediation/world3/classic_beat.gif'
        },
        step2: {
            text: "Si on a un nombre de gendarme égal à la moitié de la largeur de la grille, on peut tout de même appliquer une stratégie similaire à la stratégie précédente afin de gagner. En effet, même si le mur formé (supposons vertical) par les gendarmes est \"troué\", le voleur va quand même devoir reculer jusqu'au bord de la grille. Et si ce dernier essaie de passer dans un des trous du mur, alors un des gendarmes peut monter ou descendre afin de l'arrêter.<br><br>Même si cette stratégie est plus optimisée que la précédente, elle reste encore très loin d'être optimale notamment pour les très grandes grille.",
            img: 'assets/mediation/world3/upgrade_beat.gif'
        },
        step3: {
            text: "Sur une grille, avec 4 gendarmes, on peut finir par attraper le voleur. En effet, à chaque tour le voleur peut se déplacer sur, au plus, 4 sommets (en plus de celui sur lequel il est), un au dessus, un en dessous, un à gauche et un à droite. Les 4 gendarmes peuvent donc se spécialiser : l'un d'eux a pour but de se retrouver sur la case juste au dessus du voleur, un autre sur la case juste en dessous, etc ….<br>Pour se faire, le gendarme qui veut se retrouver sur la case juste au dessus du voleur, va d’abord chercher à se mettre au dessus du voleur dans la même colonne, puis à s’en rapprocher tant que le voleur ne change pas de colonne. Les autres gendarmes appliquent des stratégies similaires en fonction de la case visée.",
            img: 'assets/mediation/world3/blocking.gif'
        },
        step4: {
            text: "On peut sur une grille, et ce quel que soit sa taille, gagner avec seulement 2 gendarmes. En effet, il suffit pour cela que l'un des gendarmes contrôle la ligne sur laquelle se trouve le voleur tandis que l'autre gendarme contrôle la colonne sur laquelle se trouve le voleur. Pour \"contrôler\" la ligne (respectivement la colonne) du voleur, il faut que le gendarme commence par rejoindre la ligne (respectivement la colonne) sur laquelle est le voleur, puis s'il est déjà sur cette dernière alors il se rapproche du voleur.",
            img: 'assets/mediation/world3/control.gif'
        },
        step5: {
            text: "Sur un grille avec un gendarme, si le voleur se place pas initialement à une distance de plus de 1 du gendarme. Alors, il suffira au voleur de toujours chercher à se placer sur une colonne ou une ligne qui n'est pas contrôler par le gendarme",
            img: 'assets/mediation/world3/1cop.gif'
        },
        step6: {
            text: "To do",
            img: undefined
        },
    },
    'intro': {
        step1: {
            text: "Sur un chemin, en plaçant un gendarme sur une extrémité du chemin et en avançant en direction du voleur, alors le voleur finira par atteindre l'autre extrémité du chemin et finira pas se faire arrêter.",
            img: 'assets/mediation/world1/path.gif'
        },
        step2: {
            text: "Sur un cycle avec 1 seul gendarme, le voleur peut fuir éternellement. En effet, il suffit au voleur de se placer et se déplacer systématiquement sur le sommet diamétralement opposé au gendarme.",
            img: 'assets/mediation/world1/cycle1cop.gif'
        },
        step3: {
            text: 'Sur un graphe "chenille"*, la stratégie est très similaire à celle utilisée sur les chemins. Il faut donc placer le gendarme sur une extrémité du chemin et le faire avancer sur le chemin en direction du voleur. La différence avec la stratégie du chemin est que le voleur ne finira pas, forcément, sur l\'autre extrémité du chemin, il est aussi possible qu\'il finisse sur une "patte de la chenille".<br><br>*un graphe "chenille" est un graphe qui est composé d\'un chemin et d\'autres sommets qui lui sont adjacents.',
            img: 'assets/mediation/world1/caterpillar.gif'
        },
        step4: {
            text: "En plaçant un gendarme sur un arbre, on sépare l'arbre en plusieurs sous-graphes disjoints (qui n'ont pas d'arrêtes qui les lient) sans cycle. Une fois le voleur placé, il se trouvera forcément sur l'un de ces sous-arbres.<br>En se déplaçant vers le voleur, 2 cas sont possibles :<br>\t- <strong>le gendarme se déplace sur un sommet de degré 2 :</strong> dans ce cas cela reduit la taille du sous-arbre dans lequel se trouve le voleur.<br>\t- <strong>Le gendarme se déplace sur un sommet avec un degré plus que 2 :</strong> dans ce cas, le gendarme divise à nouveau le sous-graphe dans lequel se trouve le voleur en plusieurs nouveau sous-arbre.<br>En répétant ce processus, le voleur finira sur une des feuilles de l'arbre (sommet de l'arbre de degré 1).",
            img: 'assets/mediation/world1/tree.gif'
        },
        step5: {
            text: "Sur un cycle, avec 2 gendarmes, on peut encadrer le voleur. En effet, après avoir positionné les gendarmes, si l'on se rapproche du voleur avec un gendarme par un côté et de l'autre côté avec le second gendarme, le voleur finira par être encadré par des gendarmes et n'avoir plus aucun mouvement de disponible.",
            img: 'assets/mediation/world1/cycle2cops.gif'
        }
    },
    'dominant': {
        step1: {
            text: "Dans un graphe, on peut déterminer un <strong>ensemble dominant*</strong>. Si on a un nombre de gendarme égal au nombre de sommets dans l'ensemble dominant, il nous suffit alors de placer les gendarmes sur les différents sommets de l'ensemble afin qu'au tour suivant, qu'importe où se trouve le voleur, il sera capturer par un des gendarmes.<br><br><strong>*</strong> Ensemble de sommets tel que n'importe quel autre sommet du graphe est voisin d'au moins un des sommets de l'ensemble.",
            img: 'assets/mediation/world2/dominant2.gif'
        },
        step2: {
            text: "Ce graphe s’appelle le graphe de Petersen. Dans ce graphe, quelles que soient les positions initiales des gendarmes, il existe au moins un sommet qui n'est pas adjacent à chacun des policiers où le voleur peut se placer. Au cours du jeu, quelles que soient les positions des gendarmes, si le voleur est voisin d’au moins un gendarme, il existe toujours un de ses voisins qui est à distance 2 des deux gendarmes. Le voleur peut donc s’échapper indéfiniment.",
            img: 'assets/mediation/world2/petersen2cops.gif'
        },
        step3: {
            text: "Ce graphe possède une ensemble dominant de taille 3, avec ce qu'on a vu au premier niveau de ce monde on peut donc en conclure que 3 gendarmes sont suffisants pour assurer la victoire aux gendarmes. De plus, avec ce qu'on a vu au niveau précédent il faut au moins 3 gendarmes pour que les gendarmes puissent gagner.",
            img: 'assets/mediation/world2/petersen3cops.gif'
        },
        step4: {
            text: "Dans ce graphe, il y a un ensemble dominant de taille 3.",
            img: 'assets/mediation/world2/hidden_dominant_3.gif'
        },
        step5: {
            text: "Dans ce graphe, il y a un ensemble dominant de taille 3.",
            img: undefined
        }
    },
    'separator': {
        step1: {
            text: "En plaçant le gendarme et prenant en compte ses sommets adjacents, on divise le graphe en plusieurs sous-graphes. Si le voleur ne veut pas se faire attraper au tour suivant, il devra se placer dans l'un de ces sous-graphes.<br>En rapprochant le gendarme du voleur, la taille du sous-graphe dans lequel se trouve le voleur va diminuer et, parfois, être à nouveau diviser en sous-graphe.<br>En répétant le processus le voleur finira sur un sommet au bord du graph.",
            img: undefined
        },
        step2: {
            text: "Les sous-graphes, séparés par le gendarme et les sommets qu'il contrôle, sont séparés par au plus 2 sommets, sous le contrôle du gendarme. Ainsi grâce à sa vitesse de 3, le voleur peut passé d'un sous-graphe à un autre, lui permettant ainsi de ne pas être bloquer dans un sous-graphe.",
            img: undefined
        },
        step3: {
            text: "Dans ce type de graphe, si l'on place 2 gendarmes sur des sommets adjacents (qui ne sont pas sur le même bord du graphe), on sépare alors le graphe en deux sous-graphes grâce aux gendarmes qui forme un mur au travers duquel le voleur ne peut pas passer. En déplaçant ce mur vers le voleur, on va le pousser jusqu'à une extrémité du grâce où le voleur ne pourra plus se déplacer.",
            img: undefined
        },
        step4: {
            text: "Ce graphe est formé à partir d'un 2-arbre auquel on a retiré certaines arêtes. En ayant retirer des arêtes, on a créer des cycles au sein du graphe. Ainsi si le voleur se place sur (ou atteint) l'un de ces cycles, alors pourra tourner autour de ce cycle éternellement sans que le policier ne puissent l'attraper.",
            img: undefined
        },
        step5: {
            text: "To do",
            img: undefined
        }
    }
};


/***/ }),

/***/ "cDp4":
/*!**********************************************************!*\
  !*** ./src/app/_services/statistic/statistic.service.ts ***!
  \**********************************************************/
/*! exports provided: StatisticService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatisticService", function() { return StatisticService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class StatisticService {
    constructor() {
        this.statistics = [];
    }
    getStatistics() {
        return Promise.resolve(this.statistics);
    }
    postStatistic(stat) {
        this.statistics.push(stat);
    }
}
StatisticService.ɵfac = function StatisticService_Factory(t) { return new (t || StatisticService)(); };
StatisticService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: StatisticService, factory: StatisticService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "cXIX":
/*!********************************************************************!*\
  !*** ./src/app/models/Adventure/AdventureLevel/adventure-level.ts ***!
  \********************************************************************/
/*! exports provided: AdventureLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdventureLevel", function() { return AdventureLevel; });
class AdventureLevel {
    constructor(graphType, graphParams, copsNumber, speed, aiSide, difficulty) {
        this.graphType = graphType;
        this.graphParams = graphParams;
        this.copsNumber = copsNumber;
        this.thiefSpeed = speed;
        this.aiSide = aiSide;
        this.difficulty = difficulty;
    }
    getGraphType() { return this.graphType; }
    getGraphParams() { return this.graphParams; }
    getCopsNumber() { return this.copsNumber; }
    getThiefSpeed() { return this.thiefSpeed; }
    getAiSide() { return this.aiSide; }
    getDifficulty() { return this.difficulty; }
    getPlayerRoleName() {
        if (this.aiSide === 'thief') {
            return 'des Gendarmes';
        }
        else {
            return 'du Voleur';
        }
    }
}


/***/ }),

/***/ "daKe":
/*!**************************************************!*\
  !*** ./src/app/_services/graph/graph.service.ts ***!
  \**************************************************/
/*! exports provided: GraphService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphService", function() { return GraphService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var src_app_models_Graph_Common_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/models/Graph/Common/common */ "2X9m");
/* harmony import */ var src_app_models_Graph_Cycle_cycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/models/Graph/Cycle/cycle */ "ejVu");
/* harmony import */ var src_app_models_Graph_Grid_grid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/models/Graph/Grid/grid */ "MXcO");
/* harmony import */ var src_app_models_Graph_Grid_Tore_tore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/models/Graph/Grid/Tore/tore */ "O2ao");
/* harmony import */ var src_app_models_Graph_specific_specific__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/models/Graph/specific/specific */ "L1MR");
/* harmony import */ var src_app_models_Graph_Tree_tree__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/models/Graph/Tree/tree */ "RYiN");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../random-graph/random-graph.service */ "0HIH");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "tyNb");











class GraphService {
    constructor(randomGraph, router) {
        this.randomGraph = randomGraph;
        this.router = router;
        this.thiefSpeed = 1;
        this.cops_position_slot = [];
        if (localStorage.getItem("method") !== null) {
            switch (localStorage.getItem("method")) {
                case "generate":
                    if (localStorage.getItem("type") !== null && localStorage.getItem("args") !== null) {
                        const type = localStorage.getItem("type");
                        const args = JSON.parse(localStorage.getItem("args"));
                        if (router.url.includes('board')) {
                            this.generateGraph(type, args);
                        }
                    }
                    break;
                case "import":
                    if (localStorage.getItem("config") !== null) {
                        const config = JSON.parse(localStorage.getItem("config"));
                        this.importGraph(config);
                    }
                    break;
            }
        }
        else {
            this.graph = null;
        }
    }
    updateCopsPositions(positions) {
        this.cops_position_slot = positions;
    }
    setThiefSpeed(speed) {
        this.thiefSpeed = speed;
    }
    drawGraph(svg) {
        this.graph.draw(svg);
    }
    stop() {
        this.graph.stop();
    }
    movingPermission(permission) {
        this.graph.setAllowedToMove(permission);
    }
    moveNode(node, endPosition) {
        this.graph.moveNode(node, endPosition);
    }
    generateGraph(type, args) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            localStorage.setItem("method", "generate");
            localStorage.setItem("type", type);
            localStorage.setItem("args", JSON.stringify(args));
            this.graph = null;
            switch (type) {
                case 'grid':
                    this.graph = this.generateGrid(args[0], args[1]);
                    break;
                case 'tore':
                    this.graph = this.generateTore(args[0], args[1]);
                    break;
                case 'cycle':
                    this.graph = this.generateCycle(args[0]);
                    break;
                case 'tree':
                    this.graph = this.generateTree(args[0], args[1]);
                    break;
                case 'random':
                    this.graph = this.generateRandom();
                    break;
                case 'copsAlwaysWin':
                    this.graph = this.oneCopsGraph(args[0]);
                    break;
                case 'petersen':
                case 'dodecahedron':
                default:
                    yield this.generateFromFile(type);
                    break;
            }
        });
    }
    getGraph() {
        return this.graph;
    }
    generatesNodes(n) {
        let nodes = [];
        for (let i = 0; i < n; ++i) {
            nodes.push({
                index: i,
            });
        }
        return nodes;
    }
    generateGrid(width, height) {
        const size = width * height;
        let nodes = this.generatesNodes(size);
        let links = [];
        for (let i = 0; i < height * width; i += width) {
            for (let j = 0; j < width - 1; ++j) {
                links.push({
                    source: i + j,
                    target: (i + j) + 1
                });
            }
        }
        for (let i = 0; i < (height - 1) * width; ++i) {
            links.push({
                source: i,
                target: i + width
            });
        }
        return new src_app_models_Graph_Grid_grid__WEBPACK_IMPORTED_MODULE_4__["Grid"](nodes, links, width, height);
    }
    generateTore(width, height) {
        const size = width * height;
        let nodes = this.generatesNodes(size);
        let links = [];
        for (let i = 0; i < height * width; i += width) {
            for (let j = 0; j < width - 1; ++j) {
                links.push({
                    source: i + j,
                    target: (i + j) + 1
                });
            }
        }
        for (let i = 0; i < (height - 1) * width; ++i) {
            links.push({
                source: i,
                target: i + width
            });
        }
        for (let i = 0; i < width; ++i) {
            links.push({
                source: i,
                target: i + ((width * height) - width)
            });
        }
        for (let i = 0; i < height * width; i += width) {
            links.push({
                source: i,
                target: i + (width - 1)
            });
        }
        return new src_app_models_Graph_Grid_Tore_tore__WEBPACK_IMPORTED_MODULE_5__["Tore"](nodes, links, width, height);
    }
    generateCycle(size) {
        let nodes = this.generatesNodes(size);
        let links = [];
        for (let i = 0; i < size - 1; ++i) {
            links.push({
                source: i,
                target: i + 1
            });
        }
        links.push({
            source: 0,
            target: size - 1
        });
        return new src_app_models_Graph_Cycle_cycle__WEBPACK_IMPORTED_MODULE_3__["Cycle"](nodes, links);
    }
    generateTree(size, arity) {
        let nodes = this.generatesNodes(size);
        let links = [];
        for (let i = 0; i < size; ++i) {
            for (let j = 1; j <= arity && (i * arity) + j < size; ++j) {
                links.push({
                    source: i,
                    target: (i * arity) + j
                });
            }
        }
        return new src_app_models_Graph_Tree_tree__WEBPACK_IMPORTED_MODULE_7__["Tree"](nodes, links);
    }
    generateRandom() {
        let randomGraph = this.randomGraph.getRandomGraph();
        return new src_app_models_Graph_Common_common__WEBPACK_IMPORTED_MODULE_2__["Common"](randomGraph.nodes, randomGraph.links);
    }
    neighbors(index, links = []) {
        const result = [];
        for (let i = 0; i < links.length; i++) {
            if (links[i].source === index) {
                result.push(links[i].target);
            }
            else if (links[i].target === index) {
                result.push(links[i].source);
            }
        }
        return result;
    }
    subset(set = []) {
        const tmp_set = [...set];
        const subset = [];
        const size = this.randomInRange(1, tmp_set.length);
        for (let i = 0; i < size; i++) {
            const index = this.randomInRange(0, tmp_set.length);
            const element = tmp_set.splice(index, 1)[0];
            subset.push(element);
        }
        return subset;
    }
    randomInRange(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    }
    oneCopsGraph(n) {
        let nodes = this.generatesNodes(n);
        let links = [];
        for (let i = n - 2; i >= 0; i--) {
            let index = this.randomInRange(i, n);
            while (index === i) {
                index = this.randomInRange(i, n);
            }
            const neighbors = this.neighbors(index, links);
            const neighbors_subset = this.subset(neighbors);
            for (const neighbor of neighbors_subset) {
                if (neighbor !== i) {
                    links.push({ source: i, target: neighbor });
                }
            }
            links.push({ source: i, target: index });
        }
        return new src_app_models_Graph_Common_common__WEBPACK_IMPORTED_MODULE_2__["Common"](nodes, links, 'copsAlwaysWin');
    }
    generatePetersen() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const blob = yield this.downloadAssets('petersen');
            const file = new File([blob], 'petersen.json');
            yield this.loadGraphFromFile(file);
        });
    }
    generateDodecahedron() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const blob = yield this.downloadAssets('dodecahedron');
            const file = new File([blob], 'dodecahedron.json');
            yield this.loadGraphFromFile(file);
        });
    }
    generateFromFile(filename) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const blob = yield this.downloadAssets(filename);
            const file = new File([blob], `${filename}.json`);
            yield this.loadGraphFromFile(file);
        });
    }
    downloadAssets(name) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const response = yield fetch(`assets/${name}.json`);
            return yield response.blob();
        });
    }
    readAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                let config = JSON.parse(reader.result.toString());
                resolve(config);
            };
            reader.onerror = () => {
                reject(new Error('Unable to read..'));
            };
            reader.readAsText(file);
        });
    }
    loadGraphFromFile(file) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.inputFile = file;
            const config = yield this.readAsync(file);
            this.importGraph(config);
        });
    }
    importGraph(config) {
        this.graph = null;
        localStorage.setItem("method", "import");
        localStorage.setItem("config", JSON.stringify(config));
        switch (config.typology) {
            case 'grid':
                this.graph = new src_app_models_Graph_Grid_grid__WEBPACK_IMPORTED_MODULE_4__["Grid"](config.nodes, config.links, config.width, config.height);
                break;
            case 'cycle':
                this.graph = new src_app_models_Graph_Cycle_cycle__WEBPACK_IMPORTED_MODULE_3__["Cycle"](config.nodes, config.links);
                break;
            case 'tree':
                this.graph = new src_app_models_Graph_Tree_tree__WEBPACK_IMPORTED_MODULE_7__["Tree"](config.nodes, config.links);
                break;
            case 'random':
                this.graph = new src_app_models_Graph_Common_common__WEBPACK_IMPORTED_MODULE_2__["Common"](config.nodes, config.links);
                break;
            case 'specific':
                this.graph = new src_app_models_Graph_specific_specific__WEBPACK_IMPORTED_MODULE_6__["Specific"](config.nodes, config.links);
                break;
        }
    }
    getNodes() {
        return this.graph.nodes;
    }
    getLinks() {
        return this.graph.links;
    }
    getTypology() {
        var _a;
        return (_a = this.graph) === null || _a === void 0 ? void 0 : _a.typology;
    }
    edges(node) {
        return this.graph.edges(node);
    }
    distance(n1, n2) {
        return this.graph.distance(n1, n2);
    }
    setGameMode(gameMode) {
        this.gameMode = gameMode;
    }
    showPossibleMove(vertex, speed) {
        const node = vertex.__data__;
        const edges = this.graph.edges(node, speed, this.cops_position_slot);
        edges.push(node);
        const circles = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](".circle");
        if (!circles.empty()) {
            circles.style("fill", '#69b3a2');
            if (this.gameMode === "easy" || this.gameMode === "medium") {
                circles.filter(function (d) {
                    return edges.includes(d);
                }).style("fill", "#05B800");
                if (vertex.style)
                    vertex.style.fill = "blue";
            }
        }
        return edges;
    }
    showPossibleMoveDragging(vertex, lastPos, speed) {
        const node = vertex.__data__;
        const edges = this.graph.edges(node, speed, this.cops_position_slot);
        edges.push(node);
        const circles = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](".circle");
        if (!circles.empty()) {
            circles.style("fill", '#69b3a2');
            if (this.gameMode === "easy" || this.gameMode === "medium") {
                circles.filter(function (d) {
                    return edges.some(n => n.index === d.index);
                }).style("fill", "orange");
                if (vertex.style)
                    vertex.style.fill = "#05B800";
                if (lastPos && lastPos.style)
                    lastPos.style.fill = "blue";
            }
        }
        return edges;
    }
    showCopsPossibleMoves(cops, show) {
        const edges = this.graph.edges(cops);
        edges.push(cops);
        const circles = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](".circle");
        if (!circles.empty()) {
            if (show) {
                circles.filter(function (d) {
                    return edges.some(n => (n.id !== undefined ? n.id : n.index) === (d.id !== undefined ? d.id : d.index));
                }).style("fill", "red");
            }
            else {
                circles.filter(function (d) {
                    return edges.some(n => (n.id !== undefined ? n.id : n.index) === (d.id !== undefined ? d.id : d.index));
                }).style("fill", '#69b3a2');
            }
        }
        return edges;
    }
    pawnsToForeground() {
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"]('.pawns').raise();
    }
}
GraphService.ɵfac = function GraphService_Factory(t) { return new (t || GraphService)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_random_graph_random_graph_service__WEBPACK_IMPORTED_MODULE_9__["RandomGraphService"]), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"])); };
GraphService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjectable"]({ token: GraphService, factory: GraphService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "eiSD":
/*!************************************************!*\
  !*** ./src/app/_services/game/game.service.ts ***!
  \************************************************/
/*! exports provided: GameService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameService", function() { return GameService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/models/Pawn/PawnState/pawn-states */ "KjiV");
/* harmony import */ var src_app_models_GameActionStack_game_action_stack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/models/GameActionStack/game-action-stack */ "9Now");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_app_models_Strategy_RandomStrategy_random_strategy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/models/Strategy/RandomStrategy/random-strategy */ "x1KM");
/* harmony import */ var src_app_models_Strategy_Cop_TrackingStrategy_tracking_strategy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/models/Strategy/Cop/TrackingStrategy/tracking-strategy */ "/zrl");
/* harmony import */ var src_app_models_Strategy_Thief_RunawayStrategy_runaway_strategy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/models/Strategy/Thief/RunawayStrategy/runaway-strategy */ "lwcH");
/* harmony import */ var src_app_models_Strategy_Cop_WatchingStrategy_watching_strategy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/models/Strategy/Cop/WatchingStrategy/watching-strategy */ "026Y");
/* harmony import */ var src_app_models_Strategy_Cop_GridStrategy_grid_strategy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/models/Strategy/Cop/GridStrategy/grid-strategy */ "81o1");
/* harmony import */ var src_app_models_Strategy_Cop_RandomCopsStrategy_random_cops_strategy__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/models/Strategy/Cop/RandomCopsStrategy/random-cops-strategy */ "jes1");
/* harmony import */ var src_app_models_Strategy_Cop_WatchingStrategyV2_watching_strategy_v2__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/models/Strategy/Cop/WatchingStrategyV2/watching-strategy-v2 */ "mRlQ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _graph_graph_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../graph/graph.service */ "daKe");
/* harmony import */ var _score_score_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../score/score.service */ "0yLw");
















class GameService {
    constructor(router, graphService, scoreService) {
        this.router = router;
        this.graphService = graphService;
        this.scoreService = scoreService;
        this.thiefTurn = false;
        this.watchingPositionList = [];
        this.watchingPositionListStep2 = [];
        this.turnCount = 0;
        this.turnChanged = false;
        this.placingPawns = true;
        this.placingCops = true;
        this.alreadyEnconteredPos = false;
        this.maxTurnCount = 16;
        this.firstMoveDone = false;
        this.isAdventure = false;
        this.copsNumber = 0;
        this.opponentType = null;
        this.thieftSpeed = 1;
        this.HUD_TURN_DETAILS = '#top-hud-turn-information-details';
        this.cops_position = [];
        this.thiefs_position = [];
        this.ai_side = 'cops';
        this.actionStack = new src_app_models_GameActionStack_game_action_stack__WEBPACK_IMPORTED_MODULE_3__["GameActionStack"]();
        if (localStorage.getItem("cops") !== null) {
            this.copsNumber = parseInt(localStorage.getItem("cops")) || 1;
        }
        else {
            this.copsNumber = 1;
        }
        if (localStorage.getItem("ai") !== null) {
            this.ai_side = localStorage.getItem("ai");
        }
    }
    isGameWinByPlayer() {
        return this.winnerSide !== this.ai_side;
    }
    gameHasStarted() {
        return !this.placingPawns;
    }
    setEndLevelCallback(callback) {
        this.endLevelCallback = callback;
    }
    setDisplayWarningZone(callback) {
        this.displayWarningZone = callback;
    }
    setIsAdventure(adventure) {
        this.isAdventure = adventure;
    }
    setAdventure(adventure) {
        this.adventure = adventure;
    }
    setThiefSpeed(speed) {
        this.thieftSpeed = speed;
        this.graphService.setThiefSpeed(speed);
    }
    getThiefSpeed() {
        return this.thieftSpeed;
    }
    setValidateTurnCallback(callback) {
        this.validateTurnCallback = callback;
    }
    copsArePlaced() {
        return this.cops.filter(c => !c.isWaitingPlacement()).length === this.copsNumber;
    }
    setCopsNumber(n) {
        this.copsNumber = n;
        localStorage.setItem("cops", n.toString());
    }
    getCopsNumber() {
        return this.copsNumber;
    }
    setOpponentType(type) {
        this.opponentType = type;
    }
    setAiSide(side) {
        this.ai_side = side;
        localStorage.setItem("ai", side);
    }
    getAiSide() {
        return this.ai_side;
    }
    chooseAIStrat() {
        switch (this.gameMode) {
            case 'medium':
                switch (this.graphService.getGraph().typology) {
                    case 'grid':
                        this.ai_cops_strat = () => {
                            return new src_app_models_Strategy_Cop_GridStrategy_grid_strategy__WEBPACK_IMPORTED_MODULE_9__["GridStrategy"](this.graphService, this);
                        };
                        break;
                    default:
                        this.ai_cops_strat = () => {
                            return new src_app_models_Strategy_Cop_TrackingStrategy_tracking_strategy__WEBPACK_IMPORTED_MODULE_6__["TrackingStrategy"]();
                        };
                }
                this.ai_thief_strat = () => {
                    return new src_app_models_Strategy_Thief_RunawayStrategy_runaway_strategy__WEBPACK_IMPORTED_MODULE_7__["RunawayStrategy"]();
                };
                break;
            case 'extreme':
            case 'hard':
                switch (this.graphService.getGraph().typology) {
                    case 'grid':
                        this.ai_cops_strat = () => {
                            return new src_app_models_Strategy_Cop_WatchingStrategy_watching_strategy__WEBPACK_IMPORTED_MODULE_8__["WatchingStrategy"]();
                        };
                        break;
                    case 'copsAlwaysWin':
                        this.ai_cops_strat = () => {
                            return new src_app_models_Strategy_Cop_WatchingStrategyV2_watching_strategy_v2__WEBPACK_IMPORTED_MODULE_11__["WatchingStrategyV2"]();
                        };
                        break;
                    default:
                        this.ai_cops_strat = () => {
                            return new src_app_models_Strategy_Cop_WatchingStrategyV2_watching_strategy_v2__WEBPACK_IMPORTED_MODULE_11__["WatchingStrategyV2"]();
                        };
                        break;
                }
                this.ai_thief_strat = () => {
                    return new src_app_models_Strategy_Thief_RunawayStrategy_runaway_strategy__WEBPACK_IMPORTED_MODULE_7__["RunawayStrategy"]();
                };
                break;
            case 'easy':
            default:
                this.ai_cops_strat = () => {
                    return new src_app_models_Strategy_Cop_RandomCopsStrategy_random_cops_strategy__WEBPACK_IMPORTED_MODULE_10__["RandomCopsStrategy"]();
                };
                this.ai_thief_strat = () => {
                    return new src_app_models_Strategy_RandomStrategy_random_strategy__WEBPACK_IMPORTED_MODULE_5__["RandomStrategy"]();
                };
                break;
        }
    }
    getAdventurePlayerRole() {
        return this.adventure.getCurrentLevel().getPlayerRoleName();
    }
    setPawns(thiefs, cops) {
        this.chooseAIStrat();
        this.setThief(thiefs);
        this.setCops(cops);
    }
    setThief(thiefs) {
        this.thiefs = thiefs;
        for (const t of this.thiefs) {
            t.setStrategy(this.ai_thief_strat());
        }
    }
    setCops(cops) {
        this.cops = cops;
        for (const c of this.cops) {
            c.setStrategy(this.ai_cops_strat());
        }
    }
    updateThiefPosition(thief, pos) {
        let index = this.thiefs.findIndex(t => t == thief);
        this.thiefs_position[index] = pos;
    }
    updateCopsPosition(cop, pos) {
        let index = this.cops.findIndex(c => c == cop);
        this.cops_position[index] = pos;
        this.graphService.updateCopsPositions(this.cops_position);
    }
    allThiefsPlayed() {
        let allPlayed = true;
        for (const t of this.thiefs) {
            allPlayed = allPlayed && t.hasPlayed();
        }
        return allPlayed;
    }
    allCopsPlayed() {
        let allPlayed = true;
        for (const c of this.cops) {
            allPlayed = allPlayed && c.hasPlayed();
        }
        return allPlayed;
    }
    update() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.checkTurn();
            if (this.placingPawns) {
                if (this.ai_side) {
                    if (this.ai_side === 'thief' && !this.placingCops) {
                        for (const t of this.thiefs) {
                            if (t.isWaitingPlacement())
                                t.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
                        }
                    }
                    if (this.ai_side === 'cops' && this.placingCops) {
                        for (const c of this.cops) {
                            if (c.isWaitingPlacement()) {
                                c.place(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
                            }
                        }
                    }
                }
                this.checkPlacement();
                this.checkTurn();
                if (!this.placingCops && this.placingPawns) {
                    const hud = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.HUD_TURN_DETAILS);
                    if (!hud.empty())
                        hud.text(() => 'Le voleur doit se placer.');
                    if (this.ai_side === 'thief')
                        setTimeout(() => this.update(), 500);
                }
                if (!this.placingPawns) {
                    const hud = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.HUD_TURN_DETAILS);
                    if (!hud.empty()) {
                        hud.style('color', 'blue')
                            .text(() => 'C\'est au tour des policiers.');
                    }
                    this.startGame();
                }
            }
            else {
                if (this.ai_side) {
                    if (this.ai_side === 'cops' && !this.thiefTurn) {
                        const hud = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](this.HUD_TURN_DETAILS);
                        if (!hud.empty()) {
                            hud.style('color', 'black')
                                .text(() => this.cops.length > 1 ? 'Les policiers réfléchissent à leurs déplacements...' : 'Le policier réfléchit à son déplacement...');
                        }
                        for (const c of this.cops) {
                            yield c.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position, c);
                        }
                        if (this.validateTurnCallback)
                            this.validateTurnCallback();
                        return;
                    }
                    else if (this.ai_side === 'thief' && this.thiefTurn) {
                        const hud = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](this.HUD_TURN_DETAILS);
                        if (!hud.empty()) {
                            hud.style('color', 'black')
                                .text(() => 'Le voleur réfléchit à son déplacement...');
                        }
                        for (const t of this.thiefs) {
                            yield t.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position);
                        }
                        if (this.validateTurnCallback)
                            this.validateTurnCallback();
                        return;
                    }
                }
                if (this.gameMode === 'extreme') {
                    if (this.ai_side === 'undefined' || this.ai_side === undefined) {
                        if (this.thiefTurn) {
                            if (this.allThiefsPlayed())
                                this.validateTurnCallback();
                        }
                        else if (!this.thiefTurn) {
                            if (this.allCopsPlayed())
                                this.validateTurnCallback();
                        }
                    }
                    else {
                        if (this.ai_side === 'cops' && this.thiefTurn) {
                            if (this.allThiefsPlayed())
                                this.validateTurnCallback();
                        }
                        else if (this.ai_side === 'thief' && !this.thiefTurn) {
                            if (this.allCopsPlayed())
                                this.validateTurnCallback();
                        }
                    }
                }
            }
            d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"]("#notificationBubble").remove();
            let pile = this.checkCops();
            if (pile.length != this.cops.length) {
                pile.forEach(e => {
                    if (e.length != 1) {
                    }
                });
            }
            if (this.turnChanged) {
                this.watchingPositionList.push(JSON.stringify(this.recordPosition()));
            }
        });
    }
    recordPosition() {
        let tmpPositionList = [];
        this.turnChanged = false;
        this.thiefs.forEach(e => {
            tmpPositionList.push(e.currentNodeId);
        });
        this.cops.forEach(e => {
            tmpPositionList.push(e.currentNodeId);
        });
        return tmpPositionList;
    }
    checkPlacement() {
        let placing = false;
        let cops = false;
        if (this.thiefs) {
            for (let i = 0; i < this.thiefs.length; i++) {
                placing = placing || this.thiefs[i].isWaitingPlacement();
            }
        }
        if (this.cops) {
            for (let i = 0; i < this.cops.length; i++) {
                placing = placing || this.cops[i].isWaitingPlacement();
                cops = cops || this.cops[i].isWaitingPlacement();
            }
        }
        this.placingPawns = placing;
        this.placingCops = cops;
    }
    notificate(pos, number) {
        return;
    }
    checkCops() {
        let copsPile = [];
        let tmpCopsPile = [];
        let alreadyWatchedCops = [];
        if (!this.cops)
            return copsPile;
        this.cops.forEach(c1 => {
            if (!alreadyWatchedCops.includes(c1)) {
                tmpCopsPile = [];
                tmpCopsPile.push(c1);
                alreadyWatchedCops.push(c1);
                this.cops.forEach(c2 => {
                    if (c1.role != c2.role) {
                        if (c1.currentNodeId !== undefined && c1.currentNodeId === c2.currentNodeId) {
                            tmpCopsPile.push(c2);
                            alreadyWatchedCops.push(c2);
                        }
                    }
                });
                if (!copsPile.includes(tmpCopsPile)) {
                    copsPile.push(tmpCopsPile);
                }
            }
        });
        return copsPile;
    }
    startGame() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.thiefTurn = false;
            this.gameTimer = Date.now();
            this.setPlayersState(this.cops, src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].onTurnState);
            if (this.ai_side === 'cops' && !this.firstMoveDone) {
                this.firstMoveDone = true;
                for (const c of this.cops) {
                    yield c.move(this.graphService.getGraph(), this.cops_position, this.thiefs_position, c);
                }
                if (this.validateTurnCallback) {
                    yield this.validateTurnCallback();
                }
                return;
            }
            yield this.update();
        });
    }
    setPlayersState(players, state) {
        if (!players)
            return;
        for (let i = 0; i < players.length; i++) {
            players[i].state = state;
        }
    }
    checkEnd() {
        let allThiefCapture = false;
        if (!this.thiefs || !this.cops)
            return false;
        for (let i = 0; i < this.thiefs.length; i++) {
            const t = this.thiefs[i];
            for (let j = 0; j < this.cops.length; j++) {
                allThiefCapture = allThiefCapture || t.isAtSamePostionAs(this.cops[j]);
            }
        }
        let timerEnd = this.turnCount > this.maxTurnCount;
        let startWatchingThiefWin = this.turnCount > 10;
        if (allThiefCapture) {
            this.winner = 'Les Policiers ont gagné';
            this.winnerSide = 'cops';
        }
        else {
            this.winnerSide = 'thief';
            if (timerEnd)
                this.winner = 'Le Voleur est vainqueur car le temps est écoulé';
            else if (startWatchingThiefWin && this.checkSamePositionAsPreviously()) {
                this.winner = 'Le Voleur est vainqueur par stratégie gagnante';
            }
        }
        return allThiefCapture || timerEnd || startWatchingThiefWin && this.alreadyEnconteredPos;
    }
    getTurnCount() {
        return this.turnCount;
    }
    getRemainingTurnCount() {
        return this.maxTurnCount - this.turnCount;
    }
    setGameMode(gameMode) {
        this.gameMode = gameMode;
    }
    validateTurn() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](".circle").style("fill", '#69b3a2');
            this.thiefTurn = !this.thiefTurn;
            this.clearActions();
            if (this.thiefTurn) {
                this.turnChanged = true;
                this.turnCount++;
                this.setPlayersState(this.cops, src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].waitingTurnState);
                this.setPlayersState(this.thiefs, src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].onTurnState);
                const hud = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.HUD_TURN_DETAILS);
                if (!hud.empty()) {
                    hud.style('color', 'green')
                        .text(() => 'C\'est au tour du voleur.');
                }
            }
            else {
                this.setPlayersState(this.thiefs, src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].waitingTurnState);
                this.setPlayersState(this.cops, src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].onTurnState);
                const hud = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.HUD_TURN_DETAILS);
                if (!hud.empty()) {
                    hud.style('color', 'blue')
                        .text(() => 'C\'est au tour des policiers.');
                }
            }
            if (this.checkEnd()) {
                if (!this.isAdventure) {
                    let endTime = Date.now();
                    this.gameTimer = endTime - this.gameTimer;
                    const result = yield sweetalert2__WEBPACK_IMPORTED_MODULE_4___default.a.fire({
                        title: this.winner,
                        text: 'Nombre de tours écoulés : ' + this.turnCount + ' Mode de Jeu : ' + this.getGameMode(this.gameMode) + ' Nombre de policiers : ' + this.cops.length + ' Nombre de Voleurs : ' + this.thiefs.length,
                        icon: 'success',
                        confirmButtonText: 'Rejouer',
                        showCancelButton: true,
                        cancelButtonText: 'Retour au Menu'
                    });
                    return { result: result, gameTimer: this.gameTimer, isAdventure: this.isAdventure };
                }
                else {
                    if (!this.isGameWinByPlayer()) {
                        return { wonByPlayer: false, gameTimer: this.gameTimer, isAdventure: this.isAdventure };
                    }
                    const mediation = this.adventure.getMediationInfo();
                    let result;
                    if (mediation.img) {
                        result = yield sweetalert2__WEBPACK_IMPORTED_MODULE_4___default.a.fire({
                            title: 'Explication',
                            imageUrl: mediation.img,
                            html: mediation.text,
                            confirmButtonText: 'Passer au niveau suivant',
                        });
                    }
                    else {
                        result = yield sweetalert2__WEBPACK_IMPORTED_MODULE_4___default.a.fire({
                            title: 'Explication',
                            html: mediation.text,
                            confirmButtonText: 'Passer au niveau suivant',
                        });
                    }
                    return { result: result, gameTimer: this.gameTimer, isAdventure: this.isAdventure };
                }
            }
            else {
                yield this.update();
            }
        });
    }
    getGameMode(mode) {
        switch (mode) {
            case 'easy':
                return 'Facile';
            case 'medium':
                return 'Normal';
            case 'hard':
                return 'Difficile';
            case 'extreme':
                return 'Extrême';
            default:
                return 'Inconnu';
        }
    }
    goBackToMenu() {
        this.reset();
        if (this.isAdventure) {
            this.router.navigate(['/adventure-menu']);
        }
        else {
            this.router.navigate(['/menu']);
        }
    }
    replay() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.watchingPositionList = [];
            this.watchingPositionListStep2 = [];
            this.alreadyEnconteredPos = false;
            this.turnCount = 0;
            this.turnChanged = false;
            this.placingPawns = true;
            this.placingCops = true;
            this.actionStack = new src_app_models_GameActionStack_game_action_stack__WEBPACK_IMPORTED_MODULE_3__["GameActionStack"]();
            this.cops_position = [];
            this.thiefs_position = [];
            if (this.isAdventure) {
                return yield this.endLevelCallback();
            }
            else {
                const extras = {
                    queryParams: {
                        gameMode: this.gameMode
                    }
                };
                this.router.navigate(['/board'], extras);
                return false;
            }
        });
    }
    reset() {
        this.watchingPositionList = [];
        this.watchingPositionListStep2 = [];
        this.alreadyEnconteredPos = false;
        this.turnCount = 0;
        this.placingCops = true;
        this.thiefTurn = false;
        this.placingPawns = true;
        this.gameTimer = 0;
        this.cops_position = [];
        this.thiefs_position = [];
    }
    checkTurn() {
        if (!this.thiefs || !this.cops)
            return;
        this.thiefs.forEach(t => {
            if (t.state === src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].onTurnState) {
                d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.' + t.role)
                    .style("opacity", 1);
            }
            else if (t.state === src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].waitingTurnState) {
                d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.' + t.role)
                    .style("opacity", 0.60);
            }
        });
        this.cops.forEach(c => {
            if (c.state === src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].onTurnState) {
                d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.' + c.role)
                    .style("opacity", 1);
            }
            else if (c.state === src_app_models_Pawn_PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_2__["GlobalPawnStates"].waitingTurnState) {
                d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.' + c.role)
                    .style("opacity", 0.60);
            }
        });
    }
    addGameAction(action) {
        this.actionStack.push(action);
    }
    cancelAction() {
        if (this.gameMode === 'easy')
            return true;
        const sucess = this.actionStack.cancelAction();
        this.checkTurn();
        return sucess;
    }
    isGameActionEmpty() {
        return this.actionStack.isEmpty();
    }
    peekAction() {
        return this.actionStack.peek();
    }
    clearActions() {
        this.actionStack.clear();
    }
    checkSamePositionAsPreviously() {
        this.alreadyEnconteredPos = (this.thiefTurn && this.watchingPositionListStep2.includes(JSON.stringify(this.recordPosition())));
        if (this.thiefTurn && this.watchingPositionList.includes(JSON.stringify(this.recordPosition()))) {
            this.watchingPositionListStep2.push(JSON.stringify(this.recordPosition()));
        }
        return this.alreadyEnconteredPos;
    }
    getMaxTurnCount() {
        let graph = this.graphService.getGraph();
        switch (graph.typology) {
            case 'grid':
                const grid = graph;
                return 2 * Math.max(grid.width, grid.height);
            case 'tore':
                const tore = graph;
                return 2 * Math.max(tore.width, tore.height);
            case 'cycle':
                return this.cops.length > 1 ? graph.nodes.length : 6;
            default:
                return graph.nodes.length;
        }
    }
    calculateMaxTurnCount() {
        this.maxTurnCount = this.getMaxTurnCount();
    }
    rules() {
        return 'Dans ce jeu, deux camps s’affrontent : les gendarmes dont le but est d’attraper le voleur le plus rapidement possible, et le voleur qui doit quant à lui fuir le plus longtemps possible et si possible ne jamais se faire attraper pour gagner.\n'
            + 'Les gendarmes sont placés en premier sur des sommets du graphe. Une fois tous les pions placés, les gendarmes se déplacent en premier. Les pions ne peuvent se déplacer que sur les sommets adjacents au sommet sur lequel ils se trouvent mais ils peuvent aussi choisir de rester sur le sommet sur lequel ils se trouvent actuellement.\n'
            + `Les gendarmes gagnent si le voleur est attrapé, c’est-à-dire si un des gendarmes se trouve sur le même sommet que le voleur. Le voleur est considéré comme vainqueur, soit s\'il est parvenu à ne pas se faire attraper par un gendarme pendant un certains nombre de tours (dépendant de la configuration du plateau de jeu) ou soit si l’intégralité des pions sur le plateau sont amenés à repasser 3 fois dans une position où ils étaient déjà, afin de détecter les cas où le voleur peut échapper aux gendarmes indéfiniment.`;
    }
    rulesHtml() {
        return '<p>Dans ce jeu, deux camps s’affrontent : les <strong style="color: #1D6BD3">gendarmes</strong> dont le but est d’attraper le voleur le plus rapidement possible. Et le <strong style="color: #E78710">voleur</strong> qui doit, quant à lui, fuir le plus longtemps possible et si possible ne jamais se faire attraper pour gagner.</p><br>'
            + '<p>Les <strong style="color: #1D6BD3">gendarmes sont placés en premier</strong> sur des sommets du graphe. Une fois tous les pions placés, les <strong style="color: #1D6BD3">gendarmes se déplacent en premier</strong>. Les pions ne peuvent se déplacer que sur les sommets adjacents au sommet sur lequel ils se trouvent mais ils peuvent aussi choisir de rester sur le sommet sur lequel ils se trouvent actuellement.</p><br>'
            + `<p><strong style="color: #1D6BD3">Les gendarmes gagnent si : le voleur est attrapé</strong>, c’est-à-dire si un des gendarmes se trouve sur le même sommet que le voleur. <strong style="color: #E78710">Le voleur est considéré comme vainqueur,</strong> soit <strong style="color: #E78710">s\'il est parvenu à ne pas se faire attraper par un gendarme pendant un certains nombre de tours</strong> (dépendant de la configuration du plateau de jeu) ou soit <strong style="color: #E78710">si l’intégralité des pions sur le plateau sont amenés à repasser 3 fois dans une position où ils étaient déjà</strong>, afin de détecter les cas où le voleur peut échapper aux gendarmes indéfiniment.</p><br>`;
    }
    colorInfo() {
        return '<p><i class="fas fa-circle" style="color:red;"></i> : Sommet contrôlé par les policiers. Visible en appuyant sur le bouton "zone de danger".</p><br>'
            + '<p><i class="fas fa-circle" style="color:blue;"></i> : Sommet de départ de pions lors de son mouvement.</p><br>'
            + '<p><i class="fas fa-circle" style="color:orange;"></i> : Sommets qui seront contrôlés par un pion après son mouvement.</p><br>'
            + '<p><i class="fas fa-circle" style="color:#05B800;"></i> : Sommets accessible par le pion pour ce tour.</p><br>';
    }
    isPlayerTurn() {
        return (this.ai_side === undefined || this.ai_side === 'undefined')
            || (this.ai_side === 'thief' && !this.thiefTurn)
            || (this.ai_side === 'cops' && this.thiefTurn);
    }
    isThiefTurn() {
        return this.thiefTurn;
    }
}
GameService.ɵfac = function GameService_Factory(t) { return new (t || GameService)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_graph_graph_service__WEBPACK_IMPORTED_MODULE_14__["GraphService"]), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_score_score_service__WEBPACK_IMPORTED_MODULE_15__["ScoreService"])); };
GameService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineInjectable"]({ token: GameService, factory: GameService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "ejVu":
/*!*********************************************!*\
  !*** ./src/app/models/Graph/Cycle/cycle.ts ***!
  \*********************************************/
/*! exports provided: Cycle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cycle", function() { return Cycle; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../graph */ "Z/gq");


class Cycle extends _graph__WEBPACK_IMPORTED_MODULE_1__["Graph"] {
    constructor(nodes, links) {
        super(nodes, links, "cycle");
    }
    simulate(svg) {
        const width = parseInt(svg.style("width"), 10);
        const height = parseInt(svg.style("height"), 10);
        const poolRadius = () => {
            if (width < height) {
                return (width / 2) - 50;
            }
            else {
                return (height / 2) - 50;
            }
        };
        this.simulation = d3__WEBPACK_IMPORTED_MODULE_0__["forceSimulation"](this.nodes)
            .force("link", d3__WEBPACK_IMPORTED_MODULE_0__["forceLink"]()
            .links(this.links)
            .distance(() => { return 30 / this.links.length; }))
            .force("radial", d3__WEBPACK_IMPORTED_MODULE_0__["forceRadial"](poolRadius(), width / 2, height / 2))
            .force("center", d3__WEBPACK_IMPORTED_MODULE_0__["forceCenter"](width / 2, height / 2))
            .on("tick", this.ticked.bind(this));
    }
    stop() {
        this.simulation.stop();
    }
    ticked() {
        this.svgLinks
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        this.svgNodes
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }
}


/***/ }),

/***/ "fqgZ":
/*!*****************************************************!*\
  !*** ./src/app/models/Adventure/adventures.mock.ts ***!
  \*****************************************************/
/*! exports provided: ADVENTURES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADVENTURES", function() { return ADVENTURES; });
/* harmony import */ var _adventure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adventure */ "Gh1A");
/* harmony import */ var _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AdventureLevel/adventure-level */ "cXIX");
/* harmony import */ var _difficulty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./difficulty */ "C/VE");
/* harmony import */ var _mode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mode */ "Rvdi");




const intro = new _adventure__WEBPACK_IMPORTED_MODULE_0__["Adventure"]('Introduction', _mode__WEBPACK_IMPORTED_MODULE_3__["Mode"].CLASSIC, 'intro', [
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('path', [10, 1], 1, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('cycle', [10, 1], 1, 1, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('caterpillar', [-1, -1], 1, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('special-tree', [15, 3], 1, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('cycle', [10, -1], 2, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
], 'assets/menu/graph-img/introduction.svg');
const dominant = new _adventure__WEBPACK_IMPORTED_MODULE_0__["Adventure"]('Dominants', _mode__WEBPACK_IMPORTED_MODULE_3__["Mode"].CLASSIC, 'dominant', [
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('visible-dominant', [-1, -1], 2, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('petersen', [-1, -1], 2, 1, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('petersen', [-1, -1], 3, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('hidden-dominant-3', [-1, -1], 3, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('visible-dominant-3', [-1, -1], 3, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
], 'assets/menu/graph-img/dominant.svg');
const grid = new _adventure__WEBPACK_IMPORTED_MODULE_0__["Adventure"]('Grilles (construction stratégies gagnantes)', _mode__WEBPACK_IMPORTED_MODULE_3__["Mode"].CLASSIC, 'grid-strat', [
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 9, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 5, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 4, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 2, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 1, 1, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].DIFFICILE),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('grid', [9, 9], 2, 2, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].DIFFICILE),
], 'assets/menu/graph-img/grid.svg');
const separator = new _adventure__WEBPACK_IMPORTED_MODULE_0__["Adventure"]('Séparateur', _mode__WEBPACK_IMPORTED_MODULE_3__["Mode"].CLASSIC, 'separator', [
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('2-arbre', [-1, -1], 1, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('2-arbre', [-1, -1], 1, 3, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('2-arbre', [-1, -1], 3, 2, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('2-arbre-reduce', [-1, -1], 1, 1, 'cops', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].NORMAL),
    new _AdventureLevel_adventure_level__WEBPACK_IMPORTED_MODULE_1__["AdventureLevel"]('chordal', [-1, -1], 1, 1, 'thief', _difficulty__WEBPACK_IMPORTED_MODULE_2__["Difficulty"].EXTREME),
], 'assets/menu/graph-img/chordal.svg');
const ADVENTURES = [
    intro,
    dominant,
    grid,
    separator,
];


/***/ }),

/***/ "jes1":
/*!********************************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/RandomCopsStrategy/random-cops-strategy.ts ***!
  \********************************************************************************/
/*! exports provided: RandomCopsStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomCopsStrategy", function() { return RandomCopsStrategy; });
class RandomCopsStrategy {
    constructor() {
        this.actual_place = null;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed = 1) {
        let vertex = null;
        const availableEdges = graph.edges(this.actual_place, speed);
        for (const n of availableEdges) {
            for (const p of thiefs_position_slot) {
                if (p && graph.distance(n, p) === 0) {
                    vertex = n;
                    break;
                }
            }
            if (vertex)
                break;
        }
        if (vertex === null)
            vertex = graph.getRandomAccessibleEdges(this.actual_place, speed);
        this.actual_place = vertex;
        return this.actual_place;
    }
}


/***/ }),

/***/ "lwcH":
/*!***************************************************************************!*\
  !*** ./src/app/models/Strategy/Thief/RunawayStrategy/runaway-strategy.ts ***!
  \***************************************************************************/
/*! exports provided: RunawayStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RunawayStrategy", function() { return RunawayStrategy; });
class RunawayStrategy {
    placement(graph, cops_position_slot, thiefs_position_slot) {
        this.actual_place = graph.getRandomEdge();
        let marked = [];
        while (cops_position_slot.some(c => graph.distance(this.actual_place, c) <= 1)) {
            marked.push(this.actual_place);
            if (marked.length >= graph.nodes.length) {
                console.log('BREAKING');
                if (cops_position_slot.some(c => graph.distance(this.actual_place, c) === 0)) {
                    this.actual_place = marked.find(vertex => cops_position_slot.some(c => graph.distance(vertex, c)));
                }
                break;
            }
            while (marked.includes(this.actual_place)) {
                this.actual_place = graph.getRandomEdge();
            }
        }
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed) {
        let farthest;
        let dist = 0;
        const edges = graph.edges(this.actual_place, speed, cops_position_slot).filter(e => !cops_position_slot.includes(e));
        edges.push(this.actual_place);
        for (const e of edges) {
            let globalDist = 0;
            let tooClose = false;
            for (const c of cops_position_slot) {
                const d = graph.distance(e, c);
                globalDist += d;
                if (d <= 1) {
                    tooClose = true;
                }
            }
            if (!tooClose && (!farthest || globalDist > dist)) {
                farthest = e;
                dist = globalDist;
            }
        }
        if (farthest) {
            this.actual_place = farthest;
        }
        return this.actual_place;
    }
}


/***/ }),

/***/ "mRlQ":
/*!********************************************************************************!*\
  !*** ./src/app/models/Strategy/Cop/WatchingStrategyV2/watching-strategy-v2.ts ***!
  \********************************************************************************/
/*! exports provided: WatchingStrategyV2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WatchingStrategyV2", function() { return WatchingStrategyV2; });
class WatchingStrategyV2 {
    constructor() {
        this.stay_on_spot = 0;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        let nextTo = true;
        while (nextTo) {
            this.actual_place = graph.getRandomEdge();
            nextTo = false;
            for (const c of cops_position_slot) {
                if (graph.distance(this.actual_place, c) <= 1) {
                    nextTo = true;
                    break;
                }
            }
        }
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed, pawn) {
        const edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        let vertex;
        let closest_vertex;
        let watchVertex = [];
        let thief_possible_move = [];
        for (const p of thiefs_position_slot) {
            graph.edges(p).forEach(v => {
                thief_possible_move.push(v);
            });
            thief_possible_move.push(p);
        }
        let distance = graph.nodes.length;
        let watchedByOther = [];
        for (const c of cops_position_slot) {
            if (c != this.actual_place) {
                graph.edges(c).forEach(v => {
                    if (thief_possible_move.includes(v))
                        watchedByOther.push(v);
                });
                watchedByOther.push(c);
            }
        }
        for (const e of edges) {
            if (cops_position_slot.includes(e))
                continue;
            const temp = graph.edges(e).filter(v => thief_possible_move.includes(v) && !watchedByOther.includes(v));
            if (temp.length > watchVertex.length) {
                watchVertex = temp;
                vertex = e;
            }
            else if (temp.length === watchVertex.length) {
                let count_on_spot = 0;
                for (const c of cops_position_slot) {
                    count_on_spot += c.index === this.actual_place.index ? 1 : 0;
                }
                if (count_on_spot < 1) {
                    watchVertex = temp;
                    vertex = e;
                }
            }
            let globalDist = 0;
            for (const t of thiefs_position_slot) {
                const d = graph.distance(e, t);
                if (d === 1) {
                    vertex = e;
                }
                globalDist += d !== -1 ? d : 0;
            }
            if (!closest_vertex || globalDist <= distance) {
                closest_vertex = e;
                distance = globalDist;
            }
        }
        if (this.actual_place == vertex)
            this.stay_on_spot++;
        console.log('closest_vertex', closest_vertex);
        if (watchVertex.length === 0 || this.stay_on_spot > 2) {
            vertex = closest_vertex;
            this.stay_on_spot = 0;
        }
        this.actual_place = vertex;
        return this.actual_place;
    }
}


/***/ }),

/***/ "rB2e":
/*!**********************************************************!*\
  !*** ./src/app/_services/Adventure/adventure.service.ts ***!
  \**********************************************************/
/*! exports provided: AdventureService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdventureService", function() { return AdventureService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var src_app_models_Adventure_adventures_mock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/models/Adventure/adventures.mock */ "fqgZ");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _game_game_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../game/game.service */ "eiSD");
/* harmony import */ var _graph_graph_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../graph/graph.service */ "daKe");







class AdventureService {
    constructor(router, gameService, graphService) {
        this.router = router;
        this.gameService = gameService;
        this.graphService = graphService;
        this.adventures = src_app_models_Adventure_adventures_mock__WEBPACK_IMPORTED_MODULE_1__["ADVENTURES"];
        this.currentAdventure = null;
    }
    getAvailableAdventures() {
        return this.adventures;
    }
    launchAdventure(adventure) {
        this.currentAdventure = adventure;
        this.currentAdventure.reset();
        this.gameService.setAdventure(this.currentAdventure);
        this.gameService.setIsAdventure(true);
        this.gameService.setEndLevelCallback(this.launchNextLevel.bind(this));
        this.launchNextLevel();
    }
    launchNextLevel() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const extras = yield this.configureAdventureNextLevel(this.currentAdventure);
            if (extras) {
                const role = this.getLevelPlayerRole();
                const message = `Dans ce niveau vous jouerez le rôle du camp ${role}. <br>Le voleur a une vitesse de ${this.currentAdventure.getCurrentLevel().getThiefSpeed()}`;
                yield sweetalert2__WEBPACK_IMPORTED_MODULE_2___default.a.fire({
                    html: message
                });
                this.router.navigate(['/board'], extras);
                return false;
            }
            else {
                this.gameService.setIsAdventure(false);
                this.router.navigate(['/adventure-menu']);
                return true;
            }
        });
    }
    configureAdventureNextLevel(adventure) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const level = this.currentAdventure.getCurrentLevel();
            let extras = undefined;
            if (level !== undefined) {
                this.gameService.reset();
                yield this.graphService.generateGraph(level.getGraphType(), level.getGraphParams());
                this.gameService.setOpponentType('ai');
                this.gameService.setCopsNumber(level.getCopsNumber());
                this.gameService.setThiefSpeed(level.getThiefSpeed());
                this.gameService.setAiSide(level.getAiSide());
                this.gameService.setGameMode(level.getDifficulty());
                extras = {
                    queryParams: {
                        gameMode: level.getDifficulty(),
                        adventure: true
                    }
                };
                return extras;
            }
            return undefined;
        });
    }
    getAdventureMode() {
        return this.currentAdventure.getMode();
    }
    getCurrentLevelMediation() {
        return this.currentAdventure.getMediationInfo();
    }
    getLevelPlayerRole() {
        return this.currentAdventure.getCurrentLevel().getPlayerRoleName();
    }
    goToNextLevel() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const res = yield this.currentAdventure.goToNextLevel();
            if (res) {
                this.gameService.setIsAdventure(false);
                this.router.navigate(['/adventure-menu']);
            }
            else {
                return true;
            }
        });
    }
}
AdventureService.ɵfac = function AdventureService_Factory(t) { return new (t || AdventureService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_game_game_service__WEBPACK_IMPORTED_MODULE_5__["GameService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_graph_graph_service__WEBPACK_IMPORTED_MODULE_6__["GraphService"])); };
AdventureService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: AdventureService, factory: AdventureService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "rCzw":
/*!***********************************************************************!*\
  !*** ./src/app/components/game-dashboard/game-dashboard.component.ts ***!
  \***********************************************************************/
/*! exports provided: GameDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameDashboardComponent", function() { return GameDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_app_services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/_services/statistic/statistic.service */ "cDp4");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");






function GameDashboardComponent_div_50_Template(rf, ctx) { if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameDashboardComponent_div_50_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r2); const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r1.refreshGraph(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "G\u00E9n\u00E9rer le graphique");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "\u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
class GameDashboardComponent {
    constructor(stat) {
        this.stat = stat;
        this.quote = '';
        this.margin = { top: 20, right: 20, bottom: 90, left: 120 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.statistics = yield this.stat.getStatistics();
        });
    }
    refreshGraph() {
        const card = d3__WEBPACK_IMPORTED_MODULE_1__["select"]('#charts').append("div")
            .attr("class", "card")
            .style("padding", "0.5em")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("align-items", "stretch")
            .style("height", "50vh");
        const title = card.append("div")
            .style("text-align", "center")
            .style("display", "flex");
        title.append("div")
            .style("flex", "1")
            .append("h2")
            .text(this.ordonne + " en fonction du " + this.abcisse)
            .style("margin-bottom", 0);
        title.append("button")
            .style("width", "3em")
            .attr("fill", "red")
            .on("click", () => {
            card.remove();
        })
            .append("img")
            .attr("src", "assets/dashboard/close.svg")
            .style("width", "100%");
        const chart = card.append("div")
            .attr("class", "chart")
            .style("flex", "1");
        const svg_width = parseInt(chart.style("width"));
        const svg_height = parseInt(chart.style("height"));
        const svg = chart.append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);
        const padding = 40;
        const g_width = svg_width - (2 * padding);
        const g_height = svg_height - (2 * padding);
        const g = svg.append("g")
            .attr("width", g_width)
            .attr("height", g_height)
            .attr("transform", "translate(" + padding + "," + padding + ")");
        this.x = d3__WEBPACK_IMPORTED_MODULE_1__["scaleBand"]()
            .range([g_width, 0])
            .padding(0.1);
        this.y = d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]()
            .range([g_height, 0]);
        switch (this.abcisse) {
            case 'Nombre de Policier':
                this.xData = 'copsNumber';
                break;
            case 'Type de Graph':
                this.quote = '"';
                this.xData = 'graphType';
                break;
            case 'Mode de Jeu':
                this.quote = '"';
                this.xData = 'gameMode';
                break;
        }
        switch (this.ordonne) {
            case 'Nombre de Tour':
                this.yData = 'turnCount';
                break;
            case 'Durée de la Partie':
                this.yData = 'timer';
                break;
        }
        let xAxis = d3__WEBPACK_IMPORTED_MODULE_1__["axisBottom"](this.x).ticks(6);
        let yAxis = d3__WEBPACK_IMPORTED_MODULE_1__["axisLeft"](this.y).ticks(5);
        this.averageStats = this.statistics.map(s => {
            return { xDat: s[this.xData], yDat: s[this.yData] };
        });
        const tmp = this.averageStats.reduce((acc, cur) => {
            if (cur.xDat in acc) {
                acc[cur.xDat].push(cur.yDat);
            }
            else {
                acc[cur.xDat] = [cur.yDat];
            }
            return acc;
        }, {});
        console.log(tmp);
        this.averageStats = {};
        for (const key in tmp) {
            const length = tmp[key].length;
            this.averageStats[key] = tmp[key].reduce((acc, cur) => {
                return acc + cur;
            }, 0);
            this.averageStats[key] = this.averageStats[key] / length;
        }
        this.x.domain(Object.keys(this.averageStats));
        this.y.domain([0, d3__WEBPACK_IMPORTED_MODULE_1__["max"](Object.values(this.averageStats))]);
        let data = [];
        console.log(this.averageStats);
        for (const d in this.averageStats) {
            data.push(JSON.parse("{\"" + this.xData + "\":" + this.quote + d + this.quote + ",\"" + this.yData + "\":" + this.averageStats[d] + "}"));
            g.append("g")
                .attr("transform", "translate(0," + (g_height) + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            g.append("g")
                .call(yAxis);
            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", "purple")
                .attr("x", d => this.x(d[this.xData]))
                .attr("width", this.x.bandwidth())
                .attr("y", d => this.y(d[this.yData]))
                .attr("height", d => (g_height) - this.y(d[this.yData]));
        }
    }
}
GameDashboardComponent.ɵfac = function GameDashboardComponent_Factory(t) { return new (t || GameDashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_services_statistic_statistic_service__WEBPACK_IMPORTED_MODULE_3__["StatisticService"])); };
GameDashboardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: GameDashboardComponent, selectors: [["app-game-dashboard"]], decls: 52, vars: 16, consts: [[1, "dashboard"], [1, "dashboard__header"], [1, "header__eyebrow"], [1, "header__title"], [1, "header__sub"], ["id", "stat-form", 1, "query-card"], [1, "query-card__section"], [1, "axis-label", "axis-label--y"], [1, "select-group"], [1, "select-option"], ["type", "radio", "name", "ordonne", "value", "Nombre de Tour", "hidden", "", 3, "ngModel", "ngModelChange"], [1, "select-option__icon"], [1, "select-option__text"], ["type", "radio", "name", "ordonne", "value", "Dur\u00E9e de la Partie", "hidden", "", 3, "ngModel", "ngModelChange"], [1, "query-card__divider"], [1, "divider__text"], [1, "axis-label", "axis-label--x"], ["type", "radio", "name", "abcisse", "value", "Nombre de Policier", "hidden", "", 3, "ngModel", "ngModelChange"], ["type", "radio", "name", "abcisse", "value", "Type de Graph", "hidden", "", 3, "ngModel", "ngModelChange"], ["type", "radio", "name", "abcisse", "value", "Mode de Jeu", "hidden", "", 3, "ngModel", "ngModelChange"], ["class", "query-card__footer", 4, "ngIf"], ["id", "charts", 1, "charts-zone"], [1, "query-card__footer"], [1, "run-btn", 3, "click"], [1, "run-btn__label"], [1, "run-btn__arrow"]], template: function GameDashboardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Statistiques \u00B7 Terra Numerica");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Analyse des parties");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Configurez vos axes pour visualiser les donn\u00E9es collect\u00E9es.");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "AXE Y \u2014 Mesure");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameDashboardComponent_Template_input_ngModelChange_14_listener($event) { return ctx.ordonne = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "\u229E");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Nombre de tours");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameDashboardComponent_Template_input_ngModelChange_20_listener($event) { return ctx.ordonne = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "\u25F7");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "Dur\u00E9e de partie");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "span", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, "en fonction du");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "AXE X \u2014 Variable");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](32, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameDashboardComponent_Template_input_ngModelChange_33_listener($event) { return ctx.abcisse = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "\u2B21");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "Nombre de policiers");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](39, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameDashboardComponent_Template_input_ngModelChange_39_listener($event) { return ctx.abcisse = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](41, "\u25C8");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](42, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](43, "Type de graphe");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](44, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](45, "input", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function GameDashboardComponent_Template_input_ngModelChange_45_listener($event) { return ctx.abcisse = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](46, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](47, "\u25C9");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](48, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](49, "Mode de jeu");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](50, GameDashboardComponent_div_50_Template, 6, 0, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](51, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.ordonne === "Nombre de Tour");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.ordonne);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.ordonne === "Dur\u00E9e de la Partie");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.ordonne);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.abcisse === "Nombre de Policier");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.abcisse);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.abcisse === "Type de Graph");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.abcisse);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.abcisse === "Mode de Jeu");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.abcisse);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.abcisse !== undefined && ctx.ordonne !== undefined);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["RadioControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"]], styles: ["@import url(\"https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap\");\n  body {\n  background: #f7f3ed;\n  margin: 0;\n  padding: 0;\n}\n.dashboard[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f7f3ed;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 56px 24px 80px;\n  font-family: \"Lora\", Georgia, serif;\n  color: #1a1612;\n  gap: 40px;\n}\n.dashboard__header[_ngcontent-%COMP%] {\n  text-align: center;\n  max-width: 560px;\n  animation: fadeUp 0.6s ease both;\n}\n.header__eyebrow[_ngcontent-%COMP%] {\n  font-family: \"DM Mono\", \"Courier New\", monospace;\n  font-size: 0.72rem;\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n  color: #8c8278;\n  margin-bottom: 12px;\n}\n.header__title[_ngcontent-%COMP%] {\n  font-size: clamp(2rem, 4vw, 3rem);\n  font-weight: 600;\n  line-height: 1.15;\n  margin: 0 0 12px;\n  color: #1a1612;\n}\n.header__sub[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #4a443c;\n  font-style: italic;\n  margin: 0;\n  line-height: 1.6;\n}\n.query-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 720px;\n  background: white;\n  border: 1px solid rgba(26, 22, 18, 0.25);\n  border-radius: 12px;\n  box-shadow: 0 2px 4px rgba(26, 22, 18, 0.06), 0 8px 32px rgba(26, 22, 18, 0.08);\n  overflow: hidden;\n  animation: fadeUp 0.6s 0.1s ease both;\n}\n.query-card__section[_ngcontent-%COMP%] {\n  padding: 28px 36px;\n}\n.query-card__divider[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 0 36px;\n}\n.query-card__divider[_ngcontent-%COMP%]::before, .query-card__divider[_ngcontent-%COMP%]::after {\n  content: \"\";\n  flex: 1;\n  height: 1px;\n  background: rgba(26, 22, 18, 0.12);\n}\n.query-card__footer[_ngcontent-%COMP%] {\n  padding: 20px 36px 28px;\n  display: flex;\n  justify-content: flex-end;\n  border-top: 1px solid rgba(26, 22, 18, 0.12);\n  background: #f7f3ed;\n}\n.divider__text[_ngcontent-%COMP%] {\n  font-family: \"DM Mono\", \"Courier New\", monospace;\n  font-size: 0.7rem;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: #8c8278;\n  white-space: nowrap;\n}\n.axis-label[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-family: \"DM Mono\", \"Courier New\", monospace;\n  font-size: 0.65rem;\n  letter-spacing: 0.16em;\n  text-transform: uppercase;\n  font-weight: 500;\n  margin-bottom: 16px;\n  padding: 3px 8px;\n  border-radius: 3px;\n}\n.axis-label--y[_ngcontent-%COMP%] {\n  background: rgba(192, 57, 43, 0.08);\n  color: #c0392b;\n  border: 1px solid rgba(192, 57, 43, 0.2);\n}\n.axis-label--x[_ngcontent-%COMP%] {\n  background: rgba(50, 100, 180, 0.07);\n  color: #2c5faa;\n  border: 1px solid rgba(50, 100, 180, 0.2);\n}\n.select-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n}\n.select-option[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 18px;\n  border: 1.5px solid rgba(26, 22, 18, 0.25);\n  border-radius: 6px;\n  background: #f7f3ed;\n  cursor: pointer;\n  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.select-option__icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #8c8278;\n  line-height: 1;\n  transition: color 0.18s;\n}\n.select-option__text[_ngcontent-%COMP%] {\n  font-family: \"Lora\", Georgia, serif;\n  font-size: 0.9rem;\n  color: #4a443c;\n  font-weight: 400;\n  transition: color 0.18s;\n}\n.select-option[_ngcontent-%COMP%]:hover {\n  border-color: #4a443c;\n  background: #ede7dc;\n}\n.select-option[_ngcontent-%COMP%]:hover   .select-option__icon[_ngcontent-%COMP%] {\n  color: #1a1612;\n}\n.select-option[_ngcontent-%COMP%]:hover   .select-option__text[_ngcontent-%COMP%] {\n  color: #1a1612;\n}\n.select-option.selected[_ngcontent-%COMP%] {\n  border-color: #c0392b;\n  background: #fdf0ec;\n  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.08);\n}\n.select-option.selected[_ngcontent-%COMP%]   .select-option__icon[_ngcontent-%COMP%] {\n  color: #c0392b;\n}\n.select-option.selected[_ngcontent-%COMP%]   .select-option__text[_ngcontent-%COMP%] {\n  color: #c0392b;\n  font-weight: 600;\n}\n.run-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 28px;\n  background: #1a1612;\n  color: #f7f3ed;\n  border: none;\n  border-radius: 6px;\n  font-family: \"Lora\", Georgia, serif;\n  font-size: 0.95rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.2s, transform 0.15s;\n  letter-spacing: 0.01em;\n}\n.run-btn__label[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.run-btn__arrow[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  transition: transform 0.2s;\n}\n.run-btn[_ngcontent-%COMP%]:hover {\n  background: #c0392b;\n}\n.run-btn[_ngcontent-%COMP%]:hover   .run-btn__arrow[_ngcontent-%COMP%] {\n  transform: translateX(4px);\n}\n.run-btn[_ngcontent-%COMP%]:active {\n  transform: translateY(1px);\n}\n.charts-zone[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 960px;\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  animation: fadeUp 0.6s 0.2s ease both;\n}\n@keyframes fadeUp {\n  from {\n    opacity: 0;\n    transform: translateY(16px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 600px) {\n  .dashboard[_ngcontent-%COMP%] {\n    padding: 36px 16px 60px;\n    gap: 28px;\n  }\n\n  .query-card__section[_ngcontent-%COMP%] {\n    padding: 20px 20px;\n  }\n  .query-card__divider[_ngcontent-%COMP%] {\n    padding: 0 20px;\n  }\n  .query-card__footer[_ngcontent-%COMP%] {\n    padding: 16px 20px 20px;\n  }\n\n  .select-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n\n  .select-option[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .run-btn[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxnYW1lLWRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBUSxpSUFBQTtBQW1CUjtFQUNFLG1CQWpCWTtFQWtCWixTQUFBO0VBQ0EsVUFBQTtBQWpCRjtBQXFCQTtFQUNFLGlCQUFBO0VBQ0EsbUJBekJZO0VBMEJaLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQ0FwQlk7RUFxQlosY0E3Qlk7RUE4QlosU0FBQTtBQWxCRjtBQXNCQTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQ0FBQTtBQW5CRjtBQXNCQTtFQUNFLGdEQWhDWTtFQWlDWixrQkFBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQTNDWTtFQTRDWixtQkFBQTtBQW5CRjtBQXNCQTtFQUNFLGlDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0F0RFk7QUFtQ2Q7QUFzQkE7RUFDRSxlQUFBO0VBQ0EsY0ExRFk7RUEyRFosa0JBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7QUFuQkY7QUF1QkE7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLHdDQUFBO0VBQ0EsbUJBQUE7RUFDQSwrRUE3RFk7RUE4RFosZ0JBQUE7RUFDQSxxQ0FBQTtBQXBCRjtBQXNCRTtFQUNFLGtCQUFBO0FBcEJKO0FBdUJFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGVBQUE7QUFyQko7QUF1Qkk7RUFDRSxXQUFBO0VBQ0EsT0FBQTtFQUNBLFdBQUE7RUFDQSxrQ0FwRlE7QUErRGQ7QUF5QkU7RUFDRSx1QkFBQTtFQUNBLGFBQUE7RUFDQSx5QkFBQTtFQUNBLDRDQUFBO0VBQ0EsbUJBckdVO0FBOEVkO0FBMkJBO0VBQ0UsZ0RBL0ZZO0VBZ0daLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLGNBMUdZO0VBMkdaLG1CQUFBO0FBeEJGO0FBNEJBO0VBQ0UscUJBQUE7RUFDQSxnREExR1k7RUEyR1osa0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUF6QkY7QUEyQkU7RUFDRSxtQ0FBQTtFQUNBLGNBM0hVO0VBNEhWLHdDQUFBO0FBekJKO0FBMkJFO0VBQ0Usb0NBQUE7RUFDQSxjQUFBO0VBQ0EseUNBQUE7QUF6Qko7QUE4QkE7RUFDRSxhQUFBO0VBQ0EsZUFBQTtFQUNBLFNBQUE7QUEzQkY7QUE4QkE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSwwQ0FBQTtFQUNBLGtCQTNJWTtFQTRJWixtQkF4Slk7RUF5SlosZUFBQTtFQUNBLGtFQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBQTNCRjtBQTZCRTtFQUNFLGVBQUE7RUFDQSxjQTNKVTtFQTRKVixjQUFBO0VBQ0EsdUJBQUE7QUEzQko7QUE4QkU7RUFDRSxtQ0EzSlU7RUE0SlYsaUJBQUE7RUFDQSxjQXBLVTtFQXFLVixnQkFBQTtFQUNBLHVCQUFBO0FBNUJKO0FBK0JFO0VBQ0UscUJBMUtVO0VBMktWLG1CQTdLVTtBQWdKZDtBQStCSTtFQUF1QixjQTlLYjtBQWtKZDtBQTZCSTtFQUF1QixjQS9LYjtBQXFKZDtBQTZCRTtFQUNFLHFCQWhMVTtFQWlMVixtQkEvS1U7RUFnTFYsNkNBQUE7QUEzQko7QUE2Qkk7RUFBdUIsY0FwTGI7QUEwSmQ7QUEyQkk7RUFBdUIsY0FyTGI7RUFxTDZCLGdCQUFBO0FBdkIzQztBQTRCQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQWxNWTtFQW1NWixjQXJNWTtFQXNNWixZQUFBO0VBQ0Esa0JBM0xZO0VBNExaLG1DQTlMWTtFQStMWixrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLDRDQUFBO0VBQ0Esc0JBQUE7QUF6QkY7QUEyQkU7RUFBVyxPQUFBO0FBeEJiO0FBMEJFO0VBQ0UsaUJBQUE7RUFDQSwwQkFBQTtBQXhCSjtBQTJCRTtFQUNFLG1CQWxOVTtBQXlMZDtBQTBCSTtFQUFrQiwwQkFBQTtBQXZCdEI7QUEwQkU7RUFBVywwQkFBQTtBQXZCYjtBQTJCQTtFQUNFLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxxQ0FBQTtBQXhCRjtBQTRCQTtFQUNFO0lBQU8sVUFBQTtJQUFZLDJCQUFBO0VBdkJuQjtFQXdCQTtJQUFPLFVBQUE7SUFBWSx3QkFBQTtFQXBCbkI7QUFDRjtBQXVCQTtFQUNFO0lBQ0UsdUJBQUE7SUFDQSxTQUFBO0VBckJGOztFQXlCRTtJQUFhLGtCQUFBO0VBckJmO0VBc0JFO0lBQWEsZUFBQTtFQW5CZjtFQW9CRTtJQUFhLHVCQUFBO0VBakJmOztFQW9CQTtJQUFnQixzQkFBQTtFQWhCaEI7O0VBa0JBO0lBQWlCLFdBQUE7RUFkakI7O0VBZ0JBO0lBQVcsV0FBQTtJQUFhLHVCQUFBO0VBWHhCO0FBQ0YiLCJmaWxlIjoiZ2FtZS1kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Mb3JhOml0YWwsd2dodEAwLDQwMDswLDYwMDsxLDQwMCZmYW1pbHk9RE0rTW9ubzp3Z2h0QDQwMDs1MDAmZGlzcGxheT1zd2FwJyk7XHJcblxyXG5cclxuJGNyZWFtOiAgICAgICAjZjdmM2VkO1xyXG4kY3JlYW0tZGFyazogICNlZGU3ZGM7XHJcbiRpbms6ICAgICAgICAgIzFhMTYxMjtcclxuJGluay1taWQ6ICAgICAjNGE0NDNjO1xyXG4kaW5rLWxpZ2h0OiAgICM4YzgyNzg7XHJcbiRhY2NlbnQ6ICAgICAgI2MwMzkyYjsgICAgICAgXHJcbiRhY2NlbnQtd2FybTogI2U4ODQ1YTsgICAgICAgXHJcbiRhY2NlbnQtYmc6ICAgI2ZkZjBlYztcclxuJGJvcmRlcjogICAgICByZ2JhKDI2LCAyMiwgMTgsIDAuMTIpO1xyXG4kYm9yZGVyLWRhcms6IHJnYmEoMjYsIDIyLCAxOCwgMC4yNSk7XHJcbiRmb250LXNlcmlmOiAgJ0xvcmEnLCBHZW9yZ2lhLCBzZXJpZjtcclxuJGZvbnQtbW9ubzogICAnRE0gTW9ubycsICdDb3VyaWVyIE5ldycsIG1vbm9zcGFjZTtcclxuJHJhZGl1czogICAgICA2cHg7XHJcbiRzaGFkb3ctY2FyZDogMCAycHggNHB4IHJnYmEoMjYsMjIsMTgsMC4wNiksIDAgOHB4IDMycHggcmdiYSgyNiwyMiwxOCwwLjA4KTtcclxuXHJcblxyXG46Om5nLWRlZXAgYm9keSB7XHJcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG5cclxuLmRhc2hib2FyZCB7XHJcbiAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgYmFja2dyb3VuZDogJGNyZWFtO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHBhZGRpbmc6IDU2cHggMjRweCA4MHB4O1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1zZXJpZjtcclxuICBjb2xvcjogJGluaztcclxuICBnYXA6IDQwcHg7XHJcbn1cclxuXHJcblxyXG4uZGFzaGJvYXJkX19oZWFkZXIge1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBtYXgtd2lkdGg6IDU2MHB4O1xyXG4gIGFuaW1hdGlvbjogZmFkZVVwIDAuNnMgZWFzZSBib3RoO1xyXG59XHJcblxyXG4uaGVhZGVyX19leWVicm93IHtcclxuICBmb250LWZhbWlseTogJGZvbnQtbW9ubztcclxuICBmb250LXNpemU6IDAuNzJyZW07XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIGNvbG9yOiAkaW5rLWxpZ2h0O1xyXG4gIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbn1cclxuXHJcbi5oZWFkZXJfX3RpdGxlIHtcclxuICBmb250LXNpemU6IGNsYW1wKDJyZW0sIDR2dywgM3JlbSk7XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICBsaW5lLWhlaWdodDogMS4xNTtcclxuICBtYXJnaW46IDAgMCAxMnB4O1xyXG4gIGNvbG9yOiAkaW5rO1xyXG59XHJcblxyXG4uaGVhZGVyX19zdWIge1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICBjb2xvcjogJGluay1taWQ7XHJcbiAgZm9udC1zdHlsZTogaXRhbGljO1xyXG4gIG1hcmdpbjogMDtcclxuICBsaW5lLWhlaWdodDogMS42O1xyXG59XHJcblxyXG5cclxuLnF1ZXJ5LWNhcmQge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1heC13aWR0aDogNzIwcHg7XHJcbiAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlci1kYXJrO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgYm94LXNoYWRvdzogJHNoYWRvdy1jYXJkO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgYW5pbWF0aW9uOiBmYWRlVXAgMC42cyAwLjFzIGVhc2UgYm90aDtcclxuXHJcbiAgJl9fc2VjdGlvbiB7XHJcbiAgICBwYWRkaW5nOiAyOHB4IDM2cHg7XHJcbiAgfVxyXG5cclxuICAmX19kaXZpZGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxNnB4O1xyXG4gICAgcGFkZGluZzogMCAzNnB4O1xyXG5cclxuICAgICY6OmJlZm9yZSwgJjo6YWZ0ZXIge1xyXG4gICAgICBjb250ZW50OiAnJztcclxuICAgICAgZmxleDogMTtcclxuICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgIGJhY2tncm91bmQ6ICRib3JkZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmX19mb290ZXIge1xyXG4gICAgcGFkZGluZzogMjBweCAzNnB4IDI4cHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAkYm9yZGVyO1xyXG4gICAgYmFja2dyb3VuZDogJGNyZWFtO1xyXG4gIH1cclxufVxyXG5cclxuLmRpdmlkZXJfX3RleHQge1xyXG4gIGZvbnQtZmFtaWx5OiAkZm9udC1tb25vO1xyXG4gIGZvbnQtc2l6ZTogMC43cmVtO1xyXG4gIGxldHRlci1zcGFjaW5nOiAwLjE0ZW07XHJcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICBjb2xvcjogJGluay1saWdodDtcclxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG59XHJcblxyXG5cclxuLmF4aXMtbGFiZWwge1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBmb250LWZhbWlseTogJGZvbnQtbW9ubztcclxuICBmb250LXNpemU6IDAuNjVyZW07XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMTZlbTtcclxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICBwYWRkaW5nOiAzcHggOHB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuXHJcbiAgJi0teSB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKCRhY2NlbnQsIDAuMDgpO1xyXG4gICAgY29sb3I6ICRhY2NlbnQ7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKCRhY2NlbnQsIDAuMik7XHJcbiAgfVxyXG4gICYtLXgge1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSg1MCwgMTAwLCAxODAsIDAuMDcpO1xyXG4gICAgY29sb3I6ICMyYzVmYWE7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDUwLCAxMDAsIDE4MCwgMC4yKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4uc2VsZWN0LWdyb3VwIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxuICBnYXA6IDEwcHg7XHJcbn1cclxuXHJcbi5zZWxlY3Qtb3B0aW9uIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAxMHB4O1xyXG4gIHBhZGRpbmc6IDEwcHggMThweDtcclxuICBib3JkZXI6IDEuNXB4IHNvbGlkICRib3JkZXItZGFyaztcclxuICBib3JkZXItcmFkaXVzOiAkcmFkaXVzO1xyXG4gIGJhY2tncm91bmQ6ICRjcmVhbTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMThzLCBiYWNrZ3JvdW5kIDAuMThzLCBib3gtc2hhZG93IDAuMThzO1xyXG4gIHVzZXItc2VsZWN0OiBub25lO1xyXG5cclxuICAmX19pY29uIHtcclxuICAgIGZvbnQtc2l6ZTogMXJlbTtcclxuICAgIGNvbG9yOiAkaW5rLWxpZ2h0O1xyXG4gICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjE4cztcclxuICB9XHJcblxyXG4gICZfX3RleHQge1xyXG4gICAgZm9udC1mYW1pbHk6ICRmb250LXNlcmlmO1xyXG4gICAgZm9udC1zaXplOiAwLjlyZW07XHJcbiAgICBjb2xvcjogJGluay1taWQ7XHJcbiAgICBmb250LXdlaWdodDogNDAwO1xyXG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4xOHM7XHJcbiAgfVxyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGJvcmRlci1jb2xvcjogJGluay1taWQ7XHJcbiAgICBiYWNrZ3JvdW5kOiAkY3JlYW0tZGFyaztcclxuXHJcbiAgICAuc2VsZWN0LW9wdGlvbl9faWNvbiB7IGNvbG9yOiAkaW5rOyB9XHJcbiAgICAuc2VsZWN0LW9wdGlvbl9fdGV4dCB7IGNvbG9yOiAkaW5rOyB9XHJcbiAgfVxyXG5cclxuICAmLnNlbGVjdGVkIHtcclxuICAgIGJvcmRlci1jb2xvcjogJGFjY2VudDtcclxuICAgIGJhY2tncm91bmQ6ICRhY2NlbnQtYmc7XHJcbiAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgkYWNjZW50LCAwLjA4KTtcclxuXHJcbiAgICAuc2VsZWN0LW9wdGlvbl9faWNvbiB7IGNvbG9yOiAkYWNjZW50OyB9XHJcbiAgICAuc2VsZWN0LW9wdGlvbl9fdGV4dCB7IGNvbG9yOiAkYWNjZW50OyBmb250LXdlaWdodDogNjAwOyB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLnJ1bi1idG4ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDEycHg7XHJcbiAgcGFkZGluZzogMTJweCAyOHB4O1xyXG4gIGJhY2tncm91bmQ6ICRpbms7XHJcbiAgY29sb3I6ICRjcmVhbTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm9yZGVyLXJhZGl1czogJHJhZGl1cztcclxuICBmb250LWZhbWlseTogJGZvbnQtc2VyaWY7XHJcbiAgZm9udC1zaXplOiAwLjk1cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycywgdHJhbnNmb3JtIDAuMTVzO1xyXG4gIGxldHRlci1zcGFjaW5nOiAwLjAxZW07XHJcblxyXG4gICZfX2xhYmVsIHsgZmxleDogMTsgfVxyXG5cclxuICAmX19hcnJvdyB7XHJcbiAgICBmb250LXNpemU6IDEuMXJlbTtcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzO1xyXG4gIH1cclxuXHJcbiAgJjpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiAkYWNjZW50O1xyXG4gICAgLnJ1bi1idG5fX2Fycm93IHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDRweCk7IH1cclxuICB9XHJcblxyXG4gICY6YWN0aXZlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCk7IH1cclxufVxyXG5cclxuXHJcbi5jaGFydHMtem9uZSB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWF4LXdpZHRoOiA5NjBweDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiAyNHB4O1xyXG4gIGFuaW1hdGlvbjogZmFkZVVwIDAuNnMgMC4ycyBlYXNlIGJvdGg7XHJcbn1cclxuXHJcblxyXG5Aa2V5ZnJhbWVzIGZhZGVVcCB7XHJcbiAgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNnB4KTsgfVxyXG4gIHRvICAgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cclxufVxyXG5cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gIC5kYXNoYm9hcmQge1xyXG4gICAgcGFkZGluZzogMzZweCAxNnB4IDYwcHg7XHJcbiAgICBnYXA6IDI4cHg7XHJcbiAgfVxyXG5cclxuICAucXVlcnktY2FyZCB7XHJcbiAgICAmX19zZWN0aW9uIHsgcGFkZGluZzogMjBweCAyMHB4OyB9XHJcbiAgICAmX19kaXZpZGVyIHsgcGFkZGluZzogMCAyMHB4OyB9XHJcbiAgICAmX19mb290ZXIgIHsgcGFkZGluZzogMTZweCAyMHB4IDIwcHg7IH1cclxuICB9XHJcblxyXG4gIC5zZWxlY3QtZ3JvdXAgeyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyB9XHJcblxyXG4gIC5zZWxlY3Qtb3B0aW9uIHsgd2lkdGg6IDEwMCU7IH1cclxuXHJcbiAgLnJ1bi1idG4geyB3aWR0aDogMTAwJTsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cclxufSJdfQ== */"] });


/***/ }),

/***/ "rdml":
/*!*********************************************************!*\
  !*** ./src/app/components/tooltip/tooltip.component.ts ***!
  \*********************************************************/
/*! exports provided: TooltipComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TooltipComponent", function() { return TooltipComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class TooltipComponent {
    constructor() { }
    ngOnInit() {
    }
}
TooltipComponent.ɵfac = function TooltipComponent_Factory(t) { return new (t || TooltipComponent)(); };
TooltipComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TooltipComponent, selectors: [["app-tooltip"]], inputs: { main_text: "main_text", tooltip_text: "tooltip_text" }, decls: 4, vars: 2, consts: [[1, "tooltip"], [1, "tooltiptext"]], template: function TooltipComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.main_text, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.tooltip_text);
    } }, styles: [".tooltip[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n  border-bottom: 1px dotted black;\n}\n\n.tooltip[_ngcontent-%COMP%]   .tooltiptext[_ngcontent-%COMP%] {\n  visibility: hidden;\n  width: 15em;\n  background-color: #555;\n  color: #fff;\n  text-align: center;\n  padding: 5px 0;\n  border-radius: 6px;\n  position: absolute;\n  z-index: 1;\n  bottom: 125%;\n  left: -100%;\n  margin-left: -60px;\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n\n.tooltip[_ngcontent-%COMP%]   .tooltiptext[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #555 transparent transparent transparent;\n}\n\n.tooltip[_ngcontent-%COMP%]:hover   .tooltiptext[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 1;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFx0b29sdGlwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksa0JBQUE7RUFDQSxxQkFBQTtFQUNBLCtCQUFBO0FBQUo7O0FBSUE7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtFQUdBLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFHQSxVQUFBO0VBQ0Esd0JBQUE7QUFMSjs7QUFTQTtFQUNJLFdBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxTQUFBO0VBQ0EsaUJBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0Esc0RBQUE7QUFOSjs7QUFVQTtFQUNJLG1CQUFBO0VBQ0EsVUFBQTtBQVBKIiwiZmlsZSI6InRvb2x0aXAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLnRvb2x0aXAge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IGRvdHRlZCBibGFjazsgXHJcbn1cclxuICBcclxuXHJcbi50b29sdGlwIC50b29sdGlwdGV4dCB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB3aWR0aDogMTVlbTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1NTU7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBhZGRpbmc6IDVweCAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNnB4O1xyXG5cclxuICAgIFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgei1pbmRleDogMTtcclxuICAgIGJvdHRvbTogMTI1JTtcclxuICAgIGxlZnQ6IC0xMDAlO1xyXG4gICAgbWFyZ2luLWxlZnQ6IC02MHB4O1xyXG5cclxuICAgIFxyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcztcclxufVxyXG5cclxuXHJcbi50b29sdGlwIC50b29sdGlwdGV4dDo6YWZ0ZXIge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMTAwJTtcclxuICAgIGxlZnQ6IDUwJTtcclxuICAgIG1hcmdpbi1sZWZ0OiAtNXB4O1xyXG4gICAgYm9yZGVyLXdpZHRoOiA1cHg7XHJcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjNTU1IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5cclxuLnRvb2x0aXA6aG92ZXIgLnRvb2x0aXB0ZXh0IHtcclxuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG59Il19 */"] });


/***/ }),

/***/ "sESa":
/*!*************************************!*\
  !*** ./src/app/models/Pawn/pawn.ts ***!
  \*************************************/
/*! exports provided: Pawns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pawns", function() { return Pawns; });
/* harmony import */ var _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PawnState/pawn-states */ "KjiV");

class Pawns {
    constructor(gameManager, graphService, x, y) {
        this.gameManager = gameManager;
        this.graphService = graphService;
        this.radius = 40;
        this.detectRadius = 45;
        this.settedPosition = true;
        this.x = x;
        this.y = y;
        this.firstMove = true;
        this.possiblePoints = [];
        this.lastSlot = [];
        this.yourTurn = true;
        this.state = _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].waitingPlacementState;
    }
    setStrategy(strat) {
        this.strategy = strat;
    }
    place(graph, cops = [], thiefs = []) {
        const pos = this.strategy.placement(graph, cops, thiefs);
        if (pos) {
            this.updatePosition(pos);
            this.currentNodeId = pos.id !== undefined ? pos.id : pos.index;
            this.x = pos.x;
            this.y = pos.y;
            this.lastSlot = pos;
            this.settedPosition = true;
            this.firstMove = false;
            this.state = _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].waitingTurnState;
        }
    }
    move(graph, cops = [], thiefs = [], c = undefined) {
        if (this.hasPlayed()) {
            return Promise.resolve(false);
        }
        return new Promise(resolve => {
            setTimeout(() => {
                this.moveCallback(graph, cops, thiefs, c);
                resolve(true);
            }, 2000);
        });
    }
    moveCallback(graph, cops, thiefs, c) {
        const speed = this.role.includes('thief') ? this.gameManager.getThiefSpeed() : 1;
        const pos = this.strategy.move(graph, cops, thiefs, speed, c);
        if (pos) {
            this.updatePosition(pos);
            this.currentNodeId = pos.id !== undefined ? pos.id : (pos.index !== undefined ? pos.index : this.currentNodeId);
            this.x = pos.x !== undefined ? pos.x : this.x;
            this.y = pos.y !== undefined ? pos.y : this.y;
            this.lastSlot = pos;
        }
        this.settedPosition = true;
        this.firstMove = false;
        this.state = _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].waitingTurnState;
    }
    undoMove(startPosition) {
        this.x = startPosition.x;
        this.y = startPosition.y;
        this.currentNodeId = startPosition.id !== undefined ? startPosition.id : startPosition.index;
        this.state = _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].onTurnState;
        this.lastSlot = startPosition;
    }
    dragstarted(event, d) {
        this.state.dragstarted(event, d);
    }
    dragged(event, d) {
        this.state.dragged(event, d);
    }
    dragended(event, d) {
        this.state = this.state.dragended(event, d, this.gameManager);
        this.gameManager.update();
    }
    isWaitingPlacement() {
        return this.state === _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].waitingPlacementState;
    }
    hasPlayed() {
        return this.state === _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].waitingTurnState;
    }
    onTurn() {
        return this.state === _PawnState_pawn_states__WEBPACK_IMPORTED_MODULE_0__["GlobalPawnStates"].onTurnState;
    }
    isAtSamePostionAs(pawn) {
        if (this.currentNodeId === undefined || this.currentNodeId === null || this.currentNodeId === -1)
            return false;
        if (pawn.currentNodeId === undefined || pawn.currentNodeId === null || pawn.currentNodeId === -1)
            return false;
        return String(this.currentNodeId) === String(pawn.currentNodeId);
    }
}


/***/ }),

/***/ "tT8E":
/*!********************************************!*\
  !*** ./src/app/models/Pawn/Thief/thief.ts ***!
  \********************************************/
/*! exports provided: Thief */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Thief", function() { return Thief; });
/* harmony import */ var _Strategy_Thief_RunawayStrategy_runaway_strategy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Strategy/Thief/RunawayStrategy/runaway-strategy */ "lwcH");
/* harmony import */ var _pawn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pawn */ "sESa");


class Thief extends _pawn__WEBPACK_IMPORTED_MODULE_1__["Pawns"] {
    constructor(gameM, graphServ, x, y) {
        super(gameM, graphServ, x, y);
        this.gameM = gameM;
        this.graphServ = graphServ;
        this.role = "thief";
        this.strategy = new _Strategy_Thief_RunawayStrategy_runaway_strategy__WEBPACK_IMPORTED_MODULE_0__["RunawayStrategy"]();
    }
    updatePosition(node) {
        if (node) {
            this.currentNodeId = node.id !== undefined ? Number(node.id) : Number(node.index);
            this.gameM.updateThiefPosition(this, node);
        }
    }
}


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _components_adventure_menu_adventure_menu_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/adventure-menu/adventure-menu.component */ "7zdo");
/* harmony import */ var _components_cops_and_robber_game_mode_selection_cops_and_robber_game_mode_selection_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/cops-and-robber-game-mode-selection/cops-and-robber-game-mode-selection.component */ "LRql");
/* harmony import */ var _components_credit_credit_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/credit/credit.component */ "Z8kk");
/* harmony import */ var _components_game_board_game_board_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/game-board/game-board.component */ "PDYC");
/* harmony import */ var _components_game_menu_game_menu_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/game-menu/game-menu.component */ "Z22J");
/* harmony import */ var _components_graph_constructor_graph_constructor_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/graph-constructor/graph-constructor.component */ "Nf+H");
/* harmony import */ var _components_rules_rules_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/rules/rules.component */ "Fj4N");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ "fXoL");










const routes = [
    { path: '', pathMatch: 'full', redirectTo: '/game-mode-selection' },
    { path: 'game-mode-selection', component: _components_cops_and_robber_game_mode_selection_cops_and_robber_game_mode_selection_component__WEBPACK_IMPORTED_MODULE_2__["CopsAndRobberGameModeSelectionComponent"] },
    { path: 'board', component: _components_game_board_game_board_component__WEBPACK_IMPORTED_MODULE_4__["GameBoardComponent"] },
    { path: 'menu', component: _components_game_menu_game_menu_component__WEBPACK_IMPORTED_MODULE_5__["GameMenuComponent"] },
    { path: 'graph-constructor', component: _components_graph_constructor_graph_constructor_component__WEBPACK_IMPORTED_MODULE_6__["GraphConstructorComponent"] },
    { path: 'adventure-menu', component: _components_adventure_menu_adventure_menu_component__WEBPACK_IMPORTED_MODULE_1__["AdventureMenuComponent"] },
    { path: 'credit', component: _components_credit_credit_component__WEBPACK_IMPORTED_MODULE_3__["CreditComponent"] },
    { path: 'rules', component: _components_rules_rules_component__WEBPACK_IMPORTED_MODULE_7__["RulesComponent"] }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "x1KM":
/*!*******************************************************************!*\
  !*** ./src/app/models/Strategy/RandomStrategy/random-strategy.ts ***!
  \*******************************************************************/
/*! exports provided: RandomStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomStrategy", function() { return RandomStrategy; });
class RandomStrategy {
    constructor() {
        this.actual_place = null;
    }
    placement(graph, cops_position_slot, thiefs_position_slot) {
        this.actual_place = graph.getRandomEdge();
        let marked = [];
        while (cops_position_slot.some(c => graph.distance(this.actual_place, c) <= 1)) {
            marked.push(this.actual_place);
            if (marked.length >= graph.nodes.length)
                break;
            while (marked.includes(this.actual_place)) {
                this.actual_place = graph.getRandomEdge();
            }
        }
        return this.actual_place;
    }
    move(graph, cops_position_slot, thiefs_position_slot, speed = 1) {
        this.actual_place = graph.getRandomAccessibleEdges(this.actual_place, speed);
        return this.actual_place;
    }
}


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map