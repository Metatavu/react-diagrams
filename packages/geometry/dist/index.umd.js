(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["@projectstorm/react-diagrams-geometry"] = factory();
	else
		root["@projectstorm/react-diagrams-geometry"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/BezierCurve.js":
/*!*****************************!*\
  !*** ./dist/BezierCurve.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BezierCurve = exports.BezierCurvepPoints = void 0;
const Point_1 = __webpack_require__(/*! ./Point */ "./dist/Point.js");
const Polygon_1 = __webpack_require__(/*! ./Polygon */ "./dist/Polygon.js");
var BezierCurvepPoints;
(function (BezierCurvepPoints) {
    BezierCurvepPoints[BezierCurvepPoints["SOURCE"] = 0] = "SOURCE";
    BezierCurvepPoints[BezierCurvepPoints["SOURCE_CONTROL"] = 1] = "SOURCE_CONTROL";
    BezierCurvepPoints[BezierCurvepPoints["TARGET_CONTROL"] = 2] = "TARGET_CONTROL";
    BezierCurvepPoints[BezierCurvepPoints["TARGET"] = 3] = "TARGET";
})(BezierCurvepPoints = exports.BezierCurvepPoints || (exports.BezierCurvepPoints = {}));
class BezierCurve extends Polygon_1.Polygon {
    constructor() {
        super([new Point_1.Point(0, 0), new Point_1.Point(0, 0), new Point_1.Point(0, 0), new Point_1.Point(0, 0)]);
    }
    getSVGCurve() {
        return `M${this.getSource().toSVG()} C${this.getSourceControl().toSVG()}, ${this.getTargetControl().toSVG()}, ${this.getTarget().toSVG()}`;
    }
    setPoints(points) {
        if (points.length !== 4) {
            throw new Error('BezierCurve must have extactly 4 points');
        }
        super.setPoints(points);
    }
    getSource() {
        return this.points[BezierCurvepPoints.SOURCE];
    }
    getSourceControl() {
        return this.points[BezierCurvepPoints.SOURCE_CONTROL];
    }
    getTargetControl() {
        return this.points[BezierCurvepPoints.TARGET_CONTROL];
    }
    getTarget() {
        return this.points[BezierCurvepPoints.TARGET];
    }
    setSource(point) {
        this.points[BezierCurvepPoints.SOURCE] = point;
    }
    setSourceControl(point) {
        this.points[BezierCurvepPoints.SOURCE_CONTROL] = point;
    }
    setTargetControl(point) {
        this.points[BezierCurvepPoints.TARGET_CONTROL] = point;
    }
    setTarget(point) {
        this.points[BezierCurvepPoints.TARGET] = point;
    }
}
exports.BezierCurve = BezierCurve;


/***/ }),

/***/ "./dist/Matrix.js":
/*!************************!*\
  !*** ./dist/Matrix.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Matrix = void 0;
class Matrix {
    constructor(matrix) {
        this.matrix = matrix;
    }
    mmul(matrix) {
        this.matrix = this.matrix.map((row, i) => matrix.asArray()[0].map((_, j) => row.reduce((acc, _, n) => acc + this.matrix[i][n] * matrix.asArray()[n][j], 0)));
        return this;
    }
    asArray() {
        return this.matrix;
    }
    get(rowIndex, columnIndex) {
        return this.asArray()[rowIndex][columnIndex];
    }
}
exports.Matrix = Matrix;


/***/ }),

/***/ "./dist/Point.js":
/*!***********************!*\
  !*** ./dist/Point.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Point = void 0;
const Matrix_1 = __webpack_require__(/*! ./Matrix */ "./dist/Matrix.js");
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
    toSVG() {
        return this.x + ' ' + this.y;
    }
    asMatrix() {
        return new Matrix_1.Matrix([[this.x], [this.y], [1]]);
    }
    transform(matrix) {
        let final = matrix.mmul(this.asMatrix());
        this.x = final.get(0, 0);
        this.y = final.get(1, 0);
    }
    static middlePoint(pointA, pointB) {
        return new Point((pointB.x + pointA.x) / 2, (pointB.y + pointA.y) / 2);
    }
    static multiply(...matrices) {
        let m = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
            m = m.mmul(matrices[i]);
        }
        return m;
    }
    static scaleMatrix(x, y) {
        return new Matrix_1.Matrix([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]);
    }
    static translateMatrix(x, y) {
        return new Matrix_1.Matrix([
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ]);
    }
    static rotateMatrix(deg) {
        return new Matrix_1.Matrix([
            [Math.cos(deg), -1 * Math.sin(deg), 0],
            [Math.sin(deg), Math.cos(deg), 0],
            [0, 0, 1]
        ]);
    }
    static createScaleMatrix(x, y, origin) {
        return this.multiply(Point.translateMatrix(origin.x, origin.y), Point.scaleMatrix(x, y), Point.translateMatrix(-origin.x, -origin.y));
    }
    static createRotateMatrix(deg, origin) {
        return this.multiply(Point.translateMatrix(origin.x, origin.y), Point.rotateMatrix(deg), Point.translateMatrix(-origin.x, -origin.y));
    }
}
exports.Point = Point;


/***/ }),

/***/ "./dist/Polygon.js":
/*!*************************!*\
  !*** ./dist/Polygon.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polygon = void 0;
const Point_1 = __webpack_require__(/*! ./Point */ "./dist/Point.js");
const _ = __webpack_require__(/*! lodash */ "lodash");
class Polygon {
    constructor(points = []) {
        this.points = points;
    }
    serialize() {
        return _.map(this.points, (point) => {
            return [point.x, point.y];
        });
    }
    deserialize(data) {
        this.points = _.map(data, (point) => {
            return new Point_1.Point(point[0], point[1]);
        });
    }
    scale(x, y, origin) {
        let matrix = Point_1.Point.createScaleMatrix(x, y, origin);
        _.forEach(this.points, (point) => {
            point.transform(matrix);
        });
    }
    transform(matrix) {
        _.forEach(this.points, (point) => {
            point.transform(matrix);
        });
    }
    setPoints(points) {
        this.points = points;
    }
    getPoints() {
        return this.points;
    }
    rotate(degrees) {
        this.transform(Point_1.Point.createRotateMatrix(degrees / (180 / Math.PI), this.getOrigin()));
    }
    translate(offsetX, offsetY) {
        _.forEach(this.points, (point) => {
            point.translate(offsetX, offsetY);
        });
    }
    doClone(ob) {
        this.points = _.map(ob.points, (point) => {
            return point.clone();
        });
    }
    clone() {
        let ob = Object.create(this);
        ob.doClone(this);
        return ob;
    }
    getOrigin() {
        if (this.points.length === 0) {
            return null;
        }
        let dimensions = this.getBoundingBox();
        return Point_1.Point.middlePoint(dimensions.getTopLeft(), dimensions.getBottomRight());
    }
    static boundingBoxFromPolygons(polygons) {
        return Polygon.boundingBoxFromPoints(_.flatMap(polygons, (polygon) => {
            return polygon.getPoints();
        }));
    }
    static boundingBoxFromPoints(points) {
        if (points.length === 0) {
            return new Rectangle_1.Rectangle(0, 0, 0, 0);
        }
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;
        for (let i = 1; i < points.length; i++) {
            if (points[i].x < minX) {
                minX = points[i].x;
            }
            if (points[i].x > maxX) {
                maxX = points[i].x;
            }
            if (points[i].y < minY) {
                minY = points[i].y;
            }
            if (points[i].y > maxY) {
                maxY = points[i].y;
            }
        }
        return new Rectangle_1.Rectangle(new Point_1.Point(minX, minY), new Point_1.Point(maxX, minY), new Point_1.Point(maxX, maxY), new Point_1.Point(minX, maxY));
    }
    getBoundingBox() {
        let minX = this.points[0].x;
        let maxX = this.points[0].x;
        let minY = this.points[0].y;
        let maxY = this.points[0].y;
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].x < minX) {
                minX = this.points[i].x;
            }
            if (this.points[i].x > maxX) {
                maxX = this.points[i].x;
            }
            if (this.points[i].y < minY) {
                minY = this.points[i].y;
            }
            if (this.points[i].y > maxY) {
                maxY = this.points[i].y;
            }
        }
        return new Rectangle_1.Rectangle(new Point_1.Point(minX, minY), new Point_1.Point(maxX, minY), new Point_1.Point(maxX, maxY), new Point_1.Point(minX, maxY));
    }
}
exports.Polygon = Polygon;
const Rectangle_1 = __webpack_require__(/*! ./Rectangle */ "./dist/Rectangle.js");


/***/ }),

/***/ "./dist/Rectangle.js":
/*!***************************!*\
  !*** ./dist/Rectangle.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Rectangle = void 0;
const Point_1 = __webpack_require__(/*! ./Point */ "./dist/Point.js");
const Polygon_1 = __webpack_require__(/*! ./Polygon */ "./dist/Polygon.js");
class Rectangle extends Polygon_1.Polygon {
    constructor(a = 0, b = 0, c = 0, d = 0) {
        if (a instanceof Point_1.Point && b instanceof Point_1.Point && c instanceof Point_1.Point && d instanceof Point_1.Point) {
            super([a, b, c, d]);
        }
        else if (a instanceof Point_1.Point) {
            super([a, new Point_1.Point(a.x + b, a.y), new Point_1.Point(a.x + b, a.y + c), new Point_1.Point(a.x, a.y + c)]);
        }
        else {
            super(Rectangle.pointsFromBounds(a, b, c, d));
        }
    }
    static pointsFromBounds(x, y, width, height) {
        return [new Point_1.Point(x, y), new Point_1.Point(x + width, y), new Point_1.Point(x + width, y + height), new Point_1.Point(x, y + height)];
    }
    updateDimensions(x, y, width, height) {
        this.points = Rectangle.pointsFromBounds(x, y, width, height);
    }
    setPoints(points) {
        if (points.length !== 4) {
            throw 'Rectangles must always have 4 points';
        }
        super.setPoints(points);
    }
    containsPoint(point) {
        const tl = this.getTopLeft();
        const br = this.getBottomRight();
        return point.x >= tl.x && point.x <= br.x && point.y >= tl.y && point.y <= br.y;
    }
    getWidth() {
        return Math.sqrt(Math.pow(this.getTopLeft().x - this.getTopRight().x, 2) + Math.pow(this.getTopLeft().y - this.getTopRight().y, 2));
    }
    getHeight() {
        return Math.sqrt(Math.pow(this.getBottomLeft().x - this.getTopLeft().x, 2) +
            Math.pow(this.getBottomLeft().y - this.getTopLeft().y, 2));
    }
    getTopMiddle() {
        return Point_1.Point.middlePoint(this.getTopLeft(), this.getTopRight());
    }
    getBottomMiddle() {
        return Point_1.Point.middlePoint(this.getBottomLeft(), this.getBottomRight());
    }
    getLeftMiddle() {
        return Point_1.Point.middlePoint(this.getBottomLeft(), this.getTopLeft());
    }
    getRightMiddle() {
        return Point_1.Point.middlePoint(this.getBottomRight(), this.getTopRight());
    }
    getTopLeft() {
        return this.points[0];
    }
    getTopRight() {
        return this.points[1];
    }
    getBottomRight() {
        return this.points[2];
    }
    getBottomLeft() {
        return this.points[3];
    }
}
exports.Rectangle = Rectangle;


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
__exportStar(__webpack_require__(/*! ./Point */ "./dist/Point.js"), exports);
__exportStar(__webpack_require__(/*! ./Matrix */ "./dist/Matrix.js"), exports);
__exportStar(__webpack_require__(/*! ./Polygon */ "./dist/Polygon.js"), exports);
__exportStar(__webpack_require__(/*! ./Rectangle */ "./dist/Rectangle.js"), exports);
__exportStar(__webpack_require__(/*! ./BezierCurve */ "./dist/BezierCurve.js"), exports);


/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");;

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