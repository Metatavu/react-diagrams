(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["projectstorm/react-canvas-core"] = factory();
	else
		root["projectstorm/react-canvas-core"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/DiagramEngine.js":
/*!*******************************!*\
  !*** ./dist/DiagramEngine.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiagramEngine = void 0;
const NodeModel_1 = __webpack_require__(/*! ./entities/node/NodeModel */ "./dist/entities/node/NodeModel.js");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
/**
 * Passed as a parameter to the DiagramWidget
 */
class DiagramEngine extends react_canvas_core_1.CanvasEngine {
    constructor(options = {}) {
        super(options);
        this.maxNumberPointsPerLink = 1000;
        // create banks for the different factory types
        this.nodeFactories = new react_canvas_core_1.FactoryBank();
        this.linkFactories = new react_canvas_core_1.FactoryBank();
        this.portFactories = new react_canvas_core_1.FactoryBank();
        this.labelFactories = new react_canvas_core_1.FactoryBank();
        const setup = (factory) => {
            factory.registerListener({
                factoryAdded: (event) => {
                    event.factory.setDiagramEngine(this);
                },
                factoryRemoved: (event) => {
                    event.factory.setDiagramEngine(null);
                }
            });
        };
        setup(this.nodeFactories);
        setup(this.linkFactories);
        setup(this.portFactories);
        setup(this.labelFactories);
    }
    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event) {
        var target = event.target;
        var diagramModel = this.model;
        //is it a port
        var element = react_canvas_core_1.Toolkit.closest(target, '.port[data-name]');
        if (element) {
            var nodeElement = react_canvas_core_1.Toolkit.closest(target, '.node[data-nodeid]');
            return diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name'));
        }
        //look for a point
        element = react_canvas_core_1.Toolkit.closest(target, '.point[data-id]');
        if (element) {
            return diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id'));
        }
        //look for a link
        element = react_canvas_core_1.Toolkit.closest(target, '[data-linkid]');
        if (element) {
            return diagramModel.getLink(element.getAttribute('data-linkid'));
        }
        //look for a node
        element = react_canvas_core_1.Toolkit.closest(target, '.node[data-nodeid]');
        if (element) {
            return diagramModel.getNode(element.getAttribute('data-nodeid'));
        }
        return null;
    }
    //!-------------- FACTORIES ------------
    getNodeFactories() {
        return this.nodeFactories;
    }
    getLinkFactories() {
        return this.linkFactories;
    }
    getLabelFactories() {
        return this.labelFactories;
    }
    getPortFactories() {
        return this.portFactories;
    }
    getFactoryForNode(node) {
        if (typeof node === 'string') {
            return this.nodeFactories.getFactory(node);
        }
        return this.nodeFactories.getFactory(node.getType());
    }
    getFactoryForLink(link) {
        if (typeof link === 'string') {
            return this.linkFactories.getFactory(link);
        }
        return this.linkFactories.getFactory(link.getType());
    }
    getFactoryForLabel(label) {
        if (typeof label === 'string') {
            return this.labelFactories.getFactory(label);
        }
        return this.labelFactories.getFactory(label.getType());
    }
    getFactoryForPort(port) {
        if (typeof port === 'string') {
            return this.portFactories.getFactory(port);
        }
        return this.portFactories.getFactory(port.getType());
    }
    generateWidgetForLink(link) {
        return this.getFactoryForLink(link).generateReactWidget({ model: link });
    }
    generateWidgetForNode(node) {
        return this.getFactoryForNode(node).generateReactWidget({ model: node });
    }
    getNodeElement(node) {
        const selector = this.canvas.querySelector(`.node[data-nodeid="${node.getID()}"]`);
        if (selector === null) {
            throw new Error('Cannot find Node element with nodeID: [' + node.getID() + ']');
        }
        return selector;
    }
    getNodePortElement(port) {
        var selector = this.canvas.querySelector(`.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`);
        if (selector === null) {
            throw new Error('Cannot find Node Port element with nodeID: [' +
                port.getParent().getID() +
                '] and name: [' +
                port.getName() +
                ']');
        }
        return selector;
    }
    getPortCenter(port) {
        return this.getPortCoords(port).getOrigin();
    }
    /**
     * Calculate rectangular coordinates of the port passed in.
     */
    getPortCoords(port, element) {
        if (!this.canvas) {
            throw new Error('Canvas needs to be set first');
        }
        if (!element) {
            element = this.getNodePortElement(port);
        }
        const sourceRect = element.getBoundingClientRect();
        const point = this.getRelativeMousePoint({
            clientX: sourceRect.left,
            clientY: sourceRect.top
        });
        const zoom = this.model.getZoomLevel() / 100.0;
        return new geometry_1.Rectangle(point.x, point.y, sourceRect.width / zoom, sourceRect.height / zoom);
    }
    /**
     * Determine the width and height of the node passed in.
     * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
     */
    getNodeDimensions(node) {
        if (!this.canvas) {
            return {
                width: 0,
                height: 0
            };
        }
        const nodeElement = this.getNodeElement(node);
        const nodeRect = nodeElement.getBoundingClientRect();
        return {
            width: nodeRect.width,
            height: nodeRect.height
        };
    }
    getBoundingNodesRect(nodes) {
        if (nodes) {
            if (nodes.length === 0) {
                return new geometry_1.Rectangle(0, 0, 0, 0);
            }
            return geometry_1.Polygon.boundingBoxFromPolygons(nodes.map((node) => node.getBoundingBox()));
        }
    }
    zoomToFitSelectedNodes(options) {
        const nodes = this.model
            .getSelectedEntities()
            .filter((entity) => entity instanceof NodeModel_1.NodeModel);
        this.zoomToFitNodes({
            margin: options.margin,
            maxZoom: options.maxZoom,
            nodes: nodes.length > 0 ? nodes : null
        });
    }
    zoomToFitNodes(options) {
        let margin = options || 0;
        let nodes = [];
        let maxZoom = null;
        if (!!options && typeof options == 'object') {
            margin = options.margin || 0;
            nodes = options.nodes || [];
            maxZoom = options.maxZoom || null;
        }
        // no node selected
        if (nodes.length === 0) {
            nodes = this.model.getNodes();
        }
        const nodesRect = this.getBoundingNodesRect(nodes);
        if (nodesRect) {
            // there is something we should zoom on
            let canvasRect = this.canvas.getBoundingClientRect();
            const calculate = (margin = 0) => {
                // work out zoom
                const xFactor = this.canvas.clientWidth / (nodesRect.getWidth() + margin * 2);
                const yFactor = this.canvas.clientHeight / (nodesRect.getHeight() + margin * 2);
                let zoomFactor = xFactor < yFactor ? xFactor : yFactor;
                if (maxZoom && zoomFactor > maxZoom) {
                    zoomFactor = maxZoom;
                }
                return {
                    zoom: zoomFactor,
                    x: canvasRect.width / 2 -
                        ((nodesRect.getWidth() + margin * 2) * zoomFactor) / 2 +
                        margin -
                        nodesRect.getTopLeft().x,
                    y: canvasRect.height / 2 -
                        ((nodesRect.getHeight() + margin * 2) * zoomFactor) / 2 +
                        margin -
                        nodesRect.getTopLeft().y
                };
            };
            let params = calculate(0);
            if (margin) {
                if (params.x < margin || params.y < margin) {
                    params = calculate(margin);
                }
            }
            // apply
            this.model.setZoomLevel(params.zoom * 100);
            this.model.setOffset(params.x, params.y);
            this.repaintCanvas();
        }
    }
    getMaxNumberPointsPerLink() {
        return this.maxNumberPointsPerLink;
    }
    setMaxNumberPointsPerLink(max) {
        this.maxNumberPointsPerLink = max;
    }
}
exports.DiagramEngine = DiagramEngine;


/***/ }),

/***/ "./dist/entities/label/LabelModel.js":
/*!*******************************************!*\
  !*** ./dist/entities/label/LabelModel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabelModel = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class LabelModel extends react_canvas_core_1.BaseModel {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { offsetX: options.offsetX || 0, offsetY: options.offsetY || 0 }));
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.offsetX = event.data.offsetX;
        this.options.offsetY = event.data.offsetY;
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { offsetX: this.options.offsetX, offsetY: this.options.offsetY });
    }
}
exports.LabelModel = LabelModel;


/***/ }),

/***/ "./dist/entities/label/LabelWidget.js":
/*!********************************************!*\
  !*** ./dist/entities/label/LabelWidget.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabelWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
var S;
(function (S) {
    S.Label = styled_1.default.div `
		display: inline-block;
		position: absolute;
	`;
    S.Foreign = styled_1.default.foreignObject `
		pointer-events: none;
		overflow: visible;
	`;
})(S || (S = {}));
class LabelWidget extends React.Component {
    constructor(props) {
        super(props);
        this.findPathAndRelativePositionToRenderLabel = (index) => {
            // an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
            const link = this.props.label.getParent();
            const lengths = link.getRenderedPath().map((svg) => {
                const path = svg.children.length ? svg.children[0] : undefined;
                return (path === null || path === void 0 ? void 0 : path.getTotalLength()) || 0;
            });
            // calculate the point where we want to display the label
            let labelPosition = lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
                (index / (link.getLabels().length + 1));
            // find the path where the label will be rendered and calculate the relative position
            let pathIndex = 0;
            while (pathIndex < link.getRenderedPath().length) {
                if (labelPosition - lengths[pathIndex] < 0) {
                    return {
                        path: link.getRenderedPath()[pathIndex],
                        position: labelPosition
                    };
                }
                // keep searching
                labelPosition -= lengths[pathIndex];
                pathIndex++;
            }
        };
        this.calculateLabelPosition = () => {
            const found = this.findPathAndRelativePositionToRenderLabel(this.props.index + 1);
            if (!found) {
                return;
            }
            const { position } = found;
            const svg = found.path;
            const path = svg.children.length ? svg.children[0] : undefined;
            const labelDimensions = {
                width: this.ref.current.offsetWidth,
                height: this.ref.current.offsetHeight
            };
            const pathCentre = (path === null || path === void 0 ? void 0 : path.getPointAtLength(position)) || 0;
            const labelCoordinates = {
                x: pathCentre.x - labelDimensions.width / 2 + this.props.label.getOptions().offsetX,
                y: pathCentre.y - labelDimensions.height / 2 + this.props.label.getOptions().offsetY
            };
            this.ref.current.style.transform = `translate(${labelCoordinates.x}px, ${labelCoordinates.y}px)`;
        };
        this.ref = React.createRef();
    }
    componentDidUpdate() {
        window.requestAnimationFrame(this.calculateLabelPosition);
    }
    componentDidMount() {
        window.requestAnimationFrame(this.calculateLabelPosition);
    }
    render() {
        const canvas = this.props.engine.getCanvas();
        return (React.createElement(S.Foreign, { key: this.props.label.getID(), width: canvas.offsetWidth, height: canvas.offsetHeight },
            React.createElement(S.Label, { ref: this.ref }, this.props.engine.getFactoryForLabel(this.props.label).generateReactWidget({ model: this.props.label }))));
    }
}
exports.LabelWidget = LabelWidget;


/***/ }),

/***/ "./dist/entities/link-layer/LinkLayerFactory.js":
/*!******************************************************!*\
  !*** ./dist/entities/link-layer/LinkLayerFactory.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinkLayerFactory = void 0;
const React = __webpack_require__(/*! react */ "react");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const LinkLayerModel_1 = __webpack_require__(/*! ./LinkLayerModel */ "./dist/entities/link-layer/LinkLayerModel.js");
const LinkLayerWidget_1 = __webpack_require__(/*! ./LinkLayerWidget */ "./dist/entities/link-layer/LinkLayerWidget.js");
class LinkLayerFactory extends react_canvas_core_1.AbstractReactFactory {
    constructor() {
        super('diagram-links');
    }
    generateModel(event) {
        return new LinkLayerModel_1.LinkLayerModel();
    }
    generateReactWidget(event) {
        return React.createElement(LinkLayerWidget_1.LinkLayerWidget, { layer: event.model, engine: this.engine });
    }
}
exports.LinkLayerFactory = LinkLayerFactory;


/***/ }),

/***/ "./dist/entities/link-layer/LinkLayerModel.js":
/*!****************************************************!*\
  !*** ./dist/entities/link-layer/LinkLayerModel.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinkLayerModel = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const LinkModel_1 = __webpack_require__(/*! ../link/LinkModel */ "./dist/entities/link/LinkModel.js");
class LinkLayerModel extends react_canvas_core_1.LayerModel {
    constructor() {
        super({
            type: 'diagram-links',
            isSvg: true,
            transformed: true
        });
    }
    addModel(model) {
        if (!(model instanceof LinkModel_1.LinkModel)) {
            throw new Error('Can only add links to this layer');
        }
        model.registerListener({
            entityRemoved: () => {
                this.getParent().removeLink(model);
            }
        });
        super.addModel(model);
    }
    getLinks() {
        return this.getModels();
    }
    getChildModelFactoryBank(engine) {
        return engine.getLinkFactories();
    }
}
exports.LinkLayerModel = LinkLayerModel;


/***/ }),

/***/ "./dist/entities/link-layer/LinkLayerWidget.js":
/*!*****************************************************!*\
  !*** ./dist/entities/link-layer/LinkLayerWidget.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinkLayerWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
const _ = __webpack_require__(/*! lodash */ "lodash");
const LinkWidget_1 = __webpack_require__(/*! ../link/LinkWidget */ "./dist/entities/link/LinkWidget.js");
var S;
(function (S) {
    S.Container = styled_1.default.div ``;
})(S || (S = {}));
class LinkLayerWidget extends React.Component {
    render() {
        return (React.createElement(React.Fragment, null, 
        //only perform these actions when we have a diagram
        _.map(this.props.layer.getLinks(), (link) => {
            return React.createElement(LinkWidget_1.LinkWidget, { key: link.getID(), link: link, diagramEngine: this.props.engine });
        })));
    }
}
exports.LinkLayerWidget = LinkLayerWidget;


/***/ }),

/***/ "./dist/entities/link/LinkModel.js":
/*!*****************************************!*\
  !*** ./dist/entities/link/LinkModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinkModel = void 0;
const PointModel_1 = __webpack_require__(/*! ./PointModel */ "./dist/entities/link/PointModel.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class LinkModel extends react_canvas_core_1.BaseModel {
    constructor(options) {
        super(options);
        this.points = [
            new PointModel_1.PointModel({
                link: this
            }),
            new PointModel_1.PointModel({
                link: this
            })
        ];
        this.sourcePort = null;
        this.targetPort = null;
        this.renderedPaths = [];
        this.labels = [];
    }
    getBoundingBox() {
        return geometry_1.Polygon.boundingBoxFromPoints(_.map(this.points, (point) => {
            return point.getPosition();
        }));
    }
    getSelectionEntities() {
        if (this.getTargetPort() && this.getSourcePort()) {
            return super.getSelectionEntities().concat(_.slice(this.points, 1, this.points.length - 1));
        }
        // allow selection of the first point
        if (!this.getSourcePort()) {
            return super.getSelectionEntities().concat(_.slice(this.points, 0, this.points.length - 1));
        }
        // allow selection of the last point
        if (!this.getTargetPort()) {
            return super.getSelectionEntities().concat(_.slice(this.points, 1, this.points.length));
        }
        return super.getSelectionEntities().concat(this.points);
    }
    deserialize(event) {
        super.deserialize(event);
        this.points = _.map(event.data.points || [], (point) => {
            var p = new PointModel_1.PointModel({
                link: this,
                position: new geometry_1.Point(point.x, point.y)
            });
            p.deserialize(Object.assign(Object.assign({}, event), { data: point }));
            return p;
        });
        //deserialize labels
        _.forEach(event.data.labels || [], (label) => {
            let labelOb = event.engine.getFactoryForLabel(label.type).generateModel({});
            labelOb.deserialize(Object.assign(Object.assign({}, event), { data: label }));
            this.addLabel(labelOb);
        });
        // these happen async, so we use the promises for these (they need to be done like this without the async keyword
        // because we need the deserailize method to finish for other methods while this happen
        if (event.data.target) {
            event.getModel(event.data.targetPort).then((model) => {
                this.setTargetPort(model);
            });
        }
        if (event.data.source) {
            event.getModel(event.data.sourcePort).then((model) => {
                this.setSourcePort(model);
            });
        }
    }
    getRenderedPath() {
        return this.renderedPaths;
    }
    setRenderedPaths(paths) {
        this.renderedPaths = paths;
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { source: this.sourcePort ? this.sourcePort.getParent().getID() : null, sourcePort: this.sourcePort ? this.sourcePort.getID() : null, target: this.targetPort ? this.targetPort.getParent().getID() : null, targetPort: this.targetPort ? this.targetPort.getID() : null, points: _.map(this.points, (point) => {
                return point.serialize();
            }), labels: _.map(this.labels, (label) => {
                return label.serialize();
            }) });
    }
    doClone(lookupTable = {}, clone) {
        clone.setPoints(_.map(this.getPoints(), (point) => {
            return point.clone(lookupTable);
        }));
        if (this.sourcePort) {
            clone.setSourcePort(this.sourcePort.clone(lookupTable));
        }
        if (this.targetPort) {
            clone.setTargetPort(this.targetPort.clone(lookupTable));
        }
    }
    clearPort(port) {
        if (this.sourcePort === port) {
            this.setSourcePort(null);
        }
        else if (this.targetPort === port) {
            this.setTargetPort(null);
        }
    }
    remove() {
        if (this.sourcePort) {
            this.sourcePort.removeLink(this);
        }
        if (this.targetPort) {
            this.targetPort.removeLink(this);
        }
        super.remove();
    }
    isLastPoint(point) {
        var index = this.getPointIndex(point);
        return index === this.points.length - 1;
    }
    getPointIndex(point) {
        return this.points.indexOf(point);
    }
    getPointModel(id) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].getID() === id) {
                return this.points[i];
            }
        }
        return null;
    }
    getPortForPoint(point) {
        if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
            return this.sourcePort;
        }
        if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
            return this.targetPort;
        }
        return null;
    }
    getPointForPort(port) {
        if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
            return this.getFirstPoint();
        }
        if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
            return this.getLastPoint();
        }
        return null;
    }
    getFirstPoint() {
        return this.points[0];
    }
    getLastPoint() {
        return this.points[this.points.length - 1];
    }
    setSourcePort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.sourcePort !== null) {
            this.sourcePort.removeLink(this);
        }
        this.sourcePort = port;
        this.fireEvent({ port }, 'sourcePortChanged');
        if (port.reportedPosition) {
            this.getPointForPort(port).setPosition(port.getCenter());
        }
    }
    getSourcePort() {
        return this.sourcePort;
    }
    getTargetPort() {
        return this.targetPort;
    }
    setTargetPort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.targetPort !== null) {
            this.targetPort.removeLink(this);
        }
        this.targetPort = port;
        this.fireEvent({ port }, 'targetPortChanged');
        if (port.reportedPosition) {
            this.getPointForPort(port).setPosition(port.getCenter());
        }
    }
    point(x, y, index = 1) {
        return this.addPoint(this.generatePoint(x, y), index);
    }
    addLabel(label) {
        label.setParent(this);
        this.labels.push(label);
    }
    getPoints() {
        return this.points;
    }
    getLabels() {
        return this.labels;
    }
    setPoints(points) {
        _.forEach(points, (point) => {
            point.setParent(this);
        });
        this.points = points;
    }
    removePoint(pointModel) {
        this.points.splice(this.getPointIndex(pointModel), 1);
    }
    removePointsBefore(pointModel) {
        this.points.splice(0, this.getPointIndex(pointModel));
    }
    removePointsAfter(pointModel) {
        this.points.splice(this.getPointIndex(pointModel) + 1);
    }
    removeMiddlePoints() {
        if (this.points.length > 2) {
            this.points.splice(0, this.points.length - 2);
        }
    }
    addPoint(pointModel, index = 1) {
        pointModel.setParent(this);
        this.points.splice(index, 0, pointModel);
        return pointModel;
    }
    generatePoint(x = 0, y = 0) {
        return new PointModel_1.PointModel({
            link: this,
            position: new geometry_1.Point(x, y)
        });
    }
}
exports.LinkModel = LinkModel;


/***/ }),

/***/ "./dist/entities/link/LinkWidget.js":
/*!******************************************!*\
  !*** ./dist/entities/link/LinkWidget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinkWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const LabelWidget_1 = __webpack_require__(/*! ../label/LabelWidget */ "./dist/entities/label/LabelWidget.js");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class LinkWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourcePort: null,
            targetPort: null
        };
    }
    componentWillUnmount() {
        if (this.sourceListener) {
            this.sourceListener.deregister();
        }
        if (this.targetListener) {
            this.targetListener.deregister();
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            sourcePort: nextProps.link.getSourcePort(),
            targetPort: nextProps.link.getTargetPort()
        };
    }
    installTarget() {
        this.targetListener && this.targetListener.deregister();
        if (!this.props.link.getTargetPort())
            return;
        this.targetListener = this.props.link.getTargetPort().registerListener({
            reportInitialPosition: (event) => {
                this.forceUpdate();
            }
        });
    }
    installSource() {
        this.sourceListener && this.sourceListener.deregister();
        if (!this.props.link.getSourcePort())
            return;
        this.sourceListener = this.props.link.getSourcePort().registerListener({
            reportInitialPosition: (event) => {
                this.forceUpdate();
            }
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.sourcePort !== this.state.sourcePort) {
            this.installSource();
        }
        if (prevState.targetPort !== this.state.targetPort) {
            this.installTarget();
        }
    }
    static generateLinePath(firstPoint, lastPoint) {
        return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
    }
    componentDidMount() {
        if (this.props.link.getSourcePort()) {
            this.installSource();
        }
        if (this.props.link.getTargetPort()) {
            this.installTarget();
        }
    }
    render() {
        const { link } = this.props;
        // only draw the link when we have reported positions
        if (link.getSourcePort() && !link.getSourcePort().reportedPosition) {
            return null;
        }
        if (link.getTargetPort() && !link.getTargetPort().reportedPosition) {
            return null;
        }
        //generate links
        return (React.createElement(react_canvas_core_1.PeformanceWidget, { model: this.props.link, serialized: this.props.link.serialize() }, () => {
            return (React.createElement("g", { "data-linkid": this.props.link.getID() },
                this.props.diagramEngine.generateWidgetForLink(link),
                _.map(this.props.link.getLabels(), (labelModel, index) => {
                    return (React.createElement(LabelWidget_1.LabelWidget, { key: labelModel.getID(), engine: this.props.diagramEngine, label: labelModel, index: index }));
                })));
        }));
    }
}
exports.LinkWidget = LinkWidget;


/***/ }),

/***/ "./dist/entities/link/PointModel.js":
/*!******************************************!*\
  !*** ./dist/entities/link/PointModel.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointModel = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class PointModel extends react_canvas_core_1.BasePositionModel {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { type: 'point' }));
        this.parent = options.link;
    }
    isConnectedToPort() {
        return this.parent.getPortForPoint(this) !== null;
    }
    getLink() {
        return this.getParent();
    }
    remove() {
        //clear references
        if (this.parent) {
            this.parent.removePoint(this);
        }
        super.remove();
    }
    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}
exports.PointModel = PointModel;


/***/ }),

/***/ "./dist/entities/node-layer/NodeLayerFactory.js":
/*!******************************************************!*\
  !*** ./dist/entities/node-layer/NodeLayerFactory.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeLayerFactory = void 0;
const React = __webpack_require__(/*! react */ "react");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const NodeLayerModel_1 = __webpack_require__(/*! ./NodeLayerModel */ "./dist/entities/node-layer/NodeLayerModel.js");
const NodeLayerWidget_1 = __webpack_require__(/*! ./NodeLayerWidget */ "./dist/entities/node-layer/NodeLayerWidget.js");
class NodeLayerFactory extends react_canvas_core_1.AbstractReactFactory {
    constructor() {
        super('diagram-nodes');
    }
    generateModel(event) {
        return new NodeLayerModel_1.NodeLayerModel();
    }
    generateReactWidget(event) {
        return React.createElement(NodeLayerWidget_1.NodeLayerWidget, { layer: event.model, engine: this.engine });
    }
}
exports.NodeLayerFactory = NodeLayerFactory;


/***/ }),

/***/ "./dist/entities/node-layer/NodeLayerModel.js":
/*!****************************************************!*\
  !*** ./dist/entities/node-layer/NodeLayerModel.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeLayerModel = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const NodeModel_1 = __webpack_require__(/*! ../node/NodeModel */ "./dist/entities/node/NodeModel.js");
class NodeLayerModel extends react_canvas_core_1.LayerModel {
    constructor() {
        super({
            type: 'diagram-nodes',
            isSvg: false,
            transformed: true
        });
    }
    addModel(model) {
        if (!(model instanceof NodeModel_1.NodeModel)) {
            throw new Error('Can only add nodes to this layer');
        }
        model.registerListener({
            entityRemoved: () => {
                this.getParent().removeNode(model);
            }
        });
        super.addModel(model);
    }
    getChildModelFactoryBank(engine) {
        return engine.getNodeFactories();
    }
    getNodes() {
        return this.getModels();
    }
}
exports.NodeLayerModel = NodeLayerModel;


/***/ }),

/***/ "./dist/entities/node-layer/NodeLayerWidget.js":
/*!*****************************************************!*\
  !*** ./dist/entities/node-layer/NodeLayerWidget.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeLayerWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
const _ = __webpack_require__(/*! lodash */ "lodash");
const NodeWidget_1 = __webpack_require__(/*! ../node/NodeWidget */ "./dist/entities/node/NodeWidget.js");
var S;
(function (S) {
    S.Container = styled_1.default.div ``;
})(S || (S = {}));
class NodeLayerWidget extends React.Component {
    render() {
        return (React.createElement(React.Fragment, null, _.map(this.props.layer.getNodes(), (node) => {
            return React.createElement(NodeWidget_1.NodeWidget, { key: node.getID(), diagramEngine: this.props.engine, node: node });
        })));
    }
}
exports.NodeLayerWidget = NodeLayerWidget;


/***/ }),

/***/ "./dist/entities/node/NodeModel.js":
/*!*****************************************!*\
  !*** ./dist/entities/node/NodeModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeModel = void 0;
const _ = __webpack_require__(/*! lodash */ "lodash");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class NodeModel extends react_canvas_core_1.BasePositionModel {
    constructor(options) {
        super(options);
        this.ports = {};
        this.width = 0;
        this.height = 0;
    }
    getBoundingBox() {
        return new geometry_1.Rectangle(this.getPosition(), this.width, this.height);
    }
    setPosition(x, y) {
        let old = this.position;
        super.setPosition(x, y);
        //also update the port co-ordinates (for make glorious speed)
        _.forEach(this.ports, (port) => {
            port.setPosition(port.getX() + x - old.x, port.getY() + y - old.y);
        });
    }
    deserialize(event) {
        super.deserialize(event);
        //deserialize ports
        _.forEach(event.data.ports, (port) => {
            let portOb = event.engine.getFactoryForPort(port.type).generateModel({});
            portOb.deserialize(Object.assign(Object.assign({}, event), { data: port }));
            // the links need these
            event.registerModel(portOb);
            this.addPort(portOb);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { ports: _.map(this.ports, (port) => {
                return port.serialize();
            }) });
    }
    doClone(lookupTable = {}, clone) {
        // also clone the ports
        clone.ports = {};
        _.forEach(this.ports, (port) => {
            clone.addPort(port.clone(lookupTable));
        });
    }
    remove() {
        super.remove();
        _.forEach(this.ports, (port) => {
            _.forEach(port.getLinks(), (link) => {
                link.remove();
            });
        });
    }
    getPortFromID(id) {
        for (var i in this.ports) {
            if (this.ports[i].getID() === id) {
                return this.ports[i];
            }
        }
        return null;
    }
    getLink(id) {
        for (let portID in this.ports) {
            const links = this.ports[portID].getLinks();
            if (links[id]) {
                return links[id];
            }
        }
    }
    getPort(name) {
        return this.ports[name];
    }
    getPorts() {
        return this.ports;
    }
    removePort(port) {
        // clear the port from the links
        for (let link of _.values(port.getLinks())) {
            link.clearPort(port);
        }
        //clear the parent node reference
        if (this.ports[port.getName()]) {
            this.ports[port.getName()].setParent(null);
            delete this.ports[port.getName()];
        }
    }
    addPort(port) {
        port.setParent(this);
        this.ports[port.getName()] = port;
        return port;
    }
    updateDimensions({ width, height }) {
        this.width = width;
        this.height = height;
    }
}
exports.NodeModel = NodeModel;


/***/ }),

/***/ "./dist/entities/node/NodeWidget.js":
/*!******************************************!*\
  !*** ./dist/entities/node/NodeWidget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
const resize_observer_polyfill_1 = __webpack_require__(/*! resize-observer-polyfill */ "resize-observer-polyfill");
var S;
(function (S) {
    S.Node = styled_1.default.div `
		position: absolute;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		user-select: none;
		cursor: move;
		pointer-events: all;
	`;
})(S || (S = {}));
class NodeWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    componentWillUnmount() {
        var _a;
        this.ob.disconnect();
        this.ob = null;
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.deregister();
        this.listener = null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.listener && this.props.node !== prevProps.node) {
            this.listener.deregister();
            this.installSelectionListener();
        }
    }
    installSelectionListener() {
        this.listener = this.props.node.registerListener({
            selectionChanged: (event) => {
                this.forceUpdate();
            }
        });
    }
    updateSize(width, height) {
        this.props.node.updateDimensions({ width, height });
        //now mark the links as dirty
        try {
            _.forEach(this.props.node.getPorts(), (port) => {
                port.updateCoords(this.props.diagramEngine.getPortCoords(port));
            });
        }
        catch (ex) { }
    }
    componentDidMount() {
        // @ts-ignore
        this.ob = new resize_observer_polyfill_1.default((entities) => {
            const bounds = entities[0].contentRect;
            this.updateSize(bounds.width, bounds.height);
        });
        const b = this.ref.current.getBoundingClientRect();
        this.updateSize(b.width, b.height);
        this.ob.observe(this.ref.current);
        this.installSelectionListener();
    }
    render() {
        return (React.createElement(react_canvas_core_1.PeformanceWidget, { model: this.props.node, serialized: this.props.node.serialize() }, () => {
            return (React.createElement(S.Node, { className: "node", ref: this.ref, "data-nodeid": this.props.node.getID(), style: {
                    top: this.props.node.getY(),
                    left: this.props.node.getX()
                } }, this.props.diagramEngine.generateWidgetForNode(this.props.node)));
        }));
    }
}
exports.NodeWidget = NodeWidget;


/***/ }),

/***/ "./dist/entities/port/PortModel.js":
/*!*****************************************!*\
  !*** ./dist/entities/port/PortModel.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortModel = exports.PortModelAlignment = void 0;
const _ = __webpack_require__(/*! lodash */ "lodash");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
var PortModelAlignment;
(function (PortModelAlignment) {
    PortModelAlignment["TOP"] = "top";
    PortModelAlignment["LEFT"] = "left";
    PortModelAlignment["BOTTOM"] = "bottom";
    PortModelAlignment["RIGHT"] = "right";
})(PortModelAlignment = exports.PortModelAlignment || (exports.PortModelAlignment = {}));
class PortModel extends react_canvas_core_1.BasePositionModel {
    constructor(options) {
        super(options);
        this.links = {};
        this.reportedPosition = false;
    }
    deserialize(event) {
        super.deserialize(event);
        this.reportedPosition = false;
        this.options.name = event.data.name;
        this.options.alignment = event.data.alignment;
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { name: this.options.name, alignment: this.options.alignment, parentNode: this.parent.getID(), links: _.map(this.links, (link) => {
                return link.getID();
            }) });
    }
    setPosition(x, y) {
        let old = this.position;
        super.setPosition(x, y);
        _.forEach(this.getLinks(), (link) => {
            let point = link.getPointForPort(this);
            point.setPosition(point.getX() + x - old.x, point.getY() + y - old.y);
        });
    }
    doClone(lookupTable = {}, clone) {
        clone.links = {};
        clone.parentNode = this.getParent().clone(lookupTable);
    }
    getNode() {
        return this.getParent();
    }
    getName() {
        return this.options.name;
    }
    getMaximumLinks() {
        return this.options.maximumLinks;
    }
    setMaximumLinks(maximumLinks) {
        this.options.maximumLinks = maximumLinks;
    }
    removeLink(link) {
        delete this.links[link.getID()];
    }
    addLink(link) {
        this.links[link.getID()] = link;
    }
    getLinks() {
        return this.links;
    }
    createLinkModel() {
        if (_.isFinite(this.options.maximumLinks)) {
            var numberOfLinks = _.size(this.links);
            if (this.options.maximumLinks === 1 && numberOfLinks >= 1) {
                return _.values(this.links)[0];
            }
            else if (numberOfLinks >= this.options.maximumLinks) {
                return null;
            }
        }
        return null;
    }
    reportPosition() {
        _.forEach(this.getLinks(), (link) => {
            link.getPointForPort(this).setPosition(this.getCenter());
        });
        this.fireEvent({
            entity: this
        }, 'reportInitialPosition');
    }
    getCenter() {
        return new geometry_1.Point(this.getX() + this.width / 2, this.getY() + this.height / 2);
    }
    getBoundingBox() {
        return new geometry_1.Rectangle(this.position, this.width, this.height);
    }
    updateCoords(coords) {
        this.width = coords.getWidth();
        this.height = coords.getHeight();
        this.setPosition(coords.getTopLeft());
        this.reportedPosition = true;
        this.reportPosition();
    }
    canLinkToPort(port) {
        return true;
    }
    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}
exports.PortModel = PortModel;


/***/ }),

/***/ "./dist/entities/port/PortWidget.js":
/*!******************************************!*\
  !*** ./dist/entities/port/PortWidget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PortWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
class PortWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    report() {
        this.props.port.updateCoords(this.props.engine.getPortCoords(this.props.port, this.ref.current));
    }
    componentWillUnmount() {
        this.engineListenerHandle && this.engineListenerHandle.deregister();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.port.reportedPosition) {
            this.report();
        }
    }
    componentDidMount() {
        this.engineListenerHandle = this.props.engine.registerListener({
            canvasReady: () => {
                this.report();
            }
        });
        if (this.props.engine.getCanvas()) {
            this.report();
        }
    }
    getExtraProps() {
        if (react_canvas_core_1.Toolkit.TESTING) {
            const links = _.keys(this.props.port.getNode().getPort(this.props.port.getName()).links).join(',');
            return {
                'data-links': links
            };
        }
        return {};
    }
    render() {
        return (React.createElement("div", Object.assign({ style: this.props.style, ref: this.ref, className: `port ${this.props.className || ''}`, "data-name": this.props.port.getName(), "data-nodeid": this.props.port.getNode().getID() }, this.getExtraProps()), this.props.children));
    }
}
exports.PortWidget = PortWidget;


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
__exportStar(__webpack_require__(/*! ./models/DiagramModel */ "./dist/models/DiagramModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/label/LabelModel */ "./dist/entities/label/LabelModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link/LinkModel */ "./dist/entities/link/LinkModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link/PointModel */ "./dist/entities/link/PointModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link/LinkWidget */ "./dist/entities/link/LinkWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link-layer/LinkLayerModel */ "./dist/entities/link-layer/LinkLayerModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link-layer/LinkLayerWidget */ "./dist/entities/link-layer/LinkLayerWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/link-layer/LinkLayerFactory */ "./dist/entities/link-layer/LinkLayerFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/node-layer/NodeLayerModel */ "./dist/entities/node-layer/NodeLayerModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/node-layer/NodeLayerWidget */ "./dist/entities/node-layer/NodeLayerWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/node-layer/NodeLayerFactory */ "./dist/entities/node-layer/NodeLayerFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/node/NodeModel */ "./dist/entities/node/NodeModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/node/NodeWidget */ "./dist/entities/node/NodeWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/port/PortModel */ "./dist/entities/port/PortModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/port/PortWidget */ "./dist/entities/port/PortWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./states/DefaultDiagramState */ "./dist/states/DefaultDiagramState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/DragDiagramItemsState */ "./dist/states/DragDiagramItemsState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/DragNewLinkState */ "./dist/states/DragNewLinkState.js"), exports);
__exportStar(__webpack_require__(/*! ./DiagramEngine */ "./dist/DiagramEngine.js"), exports);


/***/ }),

/***/ "./dist/models/DiagramModel.js":
/*!*************************************!*\
  !*** ./dist/models/DiagramModel.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiagramModel = void 0;
const _ = __webpack_require__(/*! lodash */ "lodash");
const LinkModel_1 = __webpack_require__(/*! ../entities/link/LinkModel */ "./dist/entities/link/LinkModel.js");
const NodeModel_1 = __webpack_require__(/*! ../entities/node/NodeModel */ "./dist/entities/node/NodeModel.js");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const NodeLayerModel_1 = __webpack_require__(/*! ../entities/node-layer/NodeLayerModel */ "./dist/entities/node-layer/NodeLayerModel.js");
const LinkLayerModel_1 = __webpack_require__(/*! ../entities/link-layer/LinkLayerModel */ "./dist/entities/link-layer/LinkLayerModel.js");
class DiagramModel extends react_canvas_core_1.CanvasModel {
    constructor(options = {}) {
        super(options);
        this.addLayer(new LinkLayerModel_1.LinkLayerModel());
        this.addLayer(new NodeLayerModel_1.NodeLayerModel());
    }
    deserialize(event) {
        this.layers = [];
        super.deserialize(event);
    }
    addLayer(layer) {
        super.addLayer(layer);
        if (layer instanceof NodeLayerModel_1.NodeLayerModel) {
            this.activeNodeLayer = layer;
        }
        if (layer instanceof LinkLayerModel_1.LinkLayerModel) {
            this.activeLinkLayer = layer;
        }
    }
    getLinkLayers() {
        return _.filter(this.layers, (layer) => {
            return layer instanceof LinkLayerModel_1.LinkLayerModel;
        });
    }
    getNodeLayers() {
        return _.filter(this.layers, (layer) => {
            return layer instanceof NodeLayerModel_1.NodeLayerModel;
        });
    }
    getActiveNodeLayer() {
        if (!this.activeNodeLayer) {
            const layers = this.getNodeLayers();
            if (layers.length === 0) {
                this.addLayer(new NodeLayerModel_1.NodeLayerModel());
            }
            else {
                this.activeNodeLayer = layers[0];
            }
        }
        return this.activeNodeLayer;
    }
    getActiveLinkLayer() {
        if (!this.activeLinkLayer) {
            const layers = this.getLinkLayers();
            if (layers.length === 0) {
                this.addLayer(new LinkLayerModel_1.LinkLayerModel());
            }
            else {
                this.activeLinkLayer = layers[0];
            }
        }
        return this.activeLinkLayer;
    }
    getNode(node) {
        for (const layer of this.getNodeLayers()) {
            const model = layer.getModel(node);
            if (model) {
                return model;
            }
        }
    }
    getLink(link) {
        for (const layer of this.getLinkLayers()) {
            const model = layer.getModel(link);
            if (model) {
                return model;
            }
        }
    }
    addAll(...models) {
        _.forEach(models, (model) => {
            if (model instanceof LinkModel_1.LinkModel) {
                this.addLink(model);
            }
            else if (model instanceof NodeModel_1.NodeModel) {
                this.addNode(model);
            }
        });
        return models;
    }
    addLink(link) {
        this.getActiveLinkLayer().addModel(link);
        this.fireEvent({
            link,
            isCreated: true
        }, 'linksUpdated');
        return link;
    }
    addNode(node) {
        this.getActiveNodeLayer().addModel(node);
        this.fireEvent({ node, isCreated: true }, 'nodesUpdated');
        return node;
    }
    removeLink(link) {
        const removed = _.some(this.getLinkLayers(), (layer) => {
            return layer.removeModel(link);
        });
        if (removed) {
            this.fireEvent({ link, isCreated: false }, 'linksUpdated');
        }
    }
    removeNode(node) {
        const removed = _.some(this.getNodeLayers(), (layer) => {
            return layer.removeModel(node);
        });
        if (removed) {
            this.fireEvent({ node, isCreated: false }, 'nodesUpdated');
        }
    }
    getLinks() {
        return _.flatMap(this.getLinkLayers(), (layer) => {
            return _.values(layer.getModels());
        });
    }
    getNodes() {
        return _.flatMap(this.getNodeLayers(), (layer) => {
            return _.values(layer.getModels());
        });
    }
}
exports.DiagramModel = DiagramModel;


/***/ }),

/***/ "./dist/states/DefaultDiagramState.js":
/*!********************************************!*\
  !*** ./dist/states/DefaultDiagramState.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultDiagramState = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const PortModel_1 = __webpack_require__(/*! ../entities/port/PortModel */ "./dist/entities/port/PortModel.js");
const DragNewLinkState_1 = __webpack_require__(/*! ./DragNewLinkState */ "./dist/states/DragNewLinkState.js");
const DragDiagramItemsState_1 = __webpack_require__(/*! ./DragDiagramItemsState */ "./dist/states/DragDiagramItemsState.js");
class DefaultDiagramState extends react_canvas_core_1.State {
    constructor() {
        super({
            name: 'default-diagrams'
        });
        this.childStates = [new react_canvas_core_1.SelectingState()];
        this.dragCanvas = new react_canvas_core_1.DragCanvasState();
        this.dragNewLink = new DragNewLinkState_1.DragNewLinkState();
        this.dragItems = new DragDiagramItemsState_1.DragDiagramItemsState();
        // determine what was clicked on
        this.registerAction(new react_canvas_core_1.Action({
            type: react_canvas_core_1.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                // the canvas was clicked on, transition to the dragging canvas state
                if (!element) {
                    this.transitionWithEvent(this.dragCanvas, event);
                }
                // initiate dragging a new link
                else if (element instanceof PortModel_1.PortModel) {
                    this.transitionWithEvent(this.dragNewLink, event);
                }
                // move the items (and potentially link points)
                else {
                    this.transitionWithEvent(this.dragItems, event);
                }
            }
        }));
    }
}
exports.DefaultDiagramState = DefaultDiagramState;


/***/ }),

/***/ "./dist/states/DragDiagramItemsState.js":
/*!**********************************************!*\
  !*** ./dist/states/DragDiagramItemsState.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DragDiagramItemsState = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const _ = __webpack_require__(/*! lodash */ "lodash");
const PointModel_1 = __webpack_require__(/*! ../entities/link/PointModel */ "./dist/entities/link/PointModel.js");
const PortModel_1 = __webpack_require__(/*! ../entities/port/PortModel */ "./dist/entities/port/PortModel.js");
class DragDiagramItemsState extends react_canvas_core_1.MoveItemsState {
    constructor() {
        super();
        this.registerAction(new react_canvas_core_1.Action({
            type: react_canvas_core_1.InputType.MOUSE_UP,
            fire: (event) => {
                const item = this.engine.getMouseElement(event.event);
                if (item instanceof PortModel_1.PortModel) {
                    _.forEach(this.initialPositions, (position) => {
                        if (position.item instanceof PointModel_1.PointModel) {
                            const link = position.item.getParent();
                            // only care about the last links
                            if (link.getLastPoint() !== position.item) {
                                return;
                            }
                            if (link.getSourcePort().canLinkToPort(item)) {
                                link.setTargetPort(item);
                                item.reportPosition();
                                this.engine.repaintCanvas();
                            }
                        }
                    });
                }
            }
        }));
    }
}
exports.DragDiagramItemsState = DragDiagramItemsState;


/***/ }),

/***/ "./dist/states/DragNewLinkState.js":
/*!*****************************************!*\
  !*** ./dist/states/DragNewLinkState.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DragNewLinkState = void 0;
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
const PortModel_1 = __webpack_require__(/*! ../entities/port/PortModel */ "./dist/entities/port/PortModel.js");
class DragNewLinkState extends react_canvas_core_1.AbstractDisplacementState {
    constructor(options = {}) {
        super({ name: 'drag-new-link' });
        this.config = Object.assign({ allowLooseLinks: true, allowLinksFromLockedPorts: false }, options);
        this.registerAction(new react_canvas_core_1.Action({
            type: react_canvas_core_1.InputType.MOUSE_DOWN,
            fire: (event) => {
                this.port = this.engine.getMouseElement(event.event);
                if (!this.config.allowLinksFromLockedPorts && this.port.isLocked()) {
                    this.eject();
                    return;
                }
                this.link = this.port.createLinkModel();
                // if no link is given, just eject the state
                if (!this.link) {
                    this.eject();
                    return;
                }
                this.link.setSelected(true);
                this.link.setSourcePort(this.port);
                this.engine.getModel().addLink(this.link);
                this.port.reportPosition();
            }
        }));
        this.registerAction(new react_canvas_core_1.Action({
            type: react_canvas_core_1.InputType.MOUSE_UP,
            fire: (event) => {
                const model = this.engine.getMouseElement(event.event);
                // check to see if we connected to a new port
                if (model instanceof PortModel_1.PortModel) {
                    if (this.port.canLinkToPort(model)) {
                        this.link.setTargetPort(model);
                        model.reportPosition();
                        this.engine.repaintCanvas();
                        return;
                    }
                    else {
                        this.link.remove();
                        this.engine.repaintCanvas();
                        return;
                    }
                }
                if (!this.config.allowLooseLinks) {
                    this.link.remove();
                    this.engine.repaintCanvas();
                }
            }
        }));
    }
    /**
     * Calculates the link's far-end point position on mouse move.
     * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
     * as the possible engine offset
     */
    fireMouseMoved(event) {
        const portPos = this.port.getPosition();
        const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
        const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
        const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
        const initialXRelative = this.initialXRelative / zoomLevelPercentage;
        const initialYRelative = this.initialYRelative / zoomLevelPercentage;
        const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + event.virtualDisplacementX;
        const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + event.virtualDisplacementY;
        this.link.getLastPoint().setPosition(linkNextX, linkNextY);
        this.engine.repaintCanvas();
    }
}
exports.DragNewLinkState = DragNewLinkState;


/***/ }),

/***/ "@emotion/styled":
/*!**********************************!*\
  !*** external "@emotion/styled" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@emotion/styled");;

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

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");;

/***/ }),

/***/ "resize-observer-polyfill":
/*!*******************************************!*\
  !*** external "resize-observer-polyfill" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("resize-observer-polyfill");;

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