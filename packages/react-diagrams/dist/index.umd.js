(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["projectstorm/react-diagrams"] = factory();
	else
		root["projectstorm/react-diagrams"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
const react_diagrams_core_1 = __webpack_require__(/*! @projectstorm/react-diagrams-core */ "@projectstorm/react-diagrams-core");
const react_diagrams_defaults_1 = __webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults");
const react_diagrams_routing_1 = __webpack_require__(/*! @projectstorm/react-diagrams-routing */ "@projectstorm/react-diagrams-routing");
const react_canvas_core_1 = __webpack_require__(/*! @projectstorm/react-canvas-core */ "@projectstorm/react-canvas-core");
__exportStar(__webpack_require__(/*! @projectstorm/react-diagrams-core */ "@projectstorm/react-diagrams-core"), exports);
__exportStar(__webpack_require__(/*! @projectstorm/react-diagrams-defaults */ "@projectstorm/react-diagrams-defaults"), exports);
__exportStar(__webpack_require__(/*! @projectstorm/react-diagrams-routing */ "@projectstorm/react-diagrams-routing"), exports);
/**
 * Construct an engine with the defaults installed
 */
exports.default = (options = {}) => {
    const engine = new react_diagrams_core_1.DiagramEngine(options);
    // register model factories
    engine.getLayerFactories().registerFactory(new react_diagrams_core_1.NodeLayerFactory());
    engine.getLayerFactories().registerFactory(new react_diagrams_core_1.LinkLayerFactory());
    engine.getLayerFactories().registerFactory(new react_canvas_core_1.SelectionBoxLayerFactory());
    engine.getLabelFactories().registerFactory(new react_diagrams_defaults_1.DefaultLabelFactory());
    engine.getNodeFactories().registerFactory(new react_diagrams_defaults_1.DefaultNodeFactory()); // i cant figure out why
    engine.getLinkFactories().registerFactory(new react_diagrams_defaults_1.DefaultLinkFactory());
    engine.getLinkFactories().registerFactory(new react_diagrams_routing_1.PathFindingLinkFactory());
    engine.getPortFactories().registerFactory(new react_diagrams_defaults_1.DefaultPortFactory());
    // register the default interaction behaviours
    engine.getStateMachine().pushState(new react_diagrams_core_1.DefaultDiagramState());
    return engine;
};


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

/***/ "@projectstorm/react-diagrams-routing":
/*!*******************************************************!*\
  !*** external "@projectstorm/react-diagrams-routing" ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/react-diagrams-routing");;

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