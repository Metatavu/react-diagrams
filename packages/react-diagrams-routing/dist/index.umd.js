(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["projectstorm/react-diagrams-routing"] = factory();
	else
		root["projectstorm/react-diagrams-routing"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/dagre/DagreEngine.js":
/*!***********************************!*\
  !*** ./dist/dagre/DagreEngine.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DagreEngine = void 0;
const react_diagrams_core_1 = __webpack_require__(/*! @projectstorm/react-diagrams-core */ "@projectstorm/react-diagrams-core");
const dagre = __webpack_require__(/*! dagre */ "dagre");
const _ = __webpack_require__(/*! lodash */ "lodash");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
class DagreEngine {
    constructor(options = {}) {
        this.options = options;
    }
    redistribute(model) {
        // Create a new directed graph
        var g = new dagre.graphlib.Graph({
            multigraph: true,
            compound: true
        });
        g.setGraph(this.options.graph || {});
        g.setDefaultEdgeLabel(function () {
            return {};
        });
        // set nodes
        _.forEach(model.getNodes(), (node) => {
            g.setNode(node.getID(), { width: node.width, height: node.height });
        });
        _.forEach(model.getLinks(), (link) => {
            // set edges
            if (link.getSourcePort() && link.getTargetPort()) {
                g.setEdge({
                    v: link.getSourcePort().getNode().getID(),
                    w: link.getTargetPort().getNode().getID(),
                    name: link.getID()
                });
            }
        });
        // layout the graph
        dagre.layout(g);
        g.nodes().forEach((v) => {
            const node = g.node(v);
            model.getNode(v).setPosition(node.x - node.width / 2, node.y - node.height / 2);
        });
        // also include links?
        if (this.options.includeLinks) {
            g.edges().forEach((e) => {
                const edge = g.edge(e);
                const link = model.getLink(e.name);
                const points = [link.getFirstPoint()];
                for (let i = 1; i < edge.points.length - 1; i++) {
                    points.push(new react_diagrams_core_1.PointModel({ link: link, position: new geometry_1.Point(edge.points[i].x, edge.points[i].y) }));
                }
                link.setPoints(points.concat(link.getLastPoint()));
            });
        }
    }
}
exports.DagreEngine = DagreEngine;


/***/ }),

/***/ "./dist/engine/PathFinding.js":
/*!************************************!*\
  !*** ./dist/engine/PathFinding.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathFinding = void 0;
const PF = __webpack_require__(/*! pathfinding */ "pathfinding");
/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/
const pathFinderInstance = new PF.JumpPointFinder({
    heuristic: PF.Heuristic.manhattan,
    diagonalMovement: PF.DiagonalMovement.Never
});
class PathFinding {
    constructor(factory) {
        this.instance = pathFinderInstance;
        this.factory = factory;
    }
    /**
     * Taking as argument a fully unblocked walking matrix, this method
     * finds a direct path from point A to B.
     */
    calculateDirectPath(from, to) {
        const matrix = this.factory.getCanvasMatrix();
        const grid = new PF.Grid(matrix);
        return pathFinderInstance.findPath(this.factory.translateRoutingX(Math.floor(from.getX() / this.factory.ROUTING_SCALING_FACTOR)), this.factory.translateRoutingY(Math.floor(from.getY() / this.factory.ROUTING_SCALING_FACTOR)), this.factory.translateRoutingX(Math.floor(to.getX() / this.factory.ROUTING_SCALING_FACTOR)), this.factory.translateRoutingY(Math.floor(to.getY() / this.factory.ROUTING_SCALING_FACTOR)), grid);
    }
    /**
     * Using @link{#calculateDirectPath}'s result as input, we here
     * determine the first walkable point found in the matrix that includes
     * blocked paths.
     */
    calculateLinkStartEndCoords(matrix, path) {
        const startIndex = path.findIndex((point) => {
            if (matrix[point[1]])
                return matrix[point[1]][point[0]] === 0;
            else
                return false;
        });
        const endIndex = path.length -
            1 -
            path
                .slice()
                .reverse()
                .findIndex((point) => {
                if (matrix[point[1]])
                    return matrix[point[1]][point[0]] === 0;
                else
                    return false;
            });
        // are we trying to create a path exclusively through blocked areas?
        // if so, let's fallback to the linear routing
        if (startIndex === -1 || endIndex === -1) {
            return undefined;
        }
        const pathToStart = path.slice(0, startIndex);
        const pathToEnd = path.slice(endIndex);
        return {
            start: {
                x: path[startIndex][0],
                y: path[startIndex][1]
            },
            end: {
                x: path[endIndex][0],
                y: path[endIndex][1]
            },
            pathToStart,
            pathToEnd
        };
    }
    /**
     * Puts everything together: merges the paths from/to the centre of the ports,
     * with the path calculated around other elements.
     */
    calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd) {
        // generate the path based on the matrix with obstacles
        const grid = new PF.Grid(routingMatrix);
        const dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);
        // aggregate everything to have the calculated path ready for rendering
        const pathCoords = pathToStart
            .concat(dynamicPath, pathToEnd)
            .map((coords) => [
            this.factory.translateRoutingX(coords[0], true),
            this.factory.translateRoutingY(coords[1], true)
        ]);
        return PF.Util.compressPath(pathCoords);
    }
}
exports.PathFinding = PathFinding;


/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./link/PathFindingLinkFactory */ "./dist/link/PathFindingLinkFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./link/PathFindingLinkModel */ "./dist/link/PathFindingLinkModel.js"), exports);
__exportStar(__webpack_require__(/*! ./link/PathFindingLinkWidget */ "./dist/link/PathFindingLinkWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./link/RightAngleLinkWidget */ "./dist/link/RightAngleLinkWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./link/RightAngleLinkFactory */ "./dist/link/RightAngleLinkFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./link/RightAngleLinkModel */ "./dist/link/RightAngleLinkModel.js"), exports);
__exportStar(__webpack_require__(/*! ./engine/PathFinding */ "./dist/engine/PathFinding.js"), exports);
__exportStar(__webpack_require__(/*! ./dagre/DagreEngine */ "./dist/dagre/DagreEngine.js"), exports);


/***/ }),

/***/ "./dist/link/PathFindingLinkFactory.js":
/*!*********************************************!*\
  !*** ./dist/link/PathFindingLinkFactory.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathFindingLinkFactory = void 0;
const React = __webpack_require__(/*! react */ "react");
const PathFindingLinkModel_1 = __webpack_require__(/*! ./PathFindingLinkModel */ "./dist/link/PathFindingLinkModel.js");
const PathFindingLinkWidget_1 = __webpack_require__(/*! ./PathFindingLinkWidget */ "./dist/link/PathFindingLinkWidget.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
const Path = __webpack_require__(/*! paths-js/path */ "paths-js/path");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class PathFindingLinkFactory extends react_diagrams_defaults_1.DefaultLinkFactory {
    constructor() {
        super(PathFindingLinkFactory.NAME);
        this.ROUTING_SCALING_FACTOR = 5;
        // calculated only when smart routing is active
        this.canvasMatrix = [];
        this.routingMatrix = [];
        // used when at least one element has negative coordinates
        this.hAdjustmentFactor = 0;
        this.vAdjustmentFactor = 0;
        /**
         * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
         * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
         */
        this.calculateMatrixDimensions = () => {
            const allNodesCoords = _.values(this.engine.getModel().getNodes()).map((item) => ({
                x: item.getX(),
                width: item.width,
                y: item.getY(),
                height: item.height
            }));
            const allLinks = _.values(this.engine.getModel().getLinks());
            const allPortsCoords = _.flatMap(allLinks.map((link) => [link.getSourcePort(), link.getTargetPort()]))
                .filter((port) => port !== null)
                .map((item) => ({
                x: item.getX(),
                width: item.width,
                y: item.getY(),
                height: item.height
            }));
            const allPointsCoords = _.flatMap(allLinks.map((link) => link.getPoints())).map((item) => ({
                // points don't have width/height, so let's just use 0
                x: item.getX(),
                width: 0,
                y: item.getY(),
                height: 0
            }));
            const sumProps = (object, props) => _.reduce(props, (acc, prop) => acc + _.get(object, prop, 0), 0);
            const canvas = this.engine.getCanvas();
            const concatedCoords = _.concat(allNodesCoords, allPortsCoords, allPointsCoords);
            const minX = Math.floor(Math.min(_.get(_.minBy(concatedCoords, 'x'), 'x', 0), 0) / this.ROUTING_SCALING_FACTOR) *
                this.ROUTING_SCALING_FACTOR;
            const maxXElement = _.maxBy(concatedCoords, (item) => sumProps(item, ['x', 'width']));
            const maxX = Math.max(sumProps(maxXElement, ['x', 'width']), canvas.offsetWidth);
            const minYCoords = _.minBy(concatedCoords, 'y');
            const minY = Math.floor(Math.min(_.get(minYCoords, 'y', 0), 0) / this.ROUTING_SCALING_FACTOR) * this.ROUTING_SCALING_FACTOR;
            const maxYElement = _.maxBy(concatedCoords, (item) => sumProps(item, ['y', 'height']));
            const maxY = Math.max(sumProps(maxYElement, ['y', 'height']), canvas.offsetHeight);
            return {
                width: Math.ceil(Math.abs(minX) + maxX),
                hAdjustmentFactor: Math.abs(minX) / this.ROUTING_SCALING_FACTOR + 1,
                height: Math.ceil(Math.abs(minY) + maxY),
                vAdjustmentFactor: Math.abs(minY) / this.ROUTING_SCALING_FACTOR + 1
            };
        };
        /**
         * Updates (by reference) where nodes will be drawn on the matrix passed in.
         */
        this.markNodes = (matrix) => {
            _.values(this.engine.getModel().getNodes()).forEach((node) => {
                const startX = Math.floor(node.getX() / this.ROUTING_SCALING_FACTOR);
                const endX = Math.ceil((node.getX() + node.width) / this.ROUTING_SCALING_FACTOR);
                const startY = Math.floor(node.getY() / this.ROUTING_SCALING_FACTOR);
                const endY = Math.ceil((node.getY() + node.height) / this.ROUTING_SCALING_FACTOR);
                for (let x = startX - 1; x <= endX + 1; x++) {
                    for (let y = startY - 1; y < endY + 1; y++) {
                        this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
                    }
                }
            });
        };
        /**
         * Updates (by reference) where ports will be drawn on the matrix passed in.
         */
        this.markPorts = (matrix) => {
            const allElements = _.flatMap(_.values(this.engine.getModel().getLinks()).map((link) => [].concat(link.getSourcePort(), link.getTargetPort())));
            allElements
                .filter((port) => port !== null)
                .forEach((port) => {
                const startX = Math.floor(port.x / this.ROUTING_SCALING_FACTOR);
                const endX = Math.ceil((port.x + port.width) / this.ROUTING_SCALING_FACTOR);
                const startY = Math.floor(port.y / this.ROUTING_SCALING_FACTOR);
                const endY = Math.ceil((port.y + port.height) / this.ROUTING_SCALING_FACTOR);
                for (let x = startX - 1; x <= endX + 1; x++) {
                    for (let y = startY - 1; y < endY + 1; y++) {
                        this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
                    }
                }
            });
        };
        this.markMatrixPoint = (matrix, x, y) => {
            if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
                matrix[y][x] = 1;
            }
        };
    }
    setDiagramEngine(engine) {
        super.setDiagramEngine(engine);
        // listen for drag changes
        engine.getStateMachine().registerListener({
            stateChanged: (event) => {
                if (event.newState instanceof react_canvas_core_1.AbstractDisplacementState) {
                    const deRegister = engine.getActionEventBus().registerAction(new react_canvas_core_1.Action({
                        type: react_canvas_core_1.InputType.MOUSE_UP,
                        fire: () => {
                            this.calculateRoutingMatrix();
                            engine.repaintCanvas();
                            deRegister();
                        }
                    }));
                }
            }
        });
        this.listener = engine.registerListener({
            canvasReady: () => {
                _.defer(() => {
                    this.calculateRoutingMatrix();
                    engine.repaintCanvas();
                });
            }
        });
    }
    setFactoryBank(bank) {
        super.setFactoryBank(bank);
        if (!bank && this.listener) {
            this.listener.deregister();
        }
    }
    generateReactWidget(event) {
        return React.createElement(PathFindingLinkWidget_1.PathFindingLinkWidget, { diagramEngine: this.engine, link: event.model, factory: this });
    }
    generateModel(event) {
        return new PathFindingLinkModel_1.PathFindingLinkModel();
    }
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all walkable points are marked by zeros.
     * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
     */
    getCanvasMatrix() {
        if (this.canvasMatrix.length === 0) {
            this.calculateCanvasMatrix();
        }
        return this.canvasMatrix;
    }
    calculateCanvasMatrix() {
        const { width: canvasWidth, hAdjustmentFactor, height: canvasHeight, vAdjustmentFactor } = this.calculateMatrixDimensions();
        this.hAdjustmentFactor = hAdjustmentFactor;
        this.vAdjustmentFactor = vAdjustmentFactor;
        const matrixWidth = Math.ceil(canvasWidth / this.ROUTING_SCALING_FACTOR);
        const matrixHeight = Math.ceil(canvasHeight / this.ROUTING_SCALING_FACTOR);
        this.canvasMatrix = _.range(0, matrixHeight).map(() => {
            return new Array(matrixWidth).fill(0);
        });
    }
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 1 1 0 0 0 0 |
     * | 0 0 1 1 0 0 1 1 |
     * | 0 0 0 0 0 0 1 1 |
     * | 1 1 0 0 0 0 0 0 |
     * | 1 1 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all points blocked by a node (and its ports) are
     * marked as 1; points were there is nothing (ie, free) receive 0.
     */
    getRoutingMatrix() {
        if (this.routingMatrix.length === 0) {
            this.calculateRoutingMatrix();
        }
        return this.routingMatrix;
    }
    calculateRoutingMatrix() {
        const matrix = _.cloneDeep(this.getCanvasMatrix());
        // nodes need to be marked as blocked points
        this.markNodes(matrix);
        // same thing for ports
        this.markPorts(matrix);
        this.routingMatrix = matrix;
    }
    /**
     * The routing matrix does not have negative indexes, but elements could be negatively positioned.
     * We use the functions below to translate back and forth between these coordinates, relying on the
     * calculated values of hAdjustmentFactor and vAdjustmentFactor.
     */
    translateRoutingX(x, reverse = false) {
        return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
    }
    translateRoutingY(y, reverse = false) {
        return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
    }
    generateDynamicPath(pathCoords) {
        let path = Path();
        path = path.moveto(pathCoords[0][0] * this.ROUTING_SCALING_FACTOR, pathCoords[0][1] * this.ROUTING_SCALING_FACTOR);
        pathCoords.slice(1).forEach((coords) => {
            path = path.lineto(coords[0] * this.ROUTING_SCALING_FACTOR, coords[1] * this.ROUTING_SCALING_FACTOR);
        });
        return path.print();
    }
}
exports.PathFindingLinkFactory = PathFindingLinkFactory;
PathFindingLinkFactory.NAME = 'pathfinding';


/***/ }),

/***/ "./dist/link/PathFindingLinkModel.js":
/*!*******************************************!*\
  !*** ./dist/link/PathFindingLinkModel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathFindingLinkModel = void 0;
const PathFindingLinkFactory_1 = __webpack_require__(/*! ./PathFindingLinkFactory */ "./dist/link/PathFindingLinkFactory.js");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
class PathFindingLinkModel extends react_diagrams_defaults_1.DefaultLinkModel {
    constructor(options = {}) {
        super(Object.assign({ type: PathFindingLinkFactory_1.PathFindingLinkFactory.NAME }, options));
    }
    performanceTune() {
        return false;
    }
}
exports.PathFindingLinkModel = PathFindingLinkModel;


/***/ }),

/***/ "./dist/link/PathFindingLinkWidget.js":
/*!********************************************!*\
  !*** ./dist/link/PathFindingLinkWidget.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathFindingLinkWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const PathFinding_1 = __webpack_require__(/*! ../engine/PathFinding */ "./dist/engine/PathFinding.js");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
class PathFindingLinkWidget extends React.Component {
    constructor(props) {
        super(props);
        this.refPaths = [];
        this.state = {
            selected: false
        };
        this.pathFinding = new PathFinding_1.PathFinding(this.props.factory);
    }
    componentDidUpdate() {
        this.props.link.setRenderedPaths(this.refPaths.map((ref) => {
            return ref.current;
        }));
    }
    componentDidMount() {
        this.props.link.setRenderedPaths(this.refPaths.map((ref) => {
            return ref.current;
        }));
    }
    componentWillUnmount() {
        this.props.link.setRenderedPaths([]);
    }
    generateLink(path, id) {
        const ref = React.createRef();
        this.refPaths.push(ref);
        return (React.createElement(react_diagrams_defaults_1.DefaultLinkSegmentWidget, { key: `link-${id}`, path: path, selected: this.state.selected, diagramEngine: this.props.diagramEngine, factory: this.props.diagramEngine.getFactoryForLink(this.props.link), link: this.props.link, forwardRef: ref, onSelection: (selected) => {
                this.setState({ selected: selected });
            }, extras: {} }));
    }
    render() {
        this.refPaths = [];
        //ensure id is present for all points on the path
        var points = this.props.link.getPoints();
        var paths = [];
        // first step: calculate a direct path between the points being linked
        const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));
        const routingMatrix = this.props.factory.getRoutingMatrix();
        // now we need to extract, from the routing matrix, the very first walkable points
        // so they can be used as origin and destination of the link to be created
        const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
        if (smartLink) {
            const { start, end, pathToStart, pathToEnd } = smartLink;
            // second step: calculate a path avoiding hitting other elements
            const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
            paths.push(
            //smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
            this.generateLink(this.props.factory.generateDynamicPath(simplifiedPath), '0'));
        }
        return React.createElement(React.Fragment, null, paths);
    }
}
exports.PathFindingLinkWidget = PathFindingLinkWidget;


/***/ }),

/***/ "./dist/link/RightAngleLinkFactory.js":
/*!********************************************!*\
  !*** ./dist/link/RightAngleLinkFactory.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RightAngleLinkFactory = void 0;
const React = __webpack_require__(/*! react */ "react");
const RightAngleLinkWidget_1 = __webpack_require__(/*! ./RightAngleLinkWidget */ "./dist/link/RightAngleLinkWidget.js");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
const RightAngleLinkModel_1 = __webpack_require__(/*! ./RightAngleLinkModel */ "./dist/link/RightAngleLinkModel.js");
/**
 * @author Daniel Lazar
 */
class RightAngleLinkFactory extends react_diagrams_defaults_1.DefaultLinkFactory {
    constructor() {
        super(RightAngleLinkFactory.NAME);
    }
    generateModel(event) {
        return new RightAngleLinkModel_1.RightAngleLinkModel();
    }
    generateReactWidget(event) {
        return React.createElement(RightAngleLinkWidget_1.RightAngleLinkWidget, { diagramEngine: this.engine, link: event.model, factory: this });
    }
}
exports.RightAngleLinkFactory = RightAngleLinkFactory;
RightAngleLinkFactory.NAME = 'rightAngle';


/***/ }),

/***/ "./dist/link/RightAngleLinkModel.js":
/*!******************************************!*\
  !*** ./dist/link/RightAngleLinkModel.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RightAngleLinkModel = void 0;
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
const RightAngleLinkFactory_1 = __webpack_require__(/*! ./RightAngleLinkFactory */ "./dist/link/RightAngleLinkFactory.js");
class RightAngleLinkModel extends react_diagrams_defaults_1.DefaultLinkModel {
    constructor(options = {}) {
        super(Object.assign({ type: RightAngleLinkFactory_1.RightAngleLinkFactory.NAME }, options));
        this.lastHoverIndexOfPath = 0;
        this._lastPathXdirection = false;
        this._firstPathXdirection = false;
    }
    setFirstAndLastPathsDirection() {
        let points = this.getPoints();
        for (let i = 1; i < points.length; i += points.length - 2) {
            let dx = Math.abs(points[i].getX() - points[i - 1].getX());
            let dy = Math.abs(points[i].getY() - points[i - 1].getY());
            if (i - 1 === 0) {
                this._firstPathXdirection = dx > dy;
            }
            else {
                this._lastPathXdirection = dx > dy;
            }
        }
    }
    // @ts-ignore
    addPoint(pointModel, index = 1) {
        // @ts-ignore
        super.addPoint(pointModel, index);
        this.setFirstAndLastPathsDirection();
        return pointModel;
    }
    deserialize(event) {
        super.deserialize(event);
        this.setFirstAndLastPathsDirection();
    }
    setManuallyFirstAndLastPathsDirection(first, last) {
        this._firstPathXdirection = first;
        this._lastPathXdirection = last;
    }
    getLastPathXdirection() {
        return this._lastPathXdirection;
    }
    getFirstPathXdirection() {
        return this._firstPathXdirection;
    }
    setWidth(width) {
        this.options.width = width;
        this.fireEvent({ width }, 'widthChanged');
    }
    setColor(color) {
        this.options.color = color;
        this.fireEvent({ color }, 'colorChanged');
    }
}
exports.RightAngleLinkModel = RightAngleLinkModel;


/***/ }),

/***/ "./dist/link/RightAngleLinkWidget.js":
/*!*******************************************!*\
  !*** ./dist/link/RightAngleLinkWidget.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RightAngleLinkWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const react_diagrams_core_1 = __webpack_require__(/*! @projectstorm/react-diagrams-core */ "@projectstorm/react-diagrams-core");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
class RightAngleLinkWidget extends React.Component {
    constructor(props) {
        super(props);
        this.handleMove = function (event) {
            this.draggingEvent(event, this.dragging_index);
        }.bind(this);
        this.handleUp = function (event) {
            // Unregister handlers to avoid multiple event handlers for other links
            this.setState({ canDrag: false, selected: false });
            window.removeEventListener('mousemove', this.handleMove);
            window.removeEventListener('mouseup', this.handleUp);
        }.bind(this);
        this.refPaths = [];
        this.state = {
            selected: false,
            canDrag: false
        };
        this.dragging_index = 0;
    }
    componentDidUpdate() {
        this.props.link.setRenderedPaths(this.refPaths.map((ref) => {
            return ref.current;
        }));
    }
    componentDidMount() {
        this.props.link.setRenderedPaths(this.refPaths.map((ref) => {
            return ref.current;
        }));
    }
    componentWillUnmount() {
        this.props.link.setRenderedPaths([]);
    }
    generateLink(path, extraProps, id) {
        const ref = React.createRef();
        this.refPaths.push(ref);
        return (React.createElement(react_diagrams_defaults_1.DefaultLinkSegmentWidget, { key: `link-${id}`, path: path, selected: this.state.selected, diagramEngine: this.props.diagramEngine, factory: this.props.diagramEngine.getFactoryForLink(this.props.link), link: this.props.link, forwardRef: ref, onSelection: (selected) => {
                this.setState({ selected: selected });
            }, extras: extraProps }));
    }
    calculatePositions(points, event, index, coordinate) {
        // If path is first or last add another point to keep node port on its position
        if (index === 0) {
            let point = new react_diagrams_core_1.PointModel({
                link: this.props.link,
                position: new geometry_1.Point(points[index].getX(), points[index].getY())
            });
            this.props.link.addPoint(point, index);
            this.dragging_index++;
            return;
        }
        else if (index === points.length - 2) {
            let point = new react_diagrams_core_1.PointModel({
                link: this.props.link,
                position: new geometry_1.Point(points[index + 1].getX(), points[index + 1].getY())
            });
            this.props.link.addPoint(point, index + 1);
            return;
        }
        // Merge two points if it is not close to node port and close to each other
        if (index - 2 > 0) {
            let _points = {
                [index - 2]: points[index - 2].getPosition(),
                [index + 1]: points[index + 1].getPosition(),
                [index - 1]: points[index - 1].getPosition()
            };
            if (Math.abs(_points[index - 1][coordinate] - _points[index + 1][coordinate]) < 5) {
                _points[index - 2][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
                _points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
                points[index - 2].setPosition(_points[index - 2]);
                points[index + 1].setPosition(_points[index + 1]);
                points[index - 1].remove();
                points[index - 1].remove();
                this.dragging_index--;
                this.dragging_index--;
                return;
            }
        }
        // Merge two points if it is not close to node port
        if (index + 2 < points.length - 2) {
            let _points = {
                [index + 3]: points[index + 3].getPosition(),
                [index + 2]: points[index + 2].getPosition(),
                [index + 1]: points[index + 1].getPosition(),
                [index]: points[index].getPosition()
            };
            if (Math.abs(_points[index + 1][coordinate] - _points[index + 2][coordinate]) < 5) {
                _points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
                _points[index + 3][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
                points[index].setPosition(_points[index]);
                points[index + 3].setPosition(_points[index + 3]);
                points[index + 1].remove();
                points[index + 1].remove();
                return;
            }
        }
        // If no condition above handled then just update path points position
        let _points = {
            [index]: points[index].getPosition(),
            [index + 1]: points[index + 1].getPosition()
        };
        _points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        _points[index + 1][coordinate] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index].setPosition(_points[index]);
        points[index + 1].setPosition(_points[index + 1]);
    }
    draggingEvent(event, index) {
        let points = this.props.link.getPoints();
        // get moving difference. Index + 1 will work because links indexes has
        // length = points.lenght - 1
        let dx = Math.abs(points[index].getX() - points[index + 1].getX());
        let dy = Math.abs(points[index].getY() - points[index + 1].getY());
        // moving with y direction
        if (dx === 0) {
            this.calculatePositions(points, event, index, 'x');
        }
        else if (dy === 0) {
            this.calculatePositions(points, event, index, 'y');
        }
        this.props.link.setFirstAndLastPathsDirection();
    }
    render() {
        //ensure id is present for all points on the path
        let points = this.props.link.getPoints();
        let paths = [];
        // Get points based on link orientation
        let pointLeft = points[0];
        let pointRight = points[points.length - 1];
        let hadToSwitch = false;
        if (pointLeft.getX() > pointRight.getX()) {
            pointLeft = points[points.length - 1];
            pointRight = points[0];
            hadToSwitch = true;
        }
        let dy = Math.abs(points[0].getY() - points[points.length - 1].getY());
        // When new link add one middle point to get everywhere 90° angle
        if (this.props.link.getTargetPort() === null && points.length === 2) {
            [...Array(2)].forEach((item) => {
                this.props.link.addPoint(new react_diagrams_core_1.PointModel({
                    link: this.props.link,
                    position: new geometry_1.Point(pointLeft.getX(), pointRight.getY())
                }), 1);
            });
            this.props.link.setManuallyFirstAndLastPathsDirection(true, true);
        }
        // When new link is moving and not connected to target port move with middle point
        // TODO: @DanielLazarLDAPPS This will be better to update in DragNewLinkState
        //  in function fireMouseMoved to avoid calling this unexpectedly e.g. after Deserialize
        else if (this.props.link.getTargetPort() === null && this.props.link.getSourcePort() !== null) {
            points[1].setPosition(pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2, !hadToSwitch ? pointLeft.getY() : pointRight.getY());
            points[2].setPosition(pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2, !hadToSwitch ? pointRight.getY() : pointLeft.getY());
        }
        // Render was called but link is not moved but user.
        // Node is moved and in this case fix coordinates to get 90° angle.
        // For loop just for first and last path
        else if (!this.state.canDrag && points.length > 2) {
            // Those points and its position only will be moved
            for (let i = 1; i < points.length; i += points.length - 2) {
                if (i - 1 === 0) {
                    if (this.props.link.getFirstPathXdirection()) {
                        points[i].setPosition(points[i].getX(), points[i - 1].getY());
                    }
                    else {
                        points[i].setPosition(points[i - 1].getX(), points[i].getY());
                    }
                }
                else {
                    if (this.props.link.getLastPathXdirection()) {
                        points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
                    }
                    else {
                        points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
                    }
                }
            }
        }
        // If there is existing link which has two points add one
        // NOTE: It doesn't matter if check is for dy or dx
        if (points.length === 2 && dy !== 0 && !this.state.canDrag) {
            this.props.link.addPoint(new react_diagrams_core_1.PointModel({
                link: this.props.link,
                position: new geometry_1.Point(pointLeft.getX(), pointRight.getY())
            }));
        }
        for (let j = 0; j < points.length - 1; j++) {
            paths.push(this.generateLink(react_diagrams_core_1.LinkWidget.generateLinePath(points[j], points[j + 1]), {
                'data-linkid': this.props.link.getID(),
                'data-point': j,
                onMouseDown: (event) => {
                    if (event.button === 0) {
                        this.setState({ canDrag: true });
                        this.dragging_index = j;
                        // Register mouse move event to track mouse position
                        // On mouse up these events are unregistered check "this.handleUp"
                        window.addEventListener('mousemove', this.handleMove);
                        window.addEventListener('mouseup', this.handleUp);
                    }
                },
                onMouseEnter: (event) => {
                    this.setState({ selected: true });
                    this.props.link.lastHoverIndexOfPath = j;
                }
            }, j));
        }
        this.refPaths = [];
        return React.createElement("g", { "data-default-link-test": this.props.link.getOptions().testName }, paths);
    }
}
exports.RightAngleLinkWidget = RightAngleLinkWidget;
RightAngleLinkWidget.defaultProps = {
    color: 'red',
    width: 3,
    link: null,
    smooth: false,
    diagramEngine: null,
    factory: null
};


/***/ }),

/***/ "@projectstorm/geometry":
/*!*****************************************!*\
  !*** external "@projectstorm/geometry" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/geometry");;

/***/ }),

/***/ "@projectstorm/react-canvas-core":
/*!**************************************************!*\
  !*** external "@projectstorm/react-canvas-core" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/react-canvas-core");;

/***/ }),

/***/ "@projectstorm/react-diagrams-core":
/*!****************************************************!*\
  !*** external "@projectstorm/react-diagrams-core" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/react-diagrams-core");;

/***/ }),

/***/ "@projectstorm/react-diagrams-defaults":
/*!********************************************************!*\
  !*** external "@projectstorm/react-diagrams-defaults" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/react-diagrams-defaults");;

/***/ }),

/***/ "dagre":
/*!************************!*\
  !*** external "dagre" ***!
  \************************/
/***/ ((module) => {

module.exports = require("dagre");;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");;

/***/ }),

/***/ "pathfinding":
/*!******************************!*\
  !*** external "pathfinding" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("pathfinding");;

/***/ }),

/***/ "paths-js/path":
/*!********************************!*\
  !*** external "paths-js/path" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("paths-js/path");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.umd.js.map