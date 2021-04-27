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

/***/ "./dist/CanvasEngine.js":
/*!******************************!*\
  !*** ./dist/CanvasEngine.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CanvasEngine = void 0;
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const FactoryBank_1 = __webpack_require__(/*! ./core/FactoryBank */ "./dist/core/FactoryBank.js");
const BaseObserver_1 = __webpack_require__(/*! ./core/BaseObserver */ "./dist/core/BaseObserver.js");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
const ActionEventBus_1 = __webpack_require__(/*! ./core-actions/ActionEventBus */ "./dist/core-actions/ActionEventBus.js");
const ZoomCanvasAction_1 = __webpack_require__(/*! ./actions/ZoomCanvasAction */ "./dist/actions/ZoomCanvasAction.js");
const DeleteItemsAction_1 = __webpack_require__(/*! ./actions/DeleteItemsAction */ "./dist/actions/DeleteItemsAction.js");
const StateMachine_1 = __webpack_require__(/*! ./core-state/StateMachine */ "./dist/core-state/StateMachine.js");
class CanvasEngine extends BaseObserver_1.BaseObserver {
    constructor(options = {}) {
        super();
        this.model = null;
        this.eventBus = new ActionEventBus_1.ActionEventBus(this);
        this.stateMachine = new StateMachine_1.StateMachine(this);
        this.layerFactories = new FactoryBank_1.FactoryBank();
        this.registerFactoryBank(this.layerFactories);
        /**
         * Overrides the standard options with the possible given options
         */
        this.options = Object.assign({ registerDefaultDeleteItemsAction: true, registerDefaultZoomCanvasAction: true, repaintDebounceMs: 0 }, options);
        if (this.options.registerDefaultZoomCanvasAction === true) {
            this.eventBus.registerAction(new ZoomCanvasAction_1.ZoomCanvasAction());
        }
        if (this.options.registerDefaultDeleteItemsAction === true) {
            this.eventBus.registerAction(new DeleteItemsAction_1.DeleteItemsAction());
        }
    }
    getStateMachine() {
        return this.stateMachine;
    }
    getRelativeMousePoint(event) {
        const point = this.getRelativePoint(event.clientX, event.clientY);
        return new geometry_1.Point((point.x - this.model.getOffsetX()) / (this.model.getZoomLevel() / 100.0), (point.y - this.model.getOffsetY()) / (this.model.getZoomLevel() / 100.0));
    }
    getRelativePoint(x, y) {
        const canvasRect = this.canvas.getBoundingClientRect();
        return new geometry_1.Point(x - canvasRect.left, y - canvasRect.top);
    }
    registerFactoryBank(factory) {
        factory.registerListener({
            factoryAdded: (event) => {
                event.factory.setDiagramEngine(this);
            },
            factoryRemoved: (event) => {
                event.factory.setDiagramEngine(null);
            }
        });
    }
    getActionEventBus() {
        return this.eventBus;
    }
    getLayerFactories() {
        return this.layerFactories;
    }
    getFactoryForLayer(layer) {
        if (typeof layer === 'string') {
            return this.layerFactories.getFactory(layer);
        }
        return this.layerFactories.getFactory(layer.getType());
    }
    setModel(model) {
        this.model = model;
        if (this.canvas) {
            requestAnimationFrame(() => {
                this.repaintCanvas();
            });
        }
    }
    getModel() {
        return this.model;
    }
    repaintCanvas(promise) {
        const { repaintDebounceMs } = this.options;
        /**
         * The actual repaint function
         */
        const repaint = () => {
            this.iterateListeners((listener) => {
                if (listener.repaintCanvas) {
                    listener.repaintCanvas();
                }
            });
        };
        // if the `repaintDebounceMs` option is > 0, then apply the debounce
        let repaintFn = repaint;
        if (repaintDebounceMs > 0) {
            repaintFn = lodash_1.debounce(repaint, repaintDebounceMs);
        }
        if (promise) {
            return new Promise((resolve) => {
                const l = this.registerListener({
                    rendered: () => {
                        resolve();
                        l.deregister();
                    }
                });
                repaintFn();
            });
        }
        repaintFn();
    }
    setCanvas(canvas) {
        if (this.canvas !== canvas) {
            this.canvas = canvas;
            if (canvas) {
                this.fireEvent({}, 'canvasReady');
            }
        }
    }
    getCanvas() {
        return this.canvas;
    }
    getMouseElement(event) {
        return null;
    }
    zoomToFit() {
        const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
        const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
        const zoomFactor = xFactor < yFactor ? xFactor : yFactor;
        this.model.setZoomLevel(this.model.getZoomLevel() * zoomFactor);
        this.model.setOffset(0, 0);
        this.repaintCanvas();
    }
}
exports.CanvasEngine = CanvasEngine;


/***/ }),

/***/ "./dist/Toolkit.js":
/*!*************************!*\
  !*** ./dist/Toolkit.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Toolkit = void 0;
const closest = __webpack_require__(/*! closest */ "closest");
class Toolkit {
    /**
     * Generats a unique ID (thanks Stack overflow :3)
     * @returns {String}
     */
    static UID() {
        if (Toolkit.TESTING) {
            Toolkit.TESTING_UID++;
            return `${Toolkit.TESTING_UID}`;
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * Finds the closest element as a polyfill
     */
    static closest(element, selector) {
        if (document.body.closest) {
            return element.closest(selector);
        }
        return closest(element, selector);
    }
}
exports.Toolkit = Toolkit;
Toolkit.TESTING = false;
Toolkit.TESTING_UID = 0;


/***/ }),

/***/ "./dist/actions/DeleteItemsAction.js":
/*!*******************************************!*\
  !*** ./dist/actions/DeleteItemsAction.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteItemsAction = void 0;
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
/**
 * Deletes all selected items
 */
class DeleteItemsAction extends Action_1.Action {
    constructor(options = {}) {
        const keyCodes = options.keyCodes || [46, 8];
        const modifiers = Object.assign({ ctrlKey: false, shiftKey: false, altKey: false, metaKey: false }, options.modifiers);
        super({
            type: Action_1.InputType.KEY_DOWN,
            fire: (event) => {
                const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;
                if (keyCodes.indexOf(keyCode) !== -1 && _.isEqual({ ctrlKey, shiftKey, altKey, metaKey }, modifiers)) {
                    _.forEach(this.engine.getModel().getSelectedEntities(), (model) => {
                        // only delete items which are not locked
                        if (!model.isLocked()) {
                            model.remove();
                        }
                    });
                    this.engine.repaintCanvas();
                }
            }
        });
    }
}
exports.DeleteItemsAction = DeleteItemsAction;


/***/ }),

/***/ "./dist/actions/ZoomCanvasAction.js":
/*!******************************************!*\
  !*** ./dist/actions/ZoomCanvasAction.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZoomCanvasAction = void 0;
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
class ZoomCanvasAction extends Action_1.Action {
    constructor(options = {}) {
        super({
            type: Action_1.InputType.MOUSE_WHEEL,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                // we can block layer rendering because we are only targeting the transforms
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(false);
                }
                const model = this.engine.getModel();
                event.stopPropagation();
                const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;
                let scrollDelta = options.inverseZoom ? -event.deltaY : event.deltaY;
                //check if it is pinch gesture
                if (event.ctrlKey && scrollDelta % 1 !== 0) {
                    /*
                        Chrome and Firefox sends wheel event with deltaY that
                        have fractional part, also `ctrlKey` prop of the event is true
                        though ctrl isn't pressed
                    */
                    scrollDelta /= 3;
                }
                else {
                    scrollDelta /= 60;
                }
                if (model.getZoomLevel() + scrollDelta > 10) {
                    model.setZoomLevel(model.getZoomLevel() + scrollDelta);
                }
                const zoomFactor = model.getZoomLevel() / 100;
                const boundingRect = event.currentTarget.getBoundingClientRect();
                const clientWidth = boundingRect.width;
                const clientHeight = boundingRect.height;
                // compute difference between rect before and after scroll
                const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                // compute mouse coords relative to canvas
                const clientX = event.clientX - boundingRect.left;
                const clientY = event.clientY - boundingRect.top;
                // compute width and height increment factor
                const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
                const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;
                model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
                this.engine.repaintCanvas();
                // re-enable rendering
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(true);
                }
            }
        });
    }
}
exports.ZoomCanvasAction = ZoomCanvasAction;


/***/ }),

/***/ "./dist/core-actions/Action.js":
/*!*************************************!*\
  !*** ./dist/core-actions/Action.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Action = exports.InputType = void 0;
const Toolkit_1 = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");
var InputType;
(function (InputType) {
    InputType["MOUSE_DOWN"] = "mouse-down";
    InputType["MOUSE_UP"] = "mouse-up";
    InputType["MOUSE_MOVE"] = "mouse-move";
    InputType["MOUSE_WHEEL"] = "mouse-wheel";
    InputType["KEY_DOWN"] = "key-down";
    InputType["KEY_UP"] = "key-up";
})(InputType = exports.InputType || (exports.InputType = {}));
class Action {
    constructor(options) {
        this.options = options;
        this.id = Toolkit_1.Toolkit.UID();
    }
    setEngine(engine) {
        this.engine = engine;
    }
}
exports.Action = Action;


/***/ }),

/***/ "./dist/core-actions/ActionEventBus.js":
/*!*********************************************!*\
  !*** ./dist/core-actions/ActionEventBus.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionEventBus = void 0;
const Action_1 = __webpack_require__(/*! ./Action */ "./dist/core-actions/Action.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
class ActionEventBus {
    constructor(engine) {
        this.actions = {};
        this.engine = engine;
        this.keys = {};
    }
    getKeys() {
        return _.keys(this.keys);
    }
    registerAction(action) {
        action.setEngine(this.engine);
        this.actions[action.id] = action;
        return () => {
            this.deregisterAction(action);
        };
    }
    deregisterAction(action) {
        action.setEngine(null);
        delete this.actions[action.id];
    }
    getActionsForType(type) {
        return _.filter(this.actions, (action) => {
            return action.options.type === type;
        });
    }
    getModelForEvent(actionEvent) {
        if (actionEvent.model) {
            return actionEvent.model;
        }
        return this.engine.getMouseElement(actionEvent.event);
    }
    getActionsForEvent(actionEvent) {
        const { event } = actionEvent;
        if (event.type === 'mousedown') {
            return this.getActionsForType(Action_1.InputType.MOUSE_DOWN);
        }
        else if (event.type === 'mouseup') {
            return this.getActionsForType(Action_1.InputType.MOUSE_UP);
        }
        else if (event.type === 'keydown') {
            // store the recorded key
            this.keys[event.key.toLowerCase()] = true;
            return this.getActionsForType(Action_1.InputType.KEY_DOWN);
        }
        else if (event.type === 'keyup') {
            // delete the recorded key
            delete this.keys[event.key.toLowerCase()];
            return this.getActionsForType(Action_1.InputType.KEY_UP);
        }
        else if (event.type === 'mousemove') {
            return this.getActionsForType(Action_1.InputType.MOUSE_MOVE);
        }
        else if (event.type === 'wheel') {
            return this.getActionsForType(Action_1.InputType.MOUSE_WHEEL);
        }
        return [];
    }
    fireAction(actionEvent) {
        const actions = this.getActionsForEvent(actionEvent);
        for (let action of actions) {
            action.options.fire(actionEvent);
        }
    }
}
exports.ActionEventBus = ActionEventBus;


/***/ }),

/***/ "./dist/core-models/BaseEntity.js":
/*!****************************************!*\
  !*** ./dist/core-models/BaseEntity.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseEntity = void 0;
const Toolkit_1 = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
const BaseObserver_1 = __webpack_require__(/*! ../core/BaseObserver */ "./dist/core/BaseObserver.js");
class BaseEntity extends BaseObserver_1.BaseObserver {
    constructor(options = {}) {
        super();
        this.options = Object.assign({ id: Toolkit_1.Toolkit.UID() }, options);
    }
    getOptions() {
        return this.options;
    }
    getID() {
        return this.options.id;
    }
    doClone(lookupTable = {}, clone) {
        /*noop*/
    }
    clone(lookupTable = {}) {
        // try and use an existing clone first
        if (lookupTable[this.options.id]) {
            return lookupTable[this.options.id];
        }
        let clone = _.cloneDeep(this);
        clone.options = Object.assign(Object.assign({}, this.options), { id: Toolkit_1.Toolkit.UID() });
        clone.clearListeners();
        lookupTable[this.options.id] = clone;
        this.doClone(lookupTable, clone);
        return clone;
    }
    clearListeners() {
        this.listeners = {};
    }
    deserialize(event) {
        this.options.id = event.data.id;
        this.options.locked = event.data.locked;
    }
    serialize() {
        return {
            id: this.options.id,
            locked: this.options.locked
        };
    }
    fireEvent(event, k) {
        super.fireEvent(Object.assign({ entity: this }, event), k);
    }
    isLocked() {
        return this.options.locked;
    }
    setLocked(locked = true) {
        this.options.locked = locked;
        this.fireEvent({
            locked: locked
        }, 'lockChanged');
    }
}
exports.BaseEntity = BaseEntity;


/***/ }),

/***/ "./dist/core-models/BaseModel.js":
/*!***************************************!*\
  !*** ./dist/core-models/BaseModel.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseModel = void 0;
const BaseEntity_1 = __webpack_require__(/*! ./BaseEntity */ "./dist/core-models/BaseEntity.js");
const CanvasModel_1 = __webpack_require__(/*! ../entities/canvas/CanvasModel */ "./dist/entities/canvas/CanvasModel.js");
class BaseModel extends BaseEntity_1.BaseEntity {
    constructor(options) {
        super(options);
    }
    performanceTune() {
        return true;
    }
    getParentCanvasModel() {
        if (!this.parent) {
            return null;
        }
        if (this.parent instanceof CanvasModel_1.CanvasModel) {
            return this.parent;
        }
        else if (this.parent instanceof BaseModel) {
            return this.parent.getParentCanvasModel();
        }
        return null;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getSelectionEntities() {
        return [this];
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { type: this.options.type, selected: this.options.selected, extras: this.options.extras });
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.extras = event.data.extras;
        this.options.selected = event.data.selected;
    }
    getType() {
        return this.options.type;
    }
    isSelected() {
        return this.options.selected;
    }
    isLocked() {
        const locked = super.isLocked();
        if (locked) {
            return true;
        }
        // delegate this call up to the parent
        if (this.parent) {
            return this.parent.isLocked();
        }
        return false;
    }
    setSelected(selected = true) {
        if (this.options.selected !== selected) {
            this.options.selected = selected;
            this.fireEvent({
                isSelected: selected
            }, 'selectionChanged');
        }
    }
    remove() {
        this.fireEvent({}, 'entityRemoved');
    }
}
exports.BaseModel = BaseModel;


/***/ }),

/***/ "./dist/core-models/BasePositionModel.js":
/*!***********************************************!*\
  !*** ./dist/core-models/BasePositionModel.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasePositionModel = void 0;
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./dist/core-models/BaseModel.js");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
class BasePositionModel extends BaseModel_1.BaseModel {
    constructor(options) {
        super(options);
        this.position = options.position || new geometry_1.Point(0, 0);
    }
    setPosition(x, y) {
        if (typeof x === 'object') {
            this.position = x;
        }
        else if (typeof x) {
            this.position = new geometry_1.Point(x, y);
        }
        this.fireEvent({}, 'positionChanged');
    }
    getBoundingBox() {
        return new geometry_1.Rectangle(this.position, 0, 0);
    }
    deserialize(event) {
        super.deserialize(event);
        this.position = new geometry_1.Point(event.data.x, event.data.y);
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { x: this.position.x, y: this.position.y });
    }
    getPosition() {
        return this.position;
    }
    getX() {
        return this.position.x;
    }
    getY() {
        return this.position.y;
    }
}
exports.BasePositionModel = BasePositionModel;


/***/ }),

/***/ "./dist/core-state/AbstractDisplacementState.js":
/*!******************************************************!*\
  !*** ./dist/core-state/AbstractDisplacementState.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractDisplacementState = void 0;
const State_1 = __webpack_require__(/*! ./State */ "./dist/core-state/State.js");
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
class AbstractDisplacementState extends State_1.State {
    constructor(options) {
        super(options);
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_DOWN,
            fire: (actionEvent) => {
                this.initialX = actionEvent.event.clientX;
                this.initialY = actionEvent.event.clientY;
                const rel = this.engine.getRelativePoint(actionEvent.event.clientX, actionEvent.event.clientY);
                this.initialXRelative = rel.x;
                this.initialYRelative = rel.y;
            }
        }));
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_MOVE,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                if (event.buttons === 0) {
                    // If buttons is 0, it means the mouse is not down, the user may have released it
                    // outside of the canvas, then we eject the state
                    this.eject();
                    return;
                }
                this.fireMouseMoved({
                    displacementX: event.clientX - this.initialX,
                    displacementY: event.clientY - this.initialY,
                    virtualDisplacementX: (event.clientX - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0),
                    virtualDisplacementY: (event.clientY - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0),
                    event: event
                });
            }
        }));
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_UP,
            fire: (event) => {
                // when the mouse if up, we eject this state
                this.eject();
            }
        }));
    }
}
exports.AbstractDisplacementState = AbstractDisplacementState;


/***/ }),

/***/ "./dist/core-state/State.js":
/*!**********************************!*\
  !*** ./dist/core-state/State.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.State = void 0;
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
class State {
    constructor(options) {
        this.actions = [];
        this.keys = [];
        this.childStates = [];
        this.options = options;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    getOptions() {
        return this.options;
    }
    eject() {
        this.engine.getStateMachine().popState();
    }
    transitionWithEvent(state, event) {
        this.engine.getStateMachine().pushState(state);
        this.engine.getActionEventBus().fireAction(event);
    }
    registerAction(action) {
        this.actions.push(action);
    }
    tryActivateParentState(keys) {
        if (this.keys.length > 0 && !this.isKeysFullfilled(keys)) {
            this.eject();
            return true;
        }
        return false;
    }
    tryActivateChildState(keys) {
        const state = this.findStateToActivate(keys);
        if (state) {
            this.engine.getStateMachine().pushState(state);
            return true;
        }
        return false;
    }
    findStateToActivate(keys) {
        for (let child of this.childStates) {
            if (child.isKeysFullfilled(keys)) {
                return child;
            }
        }
        return null;
    }
    isKeysFullfilled(keys) {
        return _.intersection(this.keys, keys).length === this.keys.length;
    }
    activated(previous) {
        const keys = this.engine.getActionEventBus().getKeys();
        if (this.tryActivateParentState(keys) || this.tryActivateChildState(keys)) {
            return;
        }
        // perhaps we need to pop again?
        this.handler1 = this.engine.getActionEventBus().registerAction(new Action_1.Action({
            type: Action_1.InputType.KEY_DOWN,
            fire: () => {
                this.tryActivateChildState(this.engine.getActionEventBus().getKeys());
            }
        }));
        this.handler2 = this.engine.getActionEventBus().registerAction(new Action_1.Action({
            type: Action_1.InputType.KEY_UP,
            fire: () => {
                this.tryActivateParentState(this.engine.getActionEventBus().getKeys());
            }
        }));
        for (let action of this.actions) {
            this.engine.getActionEventBus().registerAction(action);
        }
    }
    deactivated(next) {
        if (this.handler1) {
            this.handler1();
        }
        if (this.handler2) {
            this.handler2();
        }
        // if this happens, we are going into heirachial state machine mode
        for (let action of this.actions) {
            this.engine.getActionEventBus().deregisterAction(action);
        }
    }
}
exports.State = State;


/***/ }),

/***/ "./dist/core-state/StateMachine.js":
/*!*****************************************!*\
  !*** ./dist/core-state/StateMachine.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StateMachine = void 0;
const _ = __webpack_require__(/*! lodash */ "lodash");
const BaseObserver_1 = __webpack_require__(/*! ../core/BaseObserver */ "./dist/core/BaseObserver.js");
class StateMachine extends BaseObserver_1.BaseObserver {
    constructor(engine) {
        super();
        this.engine = engine;
        this.stateStack = [];
    }
    getCurrentState() {
        return this.currentState;
    }
    pushState(state) {
        this.stateStack.push(state);
        this.setState(state);
    }
    popState() {
        this.stateStack.pop();
        this.setState(_.last(this.stateStack));
    }
    setState(state) {
        state.setEngine(this.engine);
        // if no state object, get the initial state
        if (this.currentState) {
            this.currentState.deactivated(state);
        }
        const old = this.currentState;
        this.currentState = state;
        if (this.currentState) {
            this.currentState.activated(old);
            this.fireEvent({
                newState: state
            }, 'stateChanged');
        }
    }
}
exports.StateMachine = StateMachine;


/***/ }),

/***/ "./dist/core/AbstractFactory.js":
/*!**************************************!*\
  !*** ./dist/core/AbstractFactory.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractFactory = void 0;
/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
class AbstractFactory {
    constructor(type) {
        this.type = type;
    }
    setDiagramEngine(engine) {
        this.engine = engine;
    }
    setFactoryBank(bank) {
        this.bank = bank;
    }
    getType() {
        return this.type;
    }
}
exports.AbstractFactory = AbstractFactory;


/***/ }),

/***/ "./dist/core/AbstractModelFactory.js":
/*!*******************************************!*\
  !*** ./dist/core/AbstractModelFactory.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractModelFactory = void 0;
const AbstractFactory_1 = __webpack_require__(/*! ./AbstractFactory */ "./dist/core/AbstractFactory.js");
class AbstractModelFactory extends AbstractFactory_1.AbstractFactory {
}
exports.AbstractModelFactory = AbstractModelFactory;


/***/ }),

/***/ "./dist/core/AbstractReactFactory.js":
/*!*******************************************!*\
  !*** ./dist/core/AbstractReactFactory.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractReactFactory = void 0;
const AbstractModelFactory_1 = __webpack_require__(/*! ./AbstractModelFactory */ "./dist/core/AbstractModelFactory.js");
/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
class AbstractReactFactory extends AbstractModelFactory_1.AbstractModelFactory {
}
exports.AbstractReactFactory = AbstractReactFactory;


/***/ }),

/***/ "./dist/core/BaseObserver.js":
/*!***********************************!*\
  !*** ./dist/core/BaseObserver.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseObserver = void 0;
const Toolkit_1 = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");
/**
 * Base observer pattern class for working with listeners
 */
class BaseObserver {
    constructor() {
        this.listeners = {};
    }
    fireEventInternal(fire, k, event) {
        this.iterateListeners((listener) => {
            // returning false here will instruct itteration to stop
            if (!fire && !event.firing) {
                return false;
            }
            // fire selected listener
            if (listener[k]) {
                listener[k](event);
            }
        });
    }
    fireEvent(event, k) {
        event = Object.assign({ firing: true, stopPropagation: () => {
                event.firing = false;
            } }, event);
        // fire pre
        this.fireEventInternal(true, 'eventWillFire', Object.assign(Object.assign({}, event), { function: k }));
        // fire main event
        this.fireEventInternal(false, k, event);
        // fire post
        this.fireEventInternal(true, 'eventDidFire', Object.assign(Object.assign({}, event), { function: k }));
    }
    iterateListeners(cb) {
        for (let id in this.listeners) {
            const res = cb(this.listeners[id]);
            // cancel itteration on false
            if (res === false) {
                return;
            }
        }
    }
    getListenerHandle(listener) {
        for (let id in this.listeners) {
            if (this.listeners[id] === listener) {
                return {
                    id: id,
                    listener: listener,
                    deregister: () => {
                        delete this.listeners[id];
                    }
                };
            }
        }
    }
    registerListener(listener) {
        const id = Toolkit_1.Toolkit.UID();
        this.listeners[id] = listener;
        return {
            id: id,
            listener: listener,
            deregister: () => {
                delete this.listeners[id];
            }
        };
    }
    deregisterListener(listener) {
        if (typeof listener === 'object') {
            listener.deregister();
            return true;
        }
        const handle = this.getListenerHandle(listener);
        if (handle) {
            handle.deregister();
            return true;
        }
        return false;
    }
}
exports.BaseObserver = BaseObserver;


/***/ }),

/***/ "./dist/core/FactoryBank.js":
/*!**********************************!*\
  !*** ./dist/core/FactoryBank.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FactoryBank = void 0;
const BaseObserver_1 = __webpack_require__(/*! ./BaseObserver */ "./dist/core/BaseObserver.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
/**
 * Store and managed Factories that extend from Abstractfactory
 */
class FactoryBank extends BaseObserver_1.BaseObserver {
    constructor() {
        super();
        this.factories = {};
    }
    getFactories() {
        return _.values(this.factories);
    }
    clearFactories() {
        for (let factory in this.factories) {
            this.deregisterFactory(factory);
        }
    }
    getFactory(type) {
        if (!this.factories[type]) {
            throw new Error(`Cannot find factory with type [${type}]`);
        }
        return this.factories[type];
    }
    registerFactory(factory) {
        factory.setFactoryBank(this);
        this.factories[factory.getType()] = factory;
        // todo fixme
        this.fireEvent({ factory }, 'factoryAdded');
    }
    deregisterFactory(type) {
        const factory = this.factories[type];
        factory.setFactoryBank(null);
        delete this.factories[type];
        // todo fixme
        this.fireEvent({ factory }, 'factoryRemoved');
    }
}
exports.FactoryBank = FactoryBank;


/***/ }),

/***/ "./dist/core/ModelGeometryInterface.js":
/*!*********************************************!*\
  !*** ./dist/core/ModelGeometryInterface.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./dist/entities/canvas/CanvasModel.js":
/*!*********************************************!*\
  !*** ./dist/entities/canvas/CanvasModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CanvasModel = void 0;
const _ = __webpack_require__(/*! lodash */ "lodash");
const BaseEntity_1 = __webpack_require__(/*! ../../core-models/BaseEntity */ "./dist/core-models/BaseEntity.js");
class CanvasModel extends BaseEntity_1.BaseEntity {
    constructor(options = {}) {
        super(Object.assign({ zoom: 100, gridSize: 0, offsetX: 0, offsetY: 0 }, options));
        this.layers = [];
    }
    getSelectionEntities() {
        return _.flatMap(this.layers, (layer) => {
            return layer.getSelectionEntities();
        });
    }
    getSelectedEntities() {
        return _.filter(this.getSelectionEntities(), (ob) => {
            return ob.isSelected();
        });
    }
    clearSelection() {
        _.forEach(this.getSelectedEntities(), (element) => {
            element.setSelected(false);
        });
    }
    getModels() {
        return _.flatMap(this.layers, (layer) => {
            return _.values(layer.getModels());
        });
    }
    addLayer(layer) {
        layer.setParent(this);
        layer.registerListener({
            entityRemoved: (event) => { }
        });
        this.layers.push(layer);
    }
    removeLayer(layer) {
        const index = this.layers.indexOf(layer);
        if (index !== -1) {
            this.layers.splice(index, 1);
            return true;
        }
        return false;
    }
    getLayers() {
        return this.layers;
    }
    setGridSize(size = 0) {
        this.options.gridSize = size;
        this.fireEvent({ size: size }, 'gridUpdated');
    }
    getGridPosition(pos) {
        if (this.options.gridSize === 0) {
            return pos;
        }
        return this.options.gridSize * Math.floor((pos + this.options.gridSize / 2) / this.options.gridSize);
    }
    deserializeModel(data, engine) {
        const models = {};
        const promises = {};
        const resolvers = {};
        const event = {
            data: data,
            engine: engine,
            registerModel: (model) => {
                models[model.getID()] = model;
                if (resolvers[model.getID()]) {
                    resolvers[model.getID()](model);
                }
            },
            getModel(id) {
                if (models[id]) {
                    return Promise.resolve(models[id]);
                }
                if (!promises[id]) {
                    promises[id] = new Promise((resolve) => {
                        resolvers[id] = resolve;
                    });
                }
                return promises[id];
            }
        };
        this.deserialize(event);
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.offsetX = event.data.offsetX;
        this.options.offsetY = event.data.offsetY;
        this.options.zoom = event.data.zoom;
        this.options.gridSize = event.data.gridSize;
        _.forEach(event.data.layers, (layer) => {
            const layerOb = event.engine.getFactoryForLayer(layer.type).generateModel({
                initialConfig: layer
            });
            layerOb.deserialize(Object.assign(Object.assign({}, event), { data: layer }));
            this.addLayer(layerOb);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { offsetX: this.options.offsetX, offsetY: this.options.offsetY, zoom: this.options.zoom, gridSize: this.options.gridSize, layers: _.map(this.layers, (layer) => {
                return layer.serialize();
            }) });
    }
    setZoomLevel(zoom) {
        this.options.zoom = zoom;
        this.fireEvent({ zoom }, 'zoomUpdated');
    }
    setOffset(offsetX, offsetY) {
        this.options.offsetX = offsetX;
        this.options.offsetY = offsetY;
        this.fireEvent({ offsetX, offsetY }, 'offsetUpdated');
    }
    setOffsetX(offsetX) {
        this.setOffset(offsetX, this.options.offsetY);
    }
    setOffsetY(offsetY) {
        this.setOffset(this.options.offsetX, offsetY);
    }
    getOffsetY() {
        return this.options.offsetY;
    }
    getOffsetX() {
        return this.options.offsetX;
    }
    getZoomLevel() {
        return this.options.zoom;
    }
}
exports.CanvasModel = CanvasModel;


/***/ }),

/***/ "./dist/entities/canvas/CanvasWidget.js":
/*!**********************************************!*\
  !*** ./dist/entities/canvas/CanvasWidget.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CanvasWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const TransformLayerWidget_1 = __webpack_require__(/*! ../layer/TransformLayerWidget */ "./dist/entities/layer/TransformLayerWidget.js");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
const SmartLayerWidget_1 = __webpack_require__(/*! ../layer/SmartLayerWidget */ "./dist/entities/layer/SmartLayerWidget.js");
var S;
(function (S) {
    S.Canvas = styled_1.default.div `
		position: relative;
		cursor: move;
		overflow: hidden;
	`;
})(S || (S = {}));
class CanvasWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            action: null,
            diagramEngineListener: null
        };
    }
    componentWillUnmount() {
        this.props.engine.deregisterListener(this.canvasListener);
        this.props.engine.setCanvas(null);
        document.removeEventListener('keyup', this.keyUp);
        document.removeEventListener('keydown', this.keyDown);
    }
    registerCanvas() {
        this.props.engine.setCanvas(this.ref.current);
        this.props.engine.iterateListeners((list) => {
            list.rendered && list.rendered();
        });
    }
    componentDidUpdate() {
        this.registerCanvas();
    }
    componentDidMount() {
        this.canvasListener = this.props.engine.registerListener({
            repaintCanvas: () => {
                this.forceUpdate();
            }
        });
        this.keyDown = (event) => {
            this.props.engine.getActionEventBus().fireAction({ event });
        };
        this.keyUp = (event) => {
            this.props.engine.getActionEventBus().fireAction({ event });
        };
        document.addEventListener('keyup', this.keyUp);
        document.addEventListener('keydown', this.keyDown);
        this.registerCanvas();
    }
    render() {
        const engine = this.props.engine;
        const model = engine.getModel();
        return (React.createElement(S.Canvas, { className: this.props.className, ref: this.ref, onWheel: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseDown: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseUp: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseMove: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            } }, model.getLayers().map((layer) => {
            return (React.createElement(TransformLayerWidget_1.TransformLayerWidget, { layer: layer, key: layer.getID() },
                React.createElement(SmartLayerWidget_1.SmartLayerWidget, { layer: layer, engine: this.props.engine, key: layer.getID() })));
        })));
    }
}
exports.CanvasWidget = CanvasWidget;


/***/ }),

/***/ "./dist/entities/layer/LayerModel.js":
/*!*******************************************!*\
  !*** ./dist/entities/layer/LayerModel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LayerModel = void 0;
const BaseModel_1 = __webpack_require__(/*! ../../core-models/BaseModel */ "./dist/core-models/BaseModel.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
class LayerModel extends BaseModel_1.BaseModel {
    constructor(options = {}) {
        super(options);
        this.models = {};
        this.repaintEnabled = true;
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.isSvg = !!event.data.isSvg;
        this.options.transformed = !!event.data.transformed;
        _.forEach(event.data.models, (model) => {
            const modelOb = this.getChildModelFactoryBank(event.engine).getFactory(model.type).generateModel({
                initialConfig: model
            });
            modelOb.deserialize(Object.assign(Object.assign({}, event), { data: model }));
            this.addModel(modelOb);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { isSvg: this.options.isSvg, transformed: this.options.transformed, models: _.mapValues(this.models, (model) => {
                return model.serialize();
            }) });
    }
    isRepaintEnabled() {
        return this.repaintEnabled;
    }
    allowRepaint(allow = true) {
        this.repaintEnabled = allow;
    }
    remove() {
        if (this.parent) {
            this.parent.removeLayer(this);
        }
        super.remove();
    }
    addModel(model) {
        model.setParent(this);
        this.models[model.getID()] = model;
    }
    getSelectionEntities() {
        return _.flatMap(this.models, (model) => {
            return model.getSelectionEntities();
        });
    }
    getModels() {
        return this.models;
    }
    getModel(id) {
        return this.models[id];
    }
    removeModel(id) {
        const _id = typeof id === 'string' ? id : id.getID();
        if (this.models[_id]) {
            delete this.models[_id];
            return true;
        }
        return false;
    }
}
exports.LayerModel = LayerModel;


/***/ }),

/***/ "./dist/entities/layer/SmartLayerWidget.js":
/*!*************************************************!*\
  !*** ./dist/entities/layer/SmartLayerWidget.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmartLayerWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
class SmartLayerWidget extends React.Component {
    shouldComponentUpdate() {
        return this.props.layer.isRepaintEnabled();
    }
    render() {
        return this.props.engine.getFactoryForLayer(this.props.layer).generateReactWidget({ model: this.props.layer });
    }
}
exports.SmartLayerWidget = SmartLayerWidget;


/***/ }),

/***/ "./dist/entities/layer/TransformLayerWidget.js":
/*!*****************************************************!*\
  !*** ./dist/entities/layer/TransformLayerWidget.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformLayerWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
const react_1 = __webpack_require__(/*! @emotion/react */ "@emotion/react");
var S;
(function (S) {
    const shared = react_1.css `
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
		transform-origin: 0 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	`;
    S.DivLayer = styled_1.default.div `
		${shared}
	`;
    S.SvgLayer = styled_1.default.svg `
		${shared}
	`;
})(S || (S = {}));
class TransformLayerWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getTransform() {
        const model = this.props.layer.getParent();
        return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
    }
    getTransformStyle() {
        if (this.props.layer.getOptions().transformed) {
            return {
                transform: this.getTransform()
            };
        }
        return {};
    }
    render() {
        if (this.props.layer.getOptions().isSvg) {
            return React.createElement(S.SvgLayer, { style: this.getTransformStyle() }, this.props.children);
        }
        return React.createElement(S.DivLayer, { style: this.getTransformStyle() }, this.props.children);
    }
}
exports.TransformLayerWidget = TransformLayerWidget;


/***/ }),

/***/ "./dist/entities/selection/SelectionBoxLayerFactory.js":
/*!*************************************************************!*\
  !*** ./dist/entities/selection/SelectionBoxLayerFactory.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionBoxLayerFactory = void 0;
const React = __webpack_require__(/*! react */ "react");
const AbstractReactFactory_1 = __webpack_require__(/*! ../../core/AbstractReactFactory */ "./dist/core/AbstractReactFactory.js");
const SelectionLayerModel_1 = __webpack_require__(/*! ./SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js");
const SelectionBoxWidget_1 = __webpack_require__(/*! ./SelectionBoxWidget */ "./dist/entities/selection/SelectionBoxWidget.js");
class SelectionBoxLayerFactory extends AbstractReactFactory_1.AbstractReactFactory {
    constructor() {
        super('selection');
    }
    generateModel(event) {
        return new SelectionLayerModel_1.SelectionLayerModel();
    }
    generateReactWidget(event) {
        return React.createElement(SelectionBoxWidget_1.SelectionBoxWidget, { rect: event.model.box });
    }
}
exports.SelectionBoxLayerFactory = SelectionBoxLayerFactory;


/***/ }),

/***/ "./dist/entities/selection/SelectionBoxWidget.js":
/*!*******************************************************!*\
  !*** ./dist/entities/selection/SelectionBoxWidget.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionBoxWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const styled_1 = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
var S;
(function (S) {
    S.Container = styled_1.default.div `
		position: absolute;
		background-color: rgba(0, 192, 255, 0.2);
		border: solid 2px rgb(0, 192, 255);
	`;
})(S || (S = {}));
class SelectionBoxWidget extends React.Component {
    render() {
        const { rect } = this.props;
        return (React.createElement(S.Container, { style: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            } }));
    }
}
exports.SelectionBoxWidget = SelectionBoxWidget;


/***/ }),

/***/ "./dist/entities/selection/SelectionLayerModel.js":
/*!********************************************************!*\
  !*** ./dist/entities/selection/SelectionLayerModel.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionLayerModel = void 0;
const LayerModel_1 = __webpack_require__(/*! ../layer/LayerModel */ "./dist/entities/layer/LayerModel.js");
class SelectionLayerModel extends LayerModel_1.LayerModel {
    constructor() {
        super({
            transformed: false,
            isSvg: false,
            type: 'selection'
        });
    }
    setBox(rect) {
        this.box = rect;
    }
    getChildModelFactoryBank() {
        // is not used as it doesnt serialize
        return null;
    }
}
exports.SelectionLayerModel = SelectionLayerModel;


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
__exportStar(__webpack_require__(/*! ./CanvasEngine */ "./dist/CanvasEngine.js"), exports);
__exportStar(__webpack_require__(/*! ./Toolkit */ "./dist/Toolkit.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/canvas/CanvasModel */ "./dist/entities/canvas/CanvasModel.js"), exports);
__exportStar(__webpack_require__(/*! ./core/AbstractFactory */ "./dist/core/AbstractFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./core/AbstractModelFactory */ "./dist/core/AbstractModelFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./core/AbstractReactFactory */ "./dist/core/AbstractReactFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./core/BaseObserver */ "./dist/core/BaseObserver.js"), exports);
__exportStar(__webpack_require__(/*! ./core/FactoryBank */ "./dist/core/FactoryBank.js"), exports);
__exportStar(__webpack_require__(/*! ./core/ModelGeometryInterface */ "./dist/core/ModelGeometryInterface.js"), exports);
__exportStar(__webpack_require__(/*! ./core-actions/Action */ "./dist/core-actions/Action.js"), exports);
__exportStar(__webpack_require__(/*! ./core-actions/ActionEventBus */ "./dist/core-actions/ActionEventBus.js"), exports);
__exportStar(__webpack_require__(/*! ./core-models/BaseEntity */ "./dist/core-models/BaseEntity.js"), exports);
__exportStar(__webpack_require__(/*! ./core-models/BaseModel */ "./dist/core-models/BaseModel.js"), exports);
__exportStar(__webpack_require__(/*! ./core-models/BasePositionModel */ "./dist/core-models/BasePositionModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/canvas/CanvasModel */ "./dist/entities/canvas/CanvasModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/canvas/CanvasWidget */ "./dist/entities/canvas/CanvasWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/layer/LayerModel */ "./dist/entities/layer/LayerModel.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/layer/TransformLayerWidget */ "./dist/entities/layer/TransformLayerWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/layer/SmartLayerWidget */ "./dist/entities/layer/SmartLayerWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/selection/SelectionBoxLayerFactory */ "./dist/entities/selection/SelectionBoxLayerFactory.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/selection/SelectionBoxWidget */ "./dist/entities/selection/SelectionBoxWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./entities/selection/SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js"), exports);
__exportStar(__webpack_require__(/*! ./widgets/PeformanceWidget */ "./dist/widgets/PeformanceWidget.js"), exports);
__exportStar(__webpack_require__(/*! ./core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js"), exports);
__exportStar(__webpack_require__(/*! ./core-state/State */ "./dist/core-state/State.js"), exports);
__exportStar(__webpack_require__(/*! ./core-state/StateMachine */ "./dist/core-state/StateMachine.js"), exports);
__exportStar(__webpack_require__(/*! ./states/DefaultState */ "./dist/states/DefaultState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/DragCanvasState */ "./dist/states/DragCanvasState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/SelectingState */ "./dist/states/SelectingState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/SelectionBoxState */ "./dist/states/SelectionBoxState.js"), exports);
__exportStar(__webpack_require__(/*! ./states/MoveItemsState */ "./dist/states/MoveItemsState.js"), exports);
__exportStar(__webpack_require__(/*! ./actions/DeleteItemsAction */ "./dist/actions/DeleteItemsAction.js"), exports);
__exportStar(__webpack_require__(/*! ./actions/ZoomCanvasAction */ "./dist/actions/ZoomCanvasAction.js"), exports);


/***/ }),

/***/ "./dist/states/DefaultState.js":
/*!*************************************!*\
  !*** ./dist/states/DefaultState.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultState = void 0;
const State_1 = __webpack_require__(/*! ../core-state/State */ "./dist/core-state/State.js");
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
const DragCanvasState_1 = __webpack_require__(/*! ./DragCanvasState */ "./dist/states/DragCanvasState.js");
const SelectingState_1 = __webpack_require__(/*! ./SelectingState */ "./dist/states/SelectingState.js");
const MoveItemsState_1 = __webpack_require__(/*! ./MoveItemsState */ "./dist/states/MoveItemsState.js");
class DefaultState extends State_1.State {
    constructor() {
        super({
            name: 'default'
        });
        this.childStates = [new SelectingState_1.SelectingState()];
        // determine what was clicked on
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                // the canvas was clicked on, transition to the dragging canvas state
                if (!element) {
                    this.transitionWithEvent(new DragCanvasState_1.DragCanvasState(), event);
                }
                else {
                    this.transitionWithEvent(new MoveItemsState_1.MoveItemsState(), event);
                }
            }
        }));
    }
}
exports.DefaultState = DefaultState;


/***/ }),

/***/ "./dist/states/DragCanvasState.js":
/*!****************************************!*\
  !*** ./dist/states/DragCanvasState.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DragCanvasState = void 0;
const AbstractDisplacementState_1 = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
class DragCanvasState extends AbstractDisplacementState_1.AbstractDisplacementState {
    constructor(options = {}) {
        super({
            name: 'drag-canvas'
        });
        this.config = Object.assign({ allowDrag: true }, options);
    }
    activated(prev) {
        const _super = Object.create(null, {
            activated: { get: () => super.activated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.activated.call(this, prev);
            this.engine.getModel().clearSelection();
            yield this.engine.repaintCanvas(true);
            // we can block layer rendering because we are only targeting the transforms
            for (let layer of this.engine.getModel().getLayers()) {
                layer.allowRepaint(false);
            }
            this.initialCanvasX = this.engine.getModel().getOffsetX();
            this.initialCanvasY = this.engine.getModel().getOffsetY();
        });
    }
    deactivated(next) {
        super.deactivated(next);
        for (let layer of this.engine.getModel().getLayers()) {
            layer.allowRepaint(true);
        }
    }
    fireMouseMoved(event) {
        if (this.config.allowDrag) {
            this.engine
                .getModel()
                .setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
            this.engine.repaintCanvas();
        }
    }
}
exports.DragCanvasState = DragCanvasState;


/***/ }),

/***/ "./dist/states/MoveItemsState.js":
/*!***************************************!*\
  !*** ./dist/states/MoveItemsState.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MoveItemsState = void 0;
const AbstractDisplacementState_1 = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
const BasePositionModel_1 = __webpack_require__(/*! ../core-models/BasePositionModel */ "./dist/core-models/BasePositionModel.js");
class MoveItemsState extends AbstractDisplacementState_1.AbstractDisplacementState {
    constructor() {
        super({
            name: 'move-items'
        });
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                if (!element) {
                    return;
                }
                if (!element.isSelected()) {
                    this.engine.getModel().clearSelection();
                }
                element.setSelected(true);
                this.engine.repaintCanvas();
            }
        }));
    }
    activated(previous) {
        super.activated(previous);
        this.initialPositions = {};
    }
    fireMouseMoved(event) {
        const items = this.engine.getModel().getSelectedEntities();
        const model = this.engine.getModel();
        for (let item of items) {
            if (item instanceof BasePositionModel_1.BasePositionModel) {
                if (item.isLocked()) {
                    continue;
                }
                if (!this.initialPositions[item.getID()]) {
                    this.initialPositions[item.getID()] = {
                        point: item.getPosition(),
                        item: item
                    };
                }
                const pos = this.initialPositions[item.getID()].point;
                item.setPosition(model.getGridPosition(pos.x + event.virtualDisplacementX), model.getGridPosition(pos.y + event.virtualDisplacementY));
            }
        }
        this.engine.repaintCanvas();
    }
}
exports.MoveItemsState = MoveItemsState;


/***/ }),

/***/ "./dist/states/SelectingState.js":
/*!***************************************!*\
  !*** ./dist/states/SelectingState.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectingState = void 0;
const State_1 = __webpack_require__(/*! ../core-state/State */ "./dist/core-state/State.js");
const Action_1 = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
const SelectionBoxState_1 = __webpack_require__(/*! ./SelectionBoxState */ "./dist/states/SelectionBoxState.js");
class SelectingState extends State_1.State {
    constructor() {
        super({
            name: 'selecting'
        });
        this.keys = ['shift'];
        this.registerAction(new Action_1.Action({
            type: Action_1.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                // go into a selection box on the canvas state
                if (!element) {
                    this.transitionWithEvent(new SelectionBoxState_1.SelectionBoxState(), event);
                }
                else {
                    element.setSelected(true);
                    this.engine.repaintCanvas();
                }
            }
        }));
    }
}
exports.SelectingState = SelectingState;


/***/ }),

/***/ "./dist/states/SelectionBoxState.js":
/*!******************************************!*\
  !*** ./dist/states/SelectionBoxState.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionBoxState = void 0;
const AbstractDisplacementState_1 = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
const SelectionLayerModel_1 = __webpack_require__(/*! ../entities/selection/SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js");
const geometry_1 = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
class SelectionBoxState extends AbstractDisplacementState_1.AbstractDisplacementState {
    constructor() {
        super({
            name: 'selection-box'
        });
    }
    activated(previous) {
        super.activated(previous);
        this.layer = new SelectionLayerModel_1.SelectionLayerModel();
        this.engine.getModel().addLayer(this.layer);
    }
    deactivated(next) {
        super.deactivated(next);
        this.layer.remove();
        this.engine.repaintCanvas();
    }
    getBoxDimensions(event) {
        const rel = this.engine.getRelativePoint(event.event.clientX, event.event.clientY);
        return {
            left: rel.x > this.initialXRelative ? this.initialXRelative : rel.x,
            top: rel.y > this.initialYRelative ? this.initialYRelative : rel.y,
            width: Math.abs(rel.x - this.initialXRelative),
            height: Math.abs(rel.y - this.initialYRelative),
            right: rel.x < this.initialXRelative ? this.initialXRelative : rel.x,
            bottom: rel.y < this.initialYRelative ? this.initialYRelative : rel.y
        };
    }
    fireMouseMoved(event) {
        this.layer.setBox(this.getBoxDimensions(event));
        const relative = this.engine.getRelativeMousePoint({
            clientX: this.initialX,
            clientY: this.initialY
        });
        if (event.virtualDisplacementX < 0) {
            relative.x -= Math.abs(event.virtualDisplacementX);
        }
        if (event.virtualDisplacementY < 0) {
            relative.y -= Math.abs(event.virtualDisplacementY);
        }
        const rect = new geometry_1.Rectangle(relative, Math.abs(event.virtualDisplacementX), Math.abs(event.virtualDisplacementY));
        for (let model of this.engine.getModel().getSelectionEntities()) {
            if (model.getBoundingBox) {
                const bounds = model.getBoundingBox();
                if (rect.containsPoint(bounds.getTopLeft()) && rect.containsPoint(bounds.getBottomRight())) {
                    model.setSelected(true);
                }
                else {
                    model.setSelected(false);
                }
            }
        }
        this.engine.repaintCanvas();
    }
}
exports.SelectionBoxState = SelectionBoxState;


/***/ }),

/***/ "./dist/widgets/PeformanceWidget.js":
/*!******************************************!*\
  !*** ./dist/widgets/PeformanceWidget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PeformanceWidget = void 0;
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
class PeformanceWidget extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!this.props.model.performanceTune()) {
            return true;
        }
        // deserialization event
        if (this.props.model !== nextProps.model) {
            return true;
        }
        // change event
        return !_.isEqual(this.props.serialized, nextProps.serialized);
    }
    render() {
        return this.props.children();
    }
}
exports.PeformanceWidget = PeformanceWidget;


/***/ }),

/***/ "@emotion/react":
/*!*********************************!*\
  !*** external "@emotion/react" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@emotion/react");;

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

/***/ "closest":
/*!**************************!*\
  !*** external "closest" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("closest");;

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