/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chart/animations/animation.ts":
/*!*******************************************!*\
  !*** ./src/chart/animations/animation.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Animation = void 0;
var animations_manager_1 = __webpack_require__(/*! ./animations-manager */ "./src/chart/animations/animations-manager.ts");
var Animation = /** @class */ (function () {
    function Animation(type, duration, startValues, endValues, callback, easeType) {
        this.isFinished = false;
        this.type = type;
        this.animationStartTime = animations_manager_1.AnimationsManager.getCurrentTimeStamp();
        this.msDuration = duration;
        this.startValues = startValues;
        this.endValues = endValues;
        this.setValCallback = callback;
        this.easeType = easeType;
    }
    Animation.prototype.updateAnimationPositions = function () {
        var _this = this;
        var currentTime = animations_manager_1.AnimationsManager.getCurrentTimeStamp();
        if (currentTime - this.animationStartTime <= this.msDuration) {
            var timeProgress = this.getTimeProgress(currentTime);
            var ease_1 = this.getEaseFunction(timeProgress);
            var resultValues = this.startValues.map(function (v, index) { return v + (_this.endValues[index] - v) * ease_1; });
            this.setValCallback(resultValues, this);
        }
        else {
            this.isFinished = true;
        }
    };
    Animation.prototype.getEaseFunction = function (timeProgress) {
        if (!this.easeType) {
            return this.easeInOutQuint(timeProgress);
        }
        else {
            return this.easeInOutSine(timeProgress);
        }
    };
    Animation.prototype.getTimeProgress = function (currentTime) {
        return (currentTime - this.animationStartTime) / this.msDuration;
    };
    Animation.prototype.easeInOutQuint = function (x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };
    Animation.prototype.easeInOutSine = function (x) {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    };
    Animation.prototype.setStartValues = function (values) {
        this.startValues = values;
    };
    Animation.prototype.setEndValues = function (values) {
        this.endValues = values;
    };
    Animation.prototype.getValues = function () {
        return {
            startValues: this.startValues,
            endValues: this.endValues
        };
    };
    return Animation;
}());
exports.Animation = Animation;


/***/ }),

/***/ "./src/chart/animations/animations-manager.ts":
/*!****************************************************!*\
  !*** ./src/chart/animations/animations-manager.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnimationsManager = void 0;
var animation_1 = __webpack_require__(/*! ./animation */ "./src/chart/animations/animation.ts");
var AnimationsManager = /** @class */ (function () {
    function AnimationsManager() {
    }
    AnimationsManager.setCurrentTimeStamp = function (time) {
        this.currentTimeStamp = time;
    };
    AnimationsManager.getCurrentTimeStamp = function () {
        return this.currentTimeStamp;
    };
    AnimationsManager.getAnimationStack = function () {
        return this.animationStack;
    };
    AnimationsManager.startAnimation = function (type, msDuration, startValues, endValues, callback, easeType) {
        this.checkDuplicates(type);
        this.animationStack.push(new animation_1.Animation(type, msDuration, startValues, endValues, callback, easeType));
    };
    AnimationsManager.checkDuplicates = function (type) {
        var duplicates = this.animationStack.filter(function (animation) { return animation.type === type; });
        // do something with the duplicates in the future;
    };
    AnimationsManager.update = function () {
        var _this = this;
        AnimationsManager.updateStack();
        this.animationStack.forEach(function (animation) {
            if (!_this.currentRenderBlock) {
                animation.updateAnimationPositions();
            }
        });
        this.currentRenderBlock = false;
    };
    AnimationsManager.updateStack = function () {
        this.animationStack = this.animationStack.filter(function (animation) { return !animation.isFinished; });
    };
    AnimationsManager.clearStack = function () {
        this.animationStack = [];
    };
    AnimationsManager.setBlock = function () {
        this.currentRenderBlock = true;
    };
    AnimationsManager.currentRenderBlock = false;
    AnimationsManager.animationStack = [];
    return AnimationsManager;
}());
exports.AnimationsManager = AnimationsManager;


/***/ }),

/***/ "./src/chart/api/api-controller.ts":
/*!*****************************************!*\
  !*** ./src/chart/api/api-controller.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChartAPIController = void 0;
var animations_manager_1 = __webpack_require__(/*! ../animations/animations-manager */ "./src/chart/animations/animations-manager.ts");
var ChartAPIController = /** @class */ (function () {
    function ChartAPIController(view) {
        this.view = view;
    }
    ChartAPIController.prototype.resetViewOffset = function (msTime) {
        var _this = this;
        if (msTime === void 0) { msTime = 400; }
        animations_manager_1.AnimationsManager.startAnimation('resetViewOffset', msTime, [this.view.getViewOffset()], [0], function (easedValues) {
            var viewOffset = easedValues[0];
            _this.view.setViewOffset(viewOffset);
        }, true);
    };
    return ChartAPIController;
}());
exports.ChartAPIController = ChartAPIController;


/***/ }),

/***/ "./src/chart/chart-manager.ts":
/*!************************************!*\
  !*** ./src/chart/chart-manager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChartManager = void 0;
var element_collector_1 = __webpack_require__(/*! ./elements/element-collector */ "./src/chart/elements/element-collector.ts");
var dimensions_1 = __webpack_require__(/*! ./dimensions */ "./src/chart/dimensions.ts");
var view_1 = __webpack_require__(/*! ./view */ "./src/chart/view.ts");
var candle_1 = __webpack_require__(/*! ./elements/candle */ "./src/chart/elements/candle.ts");
var renderer_1 = __webpack_require__(/*! ./renderer/renderer */ "./src/chart/renderer/renderer.ts");
var event_manager_1 = __webpack_require__(/*! ./events/event-manager */ "./src/chart/events/event-manager.ts");
var wheel_1 = __webpack_require__(/*! ./events/wheel */ "./src/chart/events/wheel.ts");
var mouseout_1 = __webpack_require__(/*! ./events/mouseout */ "./src/chart/events/mouseout.ts");
var mousedown_1 = __webpack_require__(/*! ./events/mousedown */ "./src/chart/events/mousedown.ts");
var mouseup_1 = __webpack_require__(/*! ./events/mouseup */ "./src/chart/events/mouseup.ts");
var mousemove_1 = __webpack_require__(/*! ./events/mousemove */ "./src/chart/events/mousemove.ts");
var animations_manager_1 = __webpack_require__(/*! ./animations/animations-manager */ "./src/chart/animations/animations-manager.ts");
var api_controller_1 = __webpack_require__(/*! ./api/api-controller */ "./src/chart/api/api-controller.ts");
var ChartManager = /** @class */ (function () {
    function ChartManager(context, canvas, candles) {
        this.context = context;
        this.canvas = canvas;
        this.setCanvasDimensions();
        this.setView();
        this.setRenderer();
        this.setCandles(candles);
        this.addCanvasListeners();
        this.canvas.style.backgroundColor = "#191f2c";
        this.requestNextFrame(0);
        this.apiController = new api_controller_1.ChartAPIController(this.view);
    }
    ChartManager.prototype.createApiController = function () {
        return this.apiController;
    };
    ChartManager.prototype.setCanvasDimensions = function () {
        var _a = [75, 40], horizontalMargin = _a[0], verticalMargin = _a[1];
        this.dimensions = new dimensions_1.Dimensions(this.canvas, horizontalMargin, verticalMargin);
    };
    ChartManager.prototype.setView = function () {
        var viewConfig = {
            intervalName: 'M1',
            intervalCandles: 60,
            intervalStep: 0,
            intervalColInit: 150,
            intervalColRatios: [150, 300, 600, 1200],
            intervalSubColRatios: [10, 5, 1, 1],
            viewOffset: 0
        };
        this.view = new view_1.View(viewConfig);
    };
    ChartManager.prototype.setRenderer = function () {
        this.renderer = new renderer_1.Renderer(this.context, this.dimensions);
    };
    ChartManager.prototype.setCandles = function (candles) {
        candle_1.Candle.findMaxLowInData(candles);
        this.candles = candles;
    };
    ChartManager.prototype.addCanvasListeners = function () {
        this.eventManager = new event_manager_1.EventManager(this.canvas, this.dimensions, this.view);
        this.eventManager.listen(new wheel_1.Wheel());
        this.eventManager.listen(new mouseout_1.Mouseout());
        this.eventManager.listen(new mousedown_1.Mousedown());
        this.eventManager.listen(new mouseup_1.Mouseup());
        this.eventManager.listen(new mousemove_1.Mousemove());
    };
    ChartManager.prototype.requestNextFrame = function (time) {
        if (time) {
            animations_manager_1.AnimationsManager.setCurrentTimeStamp(time);
        }
        if (!this.lastRender || time && time - this.lastRender >= 16) {
            this.lastRender = time !== null && time !== void 0 ? time : 0;
            candle_1.Candle.resetHighLow();
            var elements = this.getRenderingElements();
            this.renderElements(elements);
        }
        window.requestAnimationFrame(this.requestNextFrame.bind(this));
    };
    ChartManager.prototype.getRenderingElements = function () {
        return new element_collector_1.ElementCollector(this.dimensions, this.view, this.candles).getElements();
    };
    ChartManager.prototype.renderElements = function (elements) {
        animations_manager_1.AnimationsManager.update();
        this.renderer.draw(elements);
    };
    return ChartManager;
}());
exports.ChartManager = ChartManager;


/***/ }),

/***/ "./src/chart/chart.ts":
/*!****************************!*\
  !*** ./src/chart/chart.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Chart = void 0;
var chart_manager_1 = __webpack_require__(/*! ./chart-manager */ "./src/chart/chart-manager.ts");
var Chart = /** @class */ (function () {
    function Chart(canvas) {
        var _this = this;
        this.fetchCandles('http://localhost:3000/candles')
            .then(function (res) { return res.json(); })
            .then(function (candles) { return _this.initChart(candles, canvas); })
            .catch(function () { return _this.initChart([], canvas); });
    }
    Chart.prototype.initChart = function (candles, canvas) {
        this.canvas = canvas;
        this.context = this.getRenderingContext();
        if (this.context) {
            this.chartManager = new chart_manager_1.ChartManager(this.context, this.canvas, candles.reverse());
        }
    };
    Chart.prototype.getRenderingContext = function () {
        if (window.HTMLCanvasElement) {
            return this.canvas.getContext('2d');
        }
        throw new Error('Canvas is not supported');
    };
    Chart.prototype.fetchCandles = function (endpoint) {
        return fetch(endpoint);
    };
    Chart.prototype.getApiController = function () {
        return this.chartManager.createApiController();
    };
    return Chart;
}());
exports.Chart = Chart;


/***/ }),

/***/ "./src/chart/dimensions.ts":
/*!*********************************!*\
  !*** ./src/chart/dimensions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dimensions = void 0;
var Dimensions = /** @class */ (function () {
    function Dimensions(canvas, horizontalMargin, verticalMargin) {
        this.dimensions = {};
        this.canvas = canvas;
        this.horizontalMargin = horizontalMargin;
        this.verticalMargin = verticalMargin;
        this.setDimensions();
    }
    Dimensions.prototype.getWidth = function () {
        var _a;
        return (_a = this.dimensions.width) !== null && _a !== void 0 ? _a : 0;
    };
    Dimensions.prototype.getHeight = function () {
        var _a;
        return (_a = this.dimensions.height) !== null && _a !== void 0 ? _a : 0;
    };
    Dimensions.prototype.getDimensions = function () {
        return this.dimensions;
    };
    Dimensions.prototype.getVerticalMargin = function () {
        return this.verticalMargin;
    };
    Dimensions.prototype.getHorizontalMargin = function () {
        return this.horizontalMargin;
    };
    Dimensions.prototype.setDimensions = function () {
        this.setCanvasStyleWidthAndHeight();
        this.setCanvasWidthAndHeight();
        this.dimensions.height = this.canvas.offsetHeight;
        this.dimensions.width = this.canvas.offsetWidth;
    };
    Dimensions.prototype.setCanvasStyleWidthAndHeight = function (width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 400; }
        this.canvas.style.width = "".concat(width, "px");
        this.canvas.style.height = "".concat(height, "px");
    };
    Dimensions.prototype.setCanvasWidthAndHeight = function () {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    };
    return Dimensions;
}());
exports.Dimensions = Dimensions;


/***/ }),

/***/ "./src/chart/elements/candle.ts":
/*!**************************************!*\
  !*** ./src/chart/elements/candle.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Candle = void 0;
var element_1 = __webpack_require__(/*! ./element */ "./src/chart/elements/element.ts");
var candle_renderer_1 = __webpack_require__(/*! ../renderer/candle-renderer */ "./src/chart/renderer/candle-renderer.ts");
var Candle = /** @class */ (function (_super) {
    __extends(Candle, _super);
    function Candle(coords, properties, candle) {
        var _this = _super.call(this, coords, properties) || this;
        _this.setCurrentHighLow(candle);
        Candle.initializeRenderer();
        _this.setColor(candle);
        _this.width = properties.width;
        _this.yEnd = candle.open;
        _this.yStart = candle.close;
        _this.yHigh = candle.high;
        _this.yLow = candle.low;
        _this.time = candle.time;
        return _this;
    }
    Candle.prototype.render = function (element, context, dimensions) {
        Candle.renderer.draw(element, dimensions, context);
    };
    Candle.prototype.getCandleTime = function () {
        return this.time;
    };
    Candle.prototype.setColor = function (candle) {
        this.color = candle.open > candle.close ? '#56b786' : '#eb4e5c';
    };
    Candle.prototype.getColor = function () {
        return this.color;
    };
    Candle.prototype.setCurrentHighLow = function (candle) {
        if (!Candle.currentMaxHigh || candle.high > Candle.currentMaxHigh) {
            Candle.currentMaxHigh = candle.high;
        }
        if (!Candle.currentMaxLow || candle.low < Candle.currentMaxLow) {
            Candle.currentMaxLow = candle.low;
        }
    };
    Candle.findMaxLowInData = function (candlesData) {
        var _this = this;
        candlesData.forEach(function (candle) {
            if (!_this.maxHigh || candle.high > _this.maxHigh) {
                _this.maxHigh = candle.high;
            }
            if (!_this.maxLow || candle.low < _this.maxLow) {
                _this.maxLow = candle.low;
            }
        });
    };
    Candle.getMaxLowInData = function () {
        return [this.maxHigh, this.maxLow];
    };
    Candle.resetHighLow = function () {
        Candle.currentMaxHigh = undefined;
        Candle.currentMaxLow = undefined;
    };
    Candle.getHighLow = function () {
        var _a, _b;
        return [(_a = Candle.currentMaxHigh) !== null && _a !== void 0 ? _a : 0, (_b = Candle.currentMaxLow) !== null && _b !== void 0 ? _b : 0];
    };
    Candle.getHigh = function () {
        if (Candle.currentMaxHigh === undefined) {
            throw new Error('Could not establish currentMaxHigh for a candle');
        }
        return Candle.currentMaxHigh;
    };
    Candle.getLow = function () {
        if (Candle.currentMaxLow === undefined) {
            throw new Error('Could not establish currentMaxLow for a candle');
        }
        return Candle.currentMaxLow;
    };
    Candle.initializeRenderer = function () {
        if (!Candle.renderer) {
            Candle.renderer = new candle_renderer_1.CandleRenderer();
        }
    };
    return Candle;
}(element_1.Element));
exports.Candle = Candle;


/***/ }),

/***/ "./src/chart/elements/element-collector.ts":
/*!*************************************************!*\
  !*** ./src/chart/elements/element-collector.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElementCollector = void 0;
var candle_1 = __webpack_require__(/*! ./candle */ "./src/chart/elements/candle.ts");
var line_1 = __webpack_require__(/*! ./line */ "./src/chart/elements/line.ts");
var text_1 = __webpack_require__(/*! ./text */ "./src/chart/elements/text.ts");
var math_utils_1 = __webpack_require__(/*! ../math-utils */ "./src/chart/math-utils.ts");
var ElementCollector = /** @class */ (function () {
    function ElementCollector(dimensions, view, candleData) {
        this.renderingElementsSet = new Set();
        this.candles = [];
        this.mainColumnLines = [];
        this.subColumnLines = [];
        this.text = [];
        this.horizontalLines = [];
        this.dimensions = dimensions;
        this.view = view;
        this.candleData = candleData;
        this.setElements();
    }
    ElementCollector.prototype.getElements = function () {
        return this.renderingElementsSet;
    };
    ElementCollector.prototype.setElements = function () {
        var canvasWidth = this.dimensions.getWidth();
        var currentColumn = 0;
        for (var xDrawingOffset = canvasWidth; xDrawingOffset + this.view.getViewOffset() > 0; xDrawingOffset = xDrawingOffset - this.view.getColInterval()) {
            var xDrawingPosition = xDrawingOffset + this.view.getViewOffset() - this.dimensions.getHorizontalMargin();
            currentColumn++;
            if (xDrawingPosition > 0 && xDrawingPosition < canvasWidth + this.view.getColInterval() * 2) {
                this.addCandlesInInterval(xDrawingPosition, this.candleData, currentColumn, canvasWidth);
                this.addTimeStamps(xDrawingPosition, currentColumn, this.candleData);
            }
        }
        this.addHorizontalLines();
        this.renderingElementsSet.add(this.text);
        this.renderingElementsSet.add(this.subColumnLines);
        this.renderingElementsSet.add(this.mainColumnLines);
        this.renderingElementsSet.add(this.horizontalLines);
        this.renderingElementsSet.add(this.candles);
    };
    ElementCollector.prototype.addCandlesInInterval = function (xMainColumnDrawingPosition, candlesData, currentColumn, graphWidth) {
        var distanceBetweenCandles = this.getIntervalCandleDistance();
        var candlesInInterval = this.view.getIntervalCandles();
        for (var candle = 0; candle < candlesInInterval; candle++) {
            var currentCandleToRender = candlesData[candle + candlesInInterval * (currentColumn - 1)];
            this.addCandleIfInView(xMainColumnDrawingPosition, candle, distanceBetweenCandles, graphWidth, currentCandleToRender);
        }
    };
    ElementCollector.prototype.getIntervalCandleDistance = function () {
        return this.view.getColInterval() / this.view.getIntervalCandles();
    };
    ElementCollector.prototype.addCandleIfInView = function (xMainColumnDrawingPosition, candleNumInInterval, distanceBetweenCandles, graphWidth, currentCandleToRender) {
        if (xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles > 0 &&
            xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles < graphWidth - this.dimensions.getHorizontalMargin() + 10) {
            var candleXRenderPosition = xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles;
            this.candles.push(new candle_1.Candle({ xStart: candleXRenderPosition }, { width: this.view.getColInterval() / 100 }, currentCandleToRender));
            var mainColumnDivider = this.view.getDivider();
            var mainColumnLineInterval = this.view.getIntervalCandles() / mainColumnDivider;
            if (candleNumInInterval % this.view.getSubColRatio() === 0) {
                this.subColumnLines.push(new line_1.Line({ xStart: candleXRenderPosition, xEnd: candleXRenderPosition, yStart: 0, yEnd: this.dimensions.getHeight() - this.dimensions.getVerticalMargin() }, { width: .1 }));
            }
            if (candleNumInInterval % mainColumnLineInterval === 0) {
                this.mainColumnLines.push(new line_1.Line({ xStart: candleXRenderPosition, xEnd: candleXRenderPosition, yStart: 0, yEnd: this.dimensions.getHeight() - this.dimensions.getVerticalMargin() }, { width: .3 }));
            }
        }
    };
    ElementCollector.prototype.addTimeStamps = function (xStart, columnOffset, candlesData) {
        var yDrawingPosition = this.dimensions.getHeight() - this.dimensions.getVerticalMargin() + 23;
        var date = new Date(Date.parse(candlesData[0].time));
        date.setMinutes(date.getMinutes() - this.view.getIntervalCandles() * (columnOffset - 1));
        this.text.push(new text_1.Text({ xStart: xStart - 10, yStart: yDrawingPosition }, {}, "".concat(date.getHours(), ":").concat(date.getMinutes())));
        var distanceBetweenCandle = this.view.getColInterval() / this.view.getIntervalCandles();
        var prevY = xStart;
        for (var i = 0; i < this.view.getIntervalCandles(); i++) {
            var drawingX = xStart - 10 - (distanceBetweenCandle + distanceBetweenCandle * i);
            if (!prevY || prevY - drawingX > 40 && xStart - drawingX < this.view.getColInterval() - 10) {
                var date_1 = new Date(Date.parse(candlesData[0].time));
                date_1.setMinutes(date_1.getMinutes() - this.view.getIntervalCandles() * (columnOffset - 1) - i - 1);
                this.text.push(new text_1.Text({ xStart: drawingX, yStart: yDrawingPosition }, {}, "".concat(date_1.getHours(), ":").concat(date_1.getMinutes())));
                prevY = drawingX;
            }
        }
    };
    ElementCollector.prototype.addHorizontalLines = function () {
        var height = this.dimensions.getDimensions().height;
        var _a = candle_1.Candle.getHighLow(), currentMax = _a[0], currentLow = _a[1];
        var currentYZoom = 1;
        while ((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom >= 10) {
            currentYZoom = currentYZoom * 2;
        }
        while ((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom <= 6) {
            currentYZoom = currentYZoom / 2;
        }
        for (var horizontalLineOffset = Math.floor(currentMax); horizontalLineOffset >= currentLow; horizontalLineOffset = horizontalLineOffset - .5) {
            if (horizontalLineOffset <= currentMax && horizontalLineOffset >= currentLow) {
                if (Number(horizontalLineOffset.toFixed(2)) % currentYZoom === 0) {
                    var interpolation = math_utils_1.MathUtils.interpolate((height !== null && height !== void 0 ? height : 0) - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);
                    var xEnd = this.dimensions.getWidth() - 60;
                    this.horizontalLines.push(new line_1.Line({ xStart: 0, xEnd: xEnd, yStart: interpolation, yEnd: interpolation }, { width: .1 }));
                    this.text.push(new text_1.Text({ xStart: this.dimensions.getWidth() - 50, yStart: interpolation + 6 }, {}, "".concat(horizontalLineOffset.toFixed(2))));
                }
            }
        }
    };
    return ElementCollector;
}());
exports.ElementCollector = ElementCollector;


/***/ }),

/***/ "./src/chart/elements/element.ts":
/*!***************************************!*\
  !*** ./src/chart/elements/element.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Element = void 0;
var Element = /** @class */ (function () {
    function Element(_a, properties) {
        var xStart = _a.xStart, xEnd = _a.xEnd, yStart = _a.yStart, yEnd = _a.yEnd;
        var _b, _c;
        this.xStart = xStart !== null && xStart !== void 0 ? xStart : 0;
        this.xEnd = (_b = xEnd !== null && xEnd !== void 0 ? xEnd : xStart) !== null && _b !== void 0 ? _b : 0;
        this.yStart = yStart !== null && yStart !== void 0 ? yStart : 0;
        this.yEnd = (_c = yEnd !== null && yEnd !== void 0 ? yEnd : yStart) !== null && _c !== void 0 ? _c : 0;
        this.renderProperties = properties;
    }
    Element.prototype.getXStart = function () {
        return this.xStart;
    };
    Element.prototype.getXEnd = function () {
        return this.xEnd;
    };
    Element.prototype.getYStart = function () {
        return this.yStart;
    };
    Element.prototype.getYEnd = function () {
        return this.yEnd;
    };
    Element.prototype.getProperties = function () {
        return this.renderProperties;
    };
    Element.prototype.render = function (element, context, dimensions) { };
    ;
    return Element;
}());
exports.Element = Element;


/***/ }),

/***/ "./src/chart/elements/line.ts":
/*!************************************!*\
  !*** ./src/chart/elements/line.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Line = void 0;
var element_1 = __webpack_require__(/*! ./element */ "./src/chart/elements/element.ts");
var line_renderer_1 = __webpack_require__(/*! ../renderer/line-renderer */ "./src/chart/renderer/line-renderer.ts");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(coords, properties) {
        var _this = _super.call(this, coords, properties) || this;
        Line.initializeRenderer();
        return _this;
    }
    Line.prototype.render = function (element, context, dimensions) {
        Line.renderer.draw(element, dimensions, context, this.getProperties());
    };
    Line.initializeRenderer = function () {
        if (!Line.renderer) {
            Line.renderer = new line_renderer_1.LineRenderer();
        }
    };
    return Line;
}(element_1.Element));
exports.Line = Line;


/***/ }),

/***/ "./src/chart/elements/text.ts":
/*!************************************!*\
  !*** ./src/chart/elements/text.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Text = void 0;
var text_renderer_1 = __webpack_require__(/*! ../renderer/text-renderer */ "./src/chart/renderer/text-renderer.ts");
var element_1 = __webpack_require__(/*! ./element */ "./src/chart/elements/element.ts");
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(coords, properties, value) {
        var _this = _super.call(this, coords, properties) || this;
        _this.value = value;
        Text.initializeRenderer();
        return _this;
    }
    Text.prototype.render = function (element, context, dimensions) {
        Text.renderer.draw(element, dimensions, context, this.getProperties());
    };
    Text.prototype.getValue = function () {
        return this.value;
    };
    Text.initializeRenderer = function () {
        if (!Text.renderer) {
            Text.renderer = new text_renderer_1.TextRenderer();
        }
    };
    return Text;
}(element_1.Element));
exports.Text = Text;


/***/ }),

/***/ "./src/chart/events/event-manager.ts":
/*!*******************************************!*\
  !*** ./src/chart/events/event-manager.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManager = void 0;
var EventManager = /** @class */ (function () {
    function EventManager(canvas, dimensions, view) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
    }
    EventManager.prototype.listen = function (event) {
        var _this = this;
        this.canvas.addEventListener(event.eventName, function (canvasEvent) {
            event.callback.call(_this, _this.canvas, _this.dimensions, _this.view, canvasEvent);
        });
    };
    EventManager.mouseDown = false;
    return EventManager;
}());
exports.EventManager = EventManager;


/***/ }),

/***/ "./src/chart/events/mousedown.ts":
/*!***************************************!*\
  !*** ./src/chart/events/mousedown.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mousedown = void 0;
var event_manager_1 = __webpack_require__(/*! ./event-manager */ "./src/chart/events/event-manager.ts");
var Mousedown = /** @class */ (function () {
    function Mousedown() {
        this.eventName = 'mousedown';
    }
    Mousedown.prototype.callback = function (canvas, dimensions, view, event) {
        event_manager_1.EventManager.mouseDown = true;
    };
    return Mousedown;
}());
exports.Mousedown = Mousedown;


/***/ }),

/***/ "./src/chart/events/mousemove.ts":
/*!***************************************!*\
  !*** ./src/chart/events/mousemove.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mousemove = void 0;
var event_manager_1 = __webpack_require__(/*! ./event-manager */ "./src/chart/events/event-manager.ts");
var Mousemove = /** @class */ (function () {
    function Mousemove() {
        this.eventName = 'mousemove';
    }
    Mousemove.prototype.callback = function (canvas, dimensions, view, event) {
        if (view.getViewOffset() + event.movementX > 0 && event_manager_1.EventManager.mouseDown) {
            view.setViewOffset(view.getViewOffset() + event.movementX);
        }
    };
    return Mousemove;
}());
exports.Mousemove = Mousemove;


/***/ }),

/***/ "./src/chart/events/mouseout.ts":
/*!**************************************!*\
  !*** ./src/chart/events/mouseout.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mouseout = void 0;
var event_manager_1 = __webpack_require__(/*! ./event-manager */ "./src/chart/events/event-manager.ts");
var Mouseout = /** @class */ (function () {
    function Mouseout() {
        this.eventName = 'mouseout';
    }
    Mouseout.prototype.callback = function (canvas, dimensions, view, event) {
        event_manager_1.EventManager.mouseDown = false;
    };
    return Mouseout;
}());
exports.Mouseout = Mouseout;


/***/ }),

/***/ "./src/chart/events/mouseup.ts":
/*!*************************************!*\
  !*** ./src/chart/events/mouseup.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mouseup = void 0;
var event_manager_1 = __webpack_require__(/*! ./event-manager */ "./src/chart/events/event-manager.ts");
var Mouseup = /** @class */ (function () {
    function Mouseup() {
        this.eventName = 'mouseup';
    }
    Mouseup.prototype.callback = function (canvas, dimensions, view, event) {
        event_manager_1.EventManager.mouseDown = false;
    };
    return Mouseup;
}());
exports.Mouseup = Mouseup;


/***/ }),

/***/ "./src/chart/events/wheel.ts":
/*!***********************************!*\
  !*** ./src/chart/events/wheel.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wheel = void 0;
var animations_manager_1 = __webpack_require__(/*! ../animations/animations-manager */ "./src/chart/animations/animations-manager.ts");
var Wheel = /** @class */ (function () {
    function Wheel() {
        this.eventName = 'wheel';
    }
    Wheel.prototype.callback = function (canvas, dimensions, view, wheelEvent) {
        var deltaYValue = (wheelEvent.deltaY > 0 && wheelEvent.deltaY !== 0 ? 1 : -1) / 2 * view.getDivider();
        var event = {
            offsetX: wheelEvent.offsetX,
            deltaY: deltaYValue
        };
        animations_manager_1.AnimationsManager.startAnimation('wheel', 400, [0], [event.deltaY], function (easedValues) {
            if ((-event.deltaY && view.maxZoomIn(-event.deltaY)) || (-event.deltaY && view.maxZoomOut(-event.deltaY))) {
                return;
            }
            var wheelValue = easedValues[0];
            Wheel.calculate(canvas, dimensions, view, event, -wheelValue);
        }, false);
    };
    Wheel.calculate = function (canvas, dimensions, view, event, wheelValue) {
        var graphWidth = dimensions.getWidth();
        var scrollSpeed = wheelValue;
        var zoomOffsetSyncValue = this.calculateOffsetSync(graphWidth, dimensions, event, scrollSpeed, view);
        if (zoomOffsetSyncValue !== 0) {
            this.executeZoom(scrollSpeed, zoomOffsetSyncValue, view);
            this.updateOffsetOverflow(view);
        }
    };
    Wheel.calculateOffsetSync = function (graphWidth, dimensions, event, scrollSpeed, view) {
        return (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * scrollSpeed;
    };
    Wheel.executeZoom = function (scrollSpeed, zoomOffsetSyncValue, view) {
        view.addColInterval(scrollSpeed);
        view.addViewOffset(zoomOffsetSyncValue);
    };
    Wheel.updateOffsetOverflow = function (view) {
        if (view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    };
    return Wheel;
}());
exports.Wheel = Wheel;


/***/ }),

/***/ "./src/chart/math-utils.ts":
/*!*********************************!*\
  !*** ./src/chart/math-utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MathUtils = void 0;
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    MathUtils.interpolate = function (chartHeight, yToDraw, maxLowCandle, maxHighCandle) {
        var interpolation = ((chartHeight) * (yToDraw - maxLowCandle)) / (maxHighCandle - maxLowCandle);
        if (interpolation > chartHeight / 2) {
            var diff = Math.abs(interpolation - chartHeight / 2);
            return chartHeight / 2 - diff;
        }
        else if (interpolation < chartHeight / 2) {
            var diff = Math.abs(interpolation - chartHeight / 2);
            return chartHeight / 2 + diff;
        }
        else {
            return interpolation;
        }
    };
    return MathUtils;
}());
exports.MathUtils = MathUtils;


/***/ }),

/***/ "./src/chart/renderer/candle-renderer.ts":
/*!***********************************************!*\
  !*** ./src/chart/renderer/candle-renderer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CandleRenderer = void 0;
var candle_1 = __webpack_require__(/*! ../elements/candle */ "./src/chart/elements/candle.ts");
var math_utils_1 = __webpack_require__(/*! ../math-utils */ "./src/chart/math-utils.ts");
var CandleRenderer = /** @class */ (function () {
    function CandleRenderer() {
    }
    CandleRenderer.prototype.draw = function (candle, dimensions, context) {
        var _a, _b;
        var _c = candle_1.Candle.getHighLow(), maxHighCandle = _c[0], maxLowCandle = _c[1];
        var graphHeight = dimensions.getHeight() - dimensions.getVerticalMargin();
        if (candle.getXStart() <= dimensions.getWidth() - dimensions.getHorizontalMargin() + 10) {
            var yDrawingHigh = math_utils_1.MathUtils.interpolate(graphHeight, candle.yHigh, maxLowCandle, maxHighCandle);
            var yDrawingLow = math_utils_1.MathUtils.interpolate(graphHeight, candle.yLow, maxLowCandle, maxHighCandle);
            context.beginPath();
            context.moveTo(candle.getXStart(), yDrawingLow);
            context.lineTo(candle.getXStart(), yDrawingHigh);
            context.strokeStyle = candle.getColor();
            context.lineWidth = 1;
            context.stroke();
            var yDrawingStart = math_utils_1.MathUtils.interpolate(graphHeight, candle.getYStart(), maxLowCandle, maxHighCandle);
            var yDrawingEnd = math_utils_1.MathUtils.interpolate(graphHeight, candle.getYEnd(), maxLowCandle, maxHighCandle);
            context.beginPath();
            context.roundRect(candle.getXStart() - (1 * ((_a = candle.width) !== null && _a !== void 0 ? _a : 0)) / 2, yDrawingEnd, 1 * ((_b = candle.width) !== null && _b !== void 0 ? _b : 0), yDrawingStart - yDrawingEnd, 1);
            context.fillStyle = candle.getColor();
            context.stroke();
            context.fill();
        }
    };
    return CandleRenderer;
}());
exports.CandleRenderer = CandleRenderer;


/***/ }),

/***/ "./src/chart/renderer/line-renderer.ts":
/*!*********************************************!*\
  !*** ./src/chart/renderer/line-renderer.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LineRenderer = void 0;
var LineRenderer = /** @class */ (function () {
    function LineRenderer() {
    }
    LineRenderer.prototype.draw = function (line, dimensions, context, properties) {
        var _a;
        context.beginPath();
        context.moveTo(line.getXStart(), line.getYStart());
        context.lineTo(line.getXEnd(), line.getYEnd());
        context.strokeStyle = '#A9A9A9';
        context.lineWidth = (_a = properties.width) !== null && _a !== void 0 ? _a : 1;
        context.stroke();
    };
    return LineRenderer;
}());
exports.LineRenderer = LineRenderer;


/***/ }),

/***/ "./src/chart/renderer/renderer.ts":
/*!****************************************!*\
  !*** ./src/chart/renderer/renderer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
var Renderer = /** @class */ (function () {
    function Renderer(context, dimensions) {
        this.context = context;
        this.dimensions = dimensions;
    }
    Renderer.prototype.draw = function (elementSet) {
        var _this = this;
        this.clearView();
        elementSet.forEach(function (renderElement) {
            renderElement.forEach(function (el) {
                _this.render(el);
            });
        });
    };
    Renderer.prototype.clearView = function () {
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    };
    Renderer.prototype.render = function (element) {
        if (element.getXStart() <= this.dimensions.getWidth()) {
            element.render(element, this.context, this.dimensions);
        }
    };
    return Renderer;
}());
exports.Renderer = Renderer;


/***/ }),

/***/ "./src/chart/renderer/text-renderer.ts":
/*!*********************************************!*\
  !*** ./src/chart/renderer/text-renderer.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextRenderer = void 0;
var TextRenderer = /** @class */ (function () {
    function TextRenderer() {
    }
    TextRenderer.prototype.draw = function (text, dimensions, context, properties) {
        context.font = "9px Barlow";
        context.fillStyle = '#A9A9A9';
        context.fillText(text.getValue(), text.getXStart(), text.getYStart());
    };
    return TextRenderer;
}());
exports.TextRenderer = TextRenderer;


/***/ }),

/***/ "./src/chart/view.ts":
/*!***************************!*\
  !*** ./src/chart/view.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.View = void 0;
var View = /** @class */ (function () {
    function View(viewConfig) {
        var intervalColInit = viewConfig.intervalColInit, intervalColRatios = viewConfig.intervalColRatios, viewOffset = viewConfig.viewOffset, intervalStep = viewConfig.intervalStep, intervalCandles = viewConfig.intervalCandles, intervalSubColRatios = viewConfig.intervalSubColRatios;
        this.colInterval = intervalColInit;
        this.viewOffset = viewOffset;
        this.colIntervalRatios = intervalColRatios;
        this.intervalStep = intervalStep;
        this.intervalCandles = intervalCandles;
        this.subColIntervalRatios = intervalSubColRatios;
    }
    View.prototype.getIntervalCandles = function () {
        return this.intervalCandles;
    };
    View.prototype.getDivider = function () {
        return Math.pow(2, this.intervalStep);
    };
    View.prototype.getSubColRatio = function () {
        return this.subColIntervalRatios[this.intervalStep];
    };
    View.prototype.addColInterval = function (x) {
        if (this.maxZoomOut(x)) {
            this.colInterval = this.getMinColInterval();
            return;
        }
        if (this.maxZoomIn(x)) {
            this.colInterval = this.getMaxColInterval();
            return;
        }
        this.colInterval += x;
        this.updateIntervalStep();
    };
    View.prototype.getMinColInterval = function () {
        return this.colIntervalRatios[0];
    };
    View.prototype.getIntervalStep = function () {
        return this.intervalStep;
    };
    View.prototype.getMaxColInterval = function () {
        return this.colIntervalRatios[this.colIntervalRatios.length - 1];
    };
    View.prototype.maxZoomOut = function (x) {
        if (x === void 0) { x = 0; }
        return this.colInterval + x <= this.getMinColInterval() && x <= 0;
    };
    View.prototype.maxZoomIn = function (x) {
        if (x === void 0) { x = 0; }
        return this.colInterval + x >= this.getMaxColInterval() && x >= 0;
    };
    View.prototype.updateIntervalStep = function () {
        this.checkIfNextStep();
        this.checkIfPrevStep();
    };
    View.prototype.checkIfNextStep = function () {
        if (this.intervalStep !== (this.colIntervalRatios.length - 1) && this.colInterval >= this.colIntervalRatios[this.intervalStep + 1]) {
            this.intervalStep++;
        }
    };
    View.prototype.checkIfPrevStep = function () {
        if (this.intervalStep !== 0 && this.colInterval < this.colIntervalRatios[this.intervalStep]) {
            this.intervalStep--;
        }
    };
    View.prototype.getColInterval = function () {
        return this.colInterval;
    };
    View.prototype.getViewOffset = function () {
        return this.viewOffset;
    };
    View.prototype.setViewOffset = function (x) {
        this.viewOffset = x;
    };
    View.prototype.addViewOffset = function (x) {
        if (this.colInterval !== this.getMinColInterval() && this.colInterval !== this.getMaxColInterval()) {
            this.viewOffset += x;
        }
    };
    return View;
}());
exports.View = View;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./chart/chart */ "./src/chart/chart.ts"), exports);
__exportStar(__webpack_require__(/*! ./chart/api/api-controller */ "./src/chart/api/api-controller.ts"), exports);


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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFTSw0QkFBYSxHQUFwQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sNEJBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0sNEJBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixJQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtZQUMvRixJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztTQUN4QjtJQUNMLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQztBQTNHWSxvQkFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRmpCLHdGQUE4QjtBQUM5QixrSEFBMkM7Ozs7Ozs7VUNEM0M7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FuaW1hdGlvbnMvYW5pbWF0aW9uLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FuaW1hdGlvbnMvYW5pbWF0aW9ucy1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FwaS9hcGktY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9jaGFydC1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2NoYXJ0LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2RpbWVuc2lvbnMudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZWxlbWVudHMvY2FuZGxlLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2VsZW1lbnQtY29sbGVjdG9yLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2VsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZWxlbWVudHMvbGluZS50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9lbGVtZW50cy90ZXh0LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9ldmVudC1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9tb3VzZWRvd24udHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL21vdXNlbW92ZS50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9ldmVudHMvbW91c2VvdXQudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL21vdXNldXAudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL3doZWVsLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L21hdGgtdXRpbHMudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvY2FuZGxlLXJlbmRlcmVyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L3JlbmRlcmVyL2xpbmUtcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvdGV4dC1yZW5kZXJlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC92aWV3LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4vYW5pbWF0aW9ucy1tYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBkdXJhdGlvbjogbnVtYmVyLCBzdGFydFZhbHVlczogbnVtYmVyW10sIGVuZFZhbHVlczogbnVtYmVyW10sIGNhbGxiYWNrOiAoLi4uYXJnOiBhbnlbXSkgPT4gdm9pZCwgZWFzZVR5cGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFydFRpbWUgPSBBbmltYXRpb25zTWFuYWdlci5nZXRDdXJyZW50VGltZVN0YW1wKCk7XG4gICAgICAgIHRoaXMubXNEdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICB0aGlzLnN0YXJ0VmFsdWVzID0gc3RhcnRWYWx1ZXM7XG4gICAgICAgIHRoaXMuZW5kVmFsdWVzID0gZW5kVmFsdWVzO1xuICAgICAgICB0aGlzLnNldFZhbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuZWFzZVR5cGUgPSBlYXNlVHlwZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNGaW5pc2hlZCA9IGZhbHNlO1xuXG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwcml2YXRlIGVhc2VUeXBlOiBib29sZWFuO1xuICAgIHByaXZhdGUgYW5pbWF0aW9uU3RhcnRUaW1lOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBtc0R1cmF0aW9uOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzdGFydFZhbHVlczogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBlbmRWYWx1ZXM6IG51bWJlcltdO1xuICAgIHByaXZhdGUgc2V0VmFsQ2FsbGJhY2s6ICguLi5hcmc6IGFueVtdKSA9PiB2b2lkO1xuXG4gICAgcHVibGljIHVwZGF0ZUFuaW1hdGlvblBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBBbmltYXRpb25zTWFuYWdlci5nZXRDdXJyZW50VGltZVN0YW1wKCk7XG5cbiAgICAgICAgaWYoY3VycmVudFRpbWUgLSB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSA8PSB0aGlzLm1zRHVyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVQcm9ncmVzcyA9IHRoaXMuZ2V0VGltZVByb2dyZXNzKGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGVhc2UgPSB0aGlzLmdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3MpO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHRWYWx1ZXMgPSB0aGlzLnN0YXJ0VmFsdWVzLm1hcCgodiwgaW5kZXgpID0+IHYgKyAodGhpcy5lbmRWYWx1ZXNbaW5kZXhdIC0gdikgKiBlYXNlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsQ2FsbGJhY2socmVzdWx0VmFsdWVzLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3M6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGlmKCF0aGlzLmVhc2VUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYXNlSW5PdXRRdWludCh0aW1lUHJvZ3Jlc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFzZUluT3V0U2luZSh0aW1lUHJvZ3Jlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lUHJvZ3Jlc3MoY3VycmVudFRpbWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAoY3VycmVudFRpbWUgLSB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSkgLyB0aGlzLm1zRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlSW5PdXRRdWludCh4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLTEwICogeCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlSW5PdXRTaW5lKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB4IDwgMC41XG4gICAgICAgID8gKDEgLSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KDIgKiB4LCAyKSkpIC8gMlxuICAgICAgICA6IChNYXRoLnNxcnQoMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U3RhcnRWYWx1ZXModmFsdWVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXJ0VmFsdWVzID0gdmFsdWVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRFbmRWYWx1ZXModmFsdWVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZFZhbHVlcyA9IHZhbHVlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmFsdWVzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFZhbHVlczogdGhpcy5zdGFydFZhbHVlcyxcbiAgICAgICAgICAgIGVuZFZhbHVlczogdGhpcy5lbmRWYWx1ZXNcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICcuL2FuaW1hdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25zTWFuYWdlciB7IFxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBzdGF0aWMgY3VycmVudFJlbmRlckJsb2NrID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudFRpbWVTdGFtcDogbnVtYmVyO1xuICAgIHByaXZhdGUgc3RhdGljIGFuaW1hdGlvblN0YWNrOiBBbmltYXRpb25bXSA9IFtdO1xuXG4gICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VGltZVN0YW1wKHRpbWU6IG51bWJlcik6IHZvaWQgeyBcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZVN0YW1wID0gdGltZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEN1cnJlbnRUaW1lU3RhbXAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVTdGFtcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEFuaW1hdGlvblN0YWNrKCk6IEFuaW1hdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uU3RhY2s7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBzdGFydEFuaW1hdGlvbih0eXBlOiBzdHJpbmcsIG1zRHVyYXRpb246IG51bWJlciwgc3RhcnRWYWx1ZXM6IG51bWJlcltdLCBlbmRWYWx1ZXM6IG51bWJlcltdLCBjYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQsIGVhc2VUeXBlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tEdXBsaWNhdGVzKHR5cGUpXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhY2sucHVzaChuZXcgQW5pbWF0aW9uKHR5cGUsIG1zRHVyYXRpb24sIHN0YXJ0VmFsdWVzLCBlbmRWYWx1ZXMsIGNhbGxiYWNrLCBlYXNlVHlwZSkpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tEdXBsaWNhdGVzKHR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkdXBsaWNhdGVzID0gdGhpcy5hbmltYXRpb25TdGFjay5maWx0ZXIoYW5pbWF0aW9uID0+IGFuaW1hdGlvbi50eXBlID09PSB0eXBlKTtcblxuICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCB0aGUgZHVwbGljYXRlcyBpbiB0aGUgZnV0dXJlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICBBbmltYXRpb25zTWFuYWdlci51cGRhdGVTdGFjaygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YWNrLmZvckVhY2goYW5pbWF0aW9uID0+IHtcbiAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRSZW5kZXJCbG9jaykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi51cGRhdGVBbmltYXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVTdGFjaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFjayA9IHRoaXMuYW5pbWF0aW9uU3RhY2suZmlsdGVyKGFuaW1hdGlvbiA9PiAhYW5pbWF0aW9uLmlzRmluaXNoZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXJTdGFjaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2V0QmxvY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gdHJ1ZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQW5pbWF0aW9uc01hbmFnZXIgfSBmcm9tIFwiLi4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXJcIjtcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi4vdmlld1wiO1xuXG5leHBvcnQgY2xhc3MgQ2hhcnRBUElDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSB2aWV3OiBWaWV3XG4gICAgKSB7fVxuXG4gICAgcHVibGljIHJlc2V0Vmlld09mZnNldChtc1RpbWUgPSA0MDApOiB2b2lkIHtcbiAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIuc3RhcnRBbmltYXRpb24oXG4gICAgICAgICAgICAncmVzZXRWaWV3T2Zmc2V0JyxcbiAgICAgICAgICAgIG1zVGltZSxcbiAgICAgICAgICAgIFt0aGlzLnZpZXcuZ2V0Vmlld09mZnNldCgpXSxcbiAgICAgICAgICAgIFswXSxcbiAgICAgICAgICAgIChlYXNlZFZhbHVlczogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBbIHZpZXdPZmZzZXQgXSA9IGVhc2VkVmFsdWVzOyBcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuc2V0Vmlld09mZnNldCh2aWV3T2Zmc2V0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgfVxufSIsImltcG9ydCB7IEVsZW1lbnRDb2xsZWN0b3IgfSBmcm9tICcuL2VsZW1lbnRzL2VsZW1lbnQtY29sbGVjdG9yJztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBDYW5kbGUgfSBmcm9tICcuL2VsZW1lbnRzL2NhbmRsZSc7IFxuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyL3JlbmRlcmVyJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICcuL2VsZW1lbnRzL2VsZW1lbnQnO1xuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudHMvZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQgeyBXaGVlbCB9IGZyb20gJy4vZXZlbnRzL3doZWVsJztcbmltcG9ydCB7IE1vdXNlb3V0IH0gZnJvbSAnLi9ldmVudHMvbW91c2VvdXQnO1xuaW1wb3J0IHsgTW91c2Vkb3duIH0gZnJvbSAnLi9ldmVudHMvbW91c2Vkb3duJztcbmltcG9ydCB7IE1vdXNldXAgfSBmcm9tICcuL2V2ZW50cy9tb3VzZXVwJztcbmltcG9ydCB7IE1vdXNlbW92ZSB9IGZyb20gJy4vZXZlbnRzL21vdXNlbW92ZSc7XG5pbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXInO1xuaW1wb3J0IHsgSVZpZXdDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcuaW50ZXJmYWNlJztcbmltcG9ydCB7IENoYXJ0QVBJQ29udHJvbGxlciB9IGZyb20gJy4vYXBpL2FwaS1jb250cm9sbGVyJztcblxuZXhwb3J0IGNsYXNzIENoYXJ0TWFuYWdlciB7XG4gICAgcHVibGljIGFwaUNvbnRyb2xsZXIhOiBDaGFydEFQSUNvbnRyb2xsZXI7XG5cbiAgICBwcml2YXRlIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGRpbWVuc2lvbnMhOiBEaW1lbnNpb25zO1xuICAgIHByaXZhdGUgdmlldyE6IFZpZXc7XG4gICAgcHJpdmF0ZSByZW5kZXJlciE6IFJlbmRlcmVyO1xuICAgIHByaXZhdGUgZXZlbnRNYW5hZ2VyITogRXZlbnRNYW5hZ2VyO1xuICAgIHByaXZhdGUgY2FuZGxlcyE6IENhbmRsZVBheWxvYWRbXTtcbiAgICBwcml2YXRlIGxhc3RSZW5kZXIhOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBhbmltYXRpb25zITogQW5pbWF0aW9uc01hbmFnZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICAgICAgICB0aGlzLnNldENhbnZhc0RpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5zZXRWaWV3KCk7XG4gICAgICAgIHRoaXMuc2V0UmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDYW5kbGVzKGNhbmRsZXMpO1xuICAgICAgICB0aGlzLmFkZENhbnZhc0xpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxOTFmMmNcIjtcblxuICAgICAgICB0aGlzLnJlcXVlc3ROZXh0RnJhbWUoMCk7XG5cbiAgICAgICAgdGhpcy5hcGlDb250cm9sbGVyID0gbmV3IENoYXJ0QVBJQ29udHJvbGxlcih0aGlzLnZpZXcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVBcGlDb250cm9sbGVyKCk6IENoYXJ0QVBJQ29udHJvbGxlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaUNvbnRyb2xsZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW52YXNEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBbIGhvcml6b250YWxNYXJnaW4sIHZlcnRpY2FsTWFyZ2luIF0gPSBbIDc1LCA0MCBdO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBuZXcgRGltZW5zaW9ucyh0aGlzLmNhbnZhcywgaG9yaXpvbnRhbE1hcmdpbiwgdmVydGljYWxNYXJnaW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VmlldygpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgdmlld0NvbmZpZzogSVZpZXdDb25maWcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbE5hbWU6ICdNMScsXG4gICAgICAgICAgICBpbnRlcnZhbENhbmRsZXM6IDYwLFxuICAgICAgICAgICAgaW50ZXJ2YWxTdGVwOiAwLFxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xJbml0OiAxNTAsXG4gICAgICAgICAgICBpbnRlcnZhbENvbFJhdGlvczogWzE1MCwgMzAwLCA2MDAsIDEyMDBdLFxuICAgICAgICAgICAgaW50ZXJ2YWxTdWJDb2xSYXRpb3M6IFsxMCwgNSwgMSwgMV0sXG4gICAgICAgICAgICB2aWV3T2Zmc2V0OiAwXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFZpZXcodmlld0NvbmZpZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLmNvbnRleHQsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW5kbGVzKGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSk6IHZvaWQge1xuICAgICAgICBDYW5kbGUuZmluZE1heExvd0luRGF0YShjYW5kbGVzKTtcbiAgICAgICAgdGhpcy5jYW5kbGVzID0gY2FuZGxlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENhbnZhc0xpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKHRoaXMuY2FudmFzLCB0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldyk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgV2hlZWwoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2VvdXQoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2Vkb3duKCkpO1xuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5saXN0ZW4obmV3IE1vdXNldXAoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2Vtb3ZlKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdE5leHRGcmFtZSh0aW1lOiBudW1iZXIgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgaWYodGltZSkge1xuICAgICAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIuc2V0Q3VycmVudFRpbWVTdGFtcCh0aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLmxhc3RSZW5kZXIgfHwgdGltZSAmJiB0aW1lIC0gdGhpcy5sYXN0UmVuZGVyID49IDE2KSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZW5kZXIgPSB0aW1lID8/IDA7XG4gICAgICAgICAgICBDYW5kbGUucmVzZXRIaWdoTG93KCk7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZ2V0UmVuZGVyaW5nRWxlbWVudHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudHMoZWxlbWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlcXVlc3ROZXh0RnJhbWUuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZW5kZXJpbmdFbGVtZW50cygpOiBTZXQ8RWxlbWVudFtdPiB7XG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudENvbGxlY3Rvcih0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldywgdGhpcy5jYW5kbGVzKS5nZXRFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyRWxlbWVudHMoZWxlbWVudHM6IFNldDxFbGVtZW50W10+KTogdm9pZCB7XG4gICAgICAgIEFuaW1hdGlvbnNNYW5hZ2VyLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmRyYXcoZWxlbWVudHMpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDaGFydE1hbmFnZXIgfSBmcm9tICcuL2NoYXJ0LW1hbmFnZXInO1xuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xuaW1wb3J0IHsgQ2hhcnRBUElDb250cm9sbGVyIH0gZnJvbSAnLi9hcGkvYXBpLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgY2xhc3MgQ2hhcnQge1xuXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB0aGlzLmZldGNoQ2FuZGxlcygnaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhbmRsZXMnKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihjYW5kbGVzID0+IHRoaXMuaW5pdENoYXJ0KGNhbmRsZXMsIGNhbnZhcykpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5pbml0Q2hhcnQoW10sIGNhbnZhcykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FudmFzITogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjaGFydE1hbmFnZXIhOiBDaGFydE1hbmFnZXI7XG4gICAgcHJpdmF0ZSBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcblxuICAgIHByaXZhdGUgaW5pdENoYXJ0KGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSwgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5nZXRSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICAgICAgaWYodGhpcy5jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0TWFuYWdlciA9IG5ldyBDaGFydE1hbmFnZXIodGhpcy5jb250ZXh0LCB0aGlzLmNhbnZhcywgY2FuZGxlcy5yZXZlcnNlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZW5kZXJpbmdDb250ZXh0KCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwge1xuICAgICAgICBpZih3aW5kb3cuSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoQ2FuZGxlcyhlbmRwb2ludDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goZW5kcG9pbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBcGlDb250cm9sbGVyKCk6IENoYXJ0QVBJQ29udHJvbGxlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0TWFuYWdlci5jcmVhdGVBcGlDb250cm9sbGVyKCk7XG4gICAgfVxufSIsImltcG9ydCB7IEdyYXBoRGltZW5zaW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZGltZW5zaW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBEaW1lbnNpb25zIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBob3Jpem9udGFsTWFyZ2luOiBudW1iZXIsIHZlcnRpY2FsTWFyZ2luOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbE1hcmdpbiA9IGhvcml6b250YWxNYXJnaW47XG4gICAgICAgIHRoaXMudmVydGljYWxNYXJnaW4gPSB2ZXJ0aWNhbE1hcmdpbjtcbiAgICAgICAgdGhpcy5zZXREaW1lbnNpb25zKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgZGltZW5zaW9uczogR3JhcGhEaW1lbnNpb25zID0ge307XG4gICAgcHJpdmF0ZSBob3Jpem9udGFsTWFyZ2luOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB2ZXJ0aWNhbE1hcmdpbjogbnVtYmVyO1xuXG4gICAgcHVibGljIGdldFdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMud2lkdGggPz8gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0ID8/IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERpbWVuc2lvbnMoKTogR3JhcGhEaW1lbnNpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmVydGljYWxNYXJnaW4oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljYWxNYXJnaW47XG4gICAgfVxuXG4gICAgcHVibGljIGdldEhvcml6b250YWxNYXJnaW4oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG9yaXpvbnRhbE1hcmdpbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldERpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0Q2FudmFzU3R5bGVXaWR0aEFuZEhlaWdodCgpO1xuICAgICAgICB0aGlzLnNldENhbnZhc1dpZHRoQW5kSGVpZ2h0KCk7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q2FudmFzU3R5bGVXaWR0aEFuZEhlaWdodCh3aWR0aDogbnVtYmVyID0gMTI4MCwgaGVpZ2h0OiBudW1iZXIgPSA0MDApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW52YXNXaWR0aEFuZEhlaWdodCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDYW5kbGVQYXlsb2FkIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYW5kbGVzdGljayc7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7IEkyRENvb3JkcywgSVJlbmRlclByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3JlbmRlcmVsZW1lbnQnO1xuaW1wb3J0IHsgQ2FuZGxlUmVuZGVyZXIgfSBmcm9tICcuLi9yZW5kZXJlci9jYW5kbGUtcmVuZGVyZXInO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuXG5leHBvcnQgY2xhc3MgQ2FuZGxlIGV4dGVuZHMgRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNvb3JkczogSTJEQ29vcmRzLCBcbiAgICAgICAgcHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXMsIFxuICAgICAgICBjYW5kbGU6IENhbmRsZVBheWxvYWRcbiAgICApIHtcbiAgICAgICAgc3VwZXIoY29vcmRzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50SGlnaExvdyhjYW5kbGUpO1xuICAgICAgICBDYW5kbGUuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XG4gICAgICAgIHRoaXMuc2V0Q29sb3IoY2FuZGxlKTtcblxuICAgICAgICB0aGlzLndpZHRoID0gcHJvcGVydGllcy53aWR0aDtcbiAgICAgICAgdGhpcy55RW5kID0gY2FuZGxlLm9wZW47XG4gICAgICAgIHRoaXMueVN0YXJ0ID0gY2FuZGxlLmNsb3NlO1xuICAgICAgICB0aGlzLnlIaWdoID0gY2FuZGxlLmhpZ2g7XG4gICAgICAgIHRoaXMueUxvdyA9IGNhbmRsZS5sb3c7XG4gICAgICAgIHRoaXMudGltZSA9IGNhbmRsZS50aW1lO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHJlbmRlcmVyOiBDYW5kbGVSZW5kZXJlcjtcblxuICAgIHByaXZhdGUgc3RhdGljIGN1cnJlbnRNYXhIaWdoPzogbnVtYmVyO1xuICAgIHByaXZhdGUgc3RhdGljIGN1cnJlbnRNYXhMb3c/OiBudW1iZXI7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBtYXhIaWdoOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbWF4TG93OiBudW1iZXI7XG5cbiAgICBwcml2YXRlIGNvbG9yITogc3RyaW5nO1xuICAgIFxuICAgIHB1YmxpYyB3aWR0aD86IG51bWJlcjtcbiAgICBwdWJsaWMgeUhpZ2g6IG51bWJlcjtcbiAgICBwdWJsaWMgeUxvdzogbnVtYmVyO1xuICAgIHByaXZhdGUgdGltZTogc3RyaW5nO1xuXG4gICAgcHVibGljIG92ZXJyaWRlIHJlbmRlcihlbGVtZW50OiBDYW5kbGUsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGltZW5zaW9uczogRGltZW5zaW9ucyk6IHZvaWQge1xuICAgICAgICBDYW5kbGUucmVuZGVyZXIuZHJhdyhlbGVtZW50LCBkaW1lbnNpb25zLCBjb250ZXh0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2FuZGxlVGltZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50aW1lO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q29sb3IoY2FuZGxlOiBDYW5kbGVQYXlsb2FkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjYW5kbGUub3BlbiA+IGNhbmRsZS5jbG9zZSA/ICcjNTZiNzg2JyA6ICcjZWI0ZTVjJztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29sb3IoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDdXJyZW50SGlnaExvdyhjYW5kbGU6IENhbmRsZVBheWxvYWQpOiB2b2lkIHtcbiAgICAgICAgaWYoIUNhbmRsZS5jdXJyZW50TWF4SGlnaCB8fCBjYW5kbGUuaGlnaCA+IENhbmRsZS5jdXJyZW50TWF4SGlnaCkge1xuICAgICAgICAgICAgQ2FuZGxlLmN1cnJlbnRNYXhIaWdoID0gY2FuZGxlLmhpZ2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZighQ2FuZGxlLmN1cnJlbnRNYXhMb3cgfHwgY2FuZGxlLmxvdyA8IENhbmRsZS5jdXJyZW50TWF4TG93KSB7XG4gICAgICAgICAgICBDYW5kbGUuY3VycmVudE1heExvdyA9IGNhbmRsZS5sb3c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZpbmRNYXhMb3dJbkRhdGEoY2FuZGxlc0RhdGE6IENhbmRsZVBheWxvYWRbXSk6IHZvaWQge1xuICAgICAgICBjYW5kbGVzRGF0YS5mb3JFYWNoKGNhbmRsZSA9PiB7XG4gICAgICAgICAgICBpZighdGhpcy5tYXhIaWdoIHx8IGNhbmRsZS5oaWdoID4gdGhpcy5tYXhIaWdoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhIaWdoID0gY2FuZGxlLmhpZ2g7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLm1heExvdyB8fCBjYW5kbGUubG93IDwgdGhpcy5tYXhMb3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1heExvdyA9IGNhbmRsZS5sb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRNYXhMb3dJbkRhdGEoKTogbnVtYmVyW10ge1xuICAgICAgICByZXR1cm4gWyB0aGlzLm1heEhpZ2gsIHRoaXMubWF4TG93IF07XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXNldEhpZ2hMb3coKTogdm9pZCB7XG4gICAgICAgIENhbmRsZS5jdXJyZW50TWF4SGlnaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgQ2FuZGxlLmN1cnJlbnRNYXhMb3cgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIaWdoTG93KCk6IEFycmF5PG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gWyBDYW5kbGUuY3VycmVudE1heEhpZ2ggPz8gMCwgQ2FuZGxlLmN1cnJlbnRNYXhMb3cgPz8gMCBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlnaCgpOiBudW1iZXIge1xuICAgICAgICBpZihDYW5kbGUuY3VycmVudE1heEhpZ2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZXN0YWJsaXNoIGN1cnJlbnRNYXhIaWdoIGZvciBhIGNhbmRsZScpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENhbmRsZS5jdXJyZW50TWF4SGlnaDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldExvdygpOiBudW1iZXIge1xuICAgICAgICBpZihDYW5kbGUuY3VycmVudE1heExvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBlc3RhYmxpc2ggY3VycmVudE1heExvdyBmb3IgYSBjYW5kbGUnKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDYW5kbGUuY3VycmVudE1heExvdztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgICAgIGlmKCFDYW5kbGUucmVuZGVyZXIpIHtcbiAgICAgICAgICAgIENhbmRsZS5yZW5kZXJlciA9IG5ldyBDYW5kbGVSZW5kZXJlcigpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcbmltcG9ydCB7IENhbmRsZVBheWxvYWQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbmRsZXN0aWNrJztcbmltcG9ydCB7IENhbmRsZSB9IGZyb20gJy4vY2FuZGxlJztcbmltcG9ydCB7IExpbmUgfSBmcm9tICcuL2xpbmUnO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQgeyBUZXh0IH0gZnJvbSAnLi90ZXh0JztcbmltcG9ydCB7IE1hdGhVdGlscyB9IGZyb20gJy4uL21hdGgtdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudENvbGxlY3RvciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsXG4gICAgICAgIHZpZXc6IFZpZXcsXG4gICAgICAgIGNhbmRsZURhdGE6IENhbmRsZVBheWxvYWRbXSxcbiAgICApIHtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgdGhpcy5jYW5kbGVEYXRhID0gY2FuZGxlRGF0YTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyaW5nRWxlbWVudHNTZXQ6IFNldDxFbGVtZW50W10+ID0gbmV3IFNldCgpO1xuXG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBEaW1lbnNpb25zO1xuICAgIHByaXZhdGUgdmlldzogVmlldztcbiAgICBwcml2YXRlIGNhbmRsZURhdGE6IENhbmRsZVBheWxvYWRbXTtcbiAgICBwcml2YXRlIGNhbmRsZXM6IENhbmRsZVtdID0gW107XG4gICAgcHJpdmF0ZSBtYWluQ29sdW1uTGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgc3ViQ29sdW1uTGluZXM6IExpbmVbXSA9IFtdO1xuICAgIHByaXZhdGUgdGV4dDogVGV4dFtdID0gW107XG4gICAgcHJpdmF0ZSBob3Jpem9udGFsTGluZXM6IExpbmVbXSA9IFtdO1xuXG4gICAgcHVibGljIGdldEVsZW1lbnRzKCk6IFNldDxFbGVtZW50W10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyaW5nRWxlbWVudHNTZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRFbGVtZW50cygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FudmFzV2lkdGggPSB0aGlzLmRpbWVuc2lvbnMuZ2V0V2lkdGgoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAwO1xuXG4gICAgICAgIGZvcihsZXQgeERyYXdpbmdPZmZzZXQgPSBjYW52YXNXaWR0aDsgeERyYXdpbmdPZmZzZXQgKyB0aGlzLnZpZXcuZ2V0Vmlld09mZnNldCgpID4gMDsgeERyYXdpbmdPZmZzZXQgPSB4RHJhd2luZ09mZnNldCAtIHRoaXMudmlldy5nZXRDb2xJbnRlcnZhbCgpKSB7IFxuICAgICAgICAgICAgY29uc3QgeERyYXdpbmdQb3NpdGlvbiA9IHhEcmF3aW5nT2Zmc2V0ICsgdGhpcy52aWV3LmdldFZpZXdPZmZzZXQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRIb3Jpem9udGFsTWFyZ2luKCk7XG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uKys7ICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZih4RHJhd2luZ1Bvc2l0aW9uID4gMCAmJiB4RHJhd2luZ1Bvc2l0aW9uIDwgY2FudmFzV2lkdGggKyB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAqIDIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENhbmRsZXNJbkludGVydmFsKHhEcmF3aW5nUG9zaXRpb24sIHRoaXMuY2FuZGxlRGF0YSwgY3VycmVudENvbHVtbiwgY2FudmFzV2lkdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGltZVN0YW1wcyh4RHJhd2luZ1Bvc2l0aW9uLCBjdXJyZW50Q29sdW1uLCB0aGlzLmNhbmRsZURhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkSG9yaXpvbnRhbExpbmVzKCk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldC5hZGQodGhpcy50ZXh0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldC5hZGQodGhpcy5zdWJDb2x1bW5MaW5lcyk7XG4gICAgICAgIHRoaXMucmVuZGVyaW5nRWxlbWVudHNTZXQuYWRkKHRoaXMubWFpbkNvbHVtbkxpbmVzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldC5hZGQodGhpcy5ob3Jpem9udGFsTGluZXMpO1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLmNhbmRsZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQ2FuZGxlc0luSW50ZXJ2YWwoeE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb246IG51bWJlciwgY2FuZGxlc0RhdGE6IENhbmRsZVBheWxvYWRbXSwgY3VycmVudENvbHVtbjogbnVtYmVyLCBncmFwaFdpZHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcyA9IHRoaXMuZ2V0SW50ZXJ2YWxDYW5kbGVEaXN0YW5jZSgpO1xuICAgICAgICBjb25zdCBjYW5kbGVzSW5JbnRlcnZhbCA9IHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKTtcblxuICAgICAgICBmb3IobGV0IGNhbmRsZSA9IDA7IGNhbmRsZSA8IGNhbmRsZXNJbkludGVydmFsOyBjYW5kbGUrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENhbmRsZVRvUmVuZGVyID0gY2FuZGxlc0RhdGFbY2FuZGxlICsgY2FuZGxlc0luSW50ZXJ2YWwgKiAoY3VycmVudENvbHVtbiAtIDEpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FuZGxlSWZJblZpZXcoeE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb24sIGNhbmRsZSwgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcywgZ3JhcGhXaWR0aCwgY3VycmVudENhbmRsZVRvUmVuZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW50ZXJ2YWxDYW5kbGVEaXN0YW5jZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLyB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDYW5kbGVJZkluVmlldyhcbiAgICAgICAgeE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb246IG51bWJlciwgXG4gICAgICAgIGNhbmRsZU51bUluSW50ZXJ2YWw6IG51bWJlciwgXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXM6IG51bWJlciwgXG4gICAgICAgIGdyYXBoV2lkdGg6IG51bWJlcixcbiAgICAgICAgY3VycmVudENhbmRsZVRvUmVuZGVyOiBDYW5kbGVQYXlsb2FkXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmKFxuICAgICAgICAgICAgeE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb24gLSBjYW5kbGVOdW1JbkludGVydmFsICogZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcyA+IDAgJiYgXG4gICAgICAgICAgICB4TWFpbkNvbHVtbkRyYXdpbmdQb3NpdGlvbiAtIGNhbmRsZU51bUluSW50ZXJ2YWwgKiBkaXN0YW5jZUJldHdlZW5DYW5kbGVzIDwgZ3JhcGhXaWR0aCAtIHRoaXMuZGltZW5zaW9ucy5nZXRIb3Jpem9udGFsTWFyZ2luKCkgKyAxMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiA9IHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uIC0gY2FuZGxlTnVtSW5JbnRlcnZhbCAqIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXM7XG4gICAgICAgICAgICB0aGlzLmNhbmRsZXMucHVzaChuZXcgQ2FuZGxlKHsgeFN0YXJ0OiBjYW5kbGVYUmVuZGVyUG9zaXRpb24gfSwgeyB3aWR0aDogdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLyAxMDAgfSwgY3VycmVudENhbmRsZVRvUmVuZGVyKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1haW5Db2x1bW5EaXZpZGVyID0gdGhpcy52aWV3LmdldERpdmlkZXIoKTtcbiAgICAgICAgICAgIGNvbnN0IG1haW5Db2x1bW5MaW5lSW50ZXJ2YWwgPSB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCkgLyBtYWluQ29sdW1uRGl2aWRlcjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoY2FuZGxlTnVtSW5JbnRlcnZhbCAlIHRoaXMudmlldy5nZXRTdWJDb2xSYXRpbygpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJDb2x1bW5MaW5lcy5wdXNoKG5ldyBMaW5lKHsgeFN0YXJ0OiBjYW5kbGVYUmVuZGVyUG9zaXRpb24sIHhFbmQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiwgeVN0YXJ0OiAwLCB5RW5kOiB0aGlzLmRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmRpbWVuc2lvbnMuZ2V0VmVydGljYWxNYXJnaW4oKSB9LCB7IHdpZHRoOiAuMSB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNhbmRsZU51bUluSW50ZXJ2YWwgJSBtYWluQ29sdW1uTGluZUludGVydmFsID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sdW1uTGluZXMucHVzaChuZXcgTGluZSh7IHhTdGFydDogY2FuZGxlWFJlbmRlclBvc2l0aW9uLCB4RW5kOiBjYW5kbGVYUmVuZGVyUG9zaXRpb24sIHlTdGFydDogMCwgeUVuZDogdGhpcy5kaW1lbnNpb25zLmdldEhlaWdodCgpIC0gdGhpcy5kaW1lbnNpb25zLmdldFZlcnRpY2FsTWFyZ2luKCkgfSwgeyB3aWR0aDogLjMgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRUaW1lU3RhbXBzKHhTdGFydDogbnVtYmVyLCBjb2x1bW5PZmZzZXQ6IG51bWJlciwgY2FuZGxlc0RhdGE6IENhbmRsZVBheWxvYWRbXSk6IHZvaWQge1xuICAgICAgICAgICAgY29uc3QgeURyYXdpbmdQb3NpdGlvbiA9IHRoaXMuZGltZW5zaW9ucy5nZXRIZWlnaHQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRWZXJ0aWNhbE1hcmdpbigpICsgMjM7XG4gICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShjYW5kbGVzRGF0YVswXS50aW1lKSk7XG4gICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgLSB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCkgKiAoY29sdW1uT2Zmc2V0IC0gMSkpO1xuICAgICAgICAgICAgdGhpcy50ZXh0LnB1c2gobmV3IFRleHQoeyB4U3RhcnQ6IHhTdGFydCAtIDEwLCB5U3RhcnQ6IHlEcmF3aW5nUG9zaXRpb24gfSwge30sIGAke2RhdGUuZ2V0SG91cnMoKX06JHtkYXRlLmdldE1pbnV0ZXMoKX1gKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlQmV0d2VlbkNhbmRsZSA9IHRoaXMudmlldy5nZXRDb2xJbnRlcnZhbCgpIC8gdGhpcy52aWV3LmdldEludGVydmFsQ2FuZGxlcygpO1xuICAgICAgICAgICAgbGV0IHByZXZZID0geFN0YXJ0XG5cbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRyYXdpbmdYID0geFN0YXJ0IC0gMTAgLSAoZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlICsgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlICogaSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoIXByZXZZIHx8IHByZXZZIC0gZHJhd2luZ1ggPiA0MCAmJiB4U3RhcnQgLSBkcmF3aW5nWCA8IHRoaXMudmlldy5nZXRDb2xJbnRlcnZhbCgpIC0gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKERhdGUucGFyc2UoY2FuZGxlc0RhdGFbMF0udGltZSkpO1xuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgLSB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCkgKiAoY29sdW1uT2Zmc2V0IC0gMSkgLSBpIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dC5wdXNoKG5ldyBUZXh0KHsgeFN0YXJ0OiBkcmF3aW5nWCwgeVN0YXJ0OiB5RHJhd2luZ1Bvc2l0aW9uIH0sIHt9LCBgJHtkYXRlLmdldEhvdXJzKCl9OiR7ZGF0ZS5nZXRNaW51dGVzKCl9YCkpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2WSA9IGRyYXdpbmdYO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEhvcml6b250YWxMaW5lcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgeyBoZWlnaHQgfSA9IHRoaXMuZGltZW5zaW9ucy5nZXREaW1lbnNpb25zKCk7XG4gICAgICAgIGNvbnN0IFsgY3VycmVudE1heCwgY3VycmVudExvdyBdID0gQ2FuZGxlLmdldEhpZ2hMb3coKTtcblxuICAgICAgICBsZXQgY3VycmVudFlab29tID0gMTtcblxuICAgICAgICB3aGlsZSgoTWF0aC5mbG9vcihjdXJyZW50TWF4KSAtIE1hdGguZmxvb3IoY3VycmVudExvdykpIC8gY3VycmVudFlab29tID49IDEwKSB7XG4gICAgICAgICAgICBjdXJyZW50WVpvb20gPSBjdXJyZW50WVpvb20gKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUoKE1hdGguZmxvb3IoY3VycmVudE1heCkgLSBNYXRoLmZsb29yKGN1cnJlbnRMb3cpKSAvIGN1cnJlbnRZWm9vbSA8PSA2KSB7XG4gICAgICAgICAgICBjdXJyZW50WVpvb20gPSBjdXJyZW50WVpvb20gLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGxldCBob3Jpem9udGFsTGluZU9mZnNldCA9IE1hdGguZmxvb3IoY3VycmVudE1heCk7IGhvcml6b250YWxMaW5lT2Zmc2V0ID49IGN1cnJlbnRMb3c7IGhvcml6b250YWxMaW5lT2Zmc2V0ID0gaG9yaXpvbnRhbExpbmVPZmZzZXQgLSAuNSkge1xuICAgICAgICAgICAgaWYoaG9yaXpvbnRhbExpbmVPZmZzZXQgPD0gY3VycmVudE1heCAmJiBob3Jpem9udGFsTGluZU9mZnNldCA+PSBjdXJyZW50TG93KSB7XG5cbiAgICAgICAgICAgICAgICBpZihOdW1iZXIoaG9yaXpvbnRhbExpbmVPZmZzZXQudG9GaXhlZCgyKSkgJSBjdXJyZW50WVpvb20gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGlvbiA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZSgoaGVpZ2h0ID8/IDApIC0gdGhpcy5kaW1lbnNpb25zLmdldFZlcnRpY2FsTWFyZ2luKCksIGhvcml6b250YWxMaW5lT2Zmc2V0LCBjdXJyZW50TG93LCBjdXJyZW50TWF4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeEVuZCA9IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpIC0gNjA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbExpbmVzLnB1c2gobmV3IExpbmUoeyB4U3RhcnQ6IDAsIHhFbmQsIHlTdGFydDogaW50ZXJwb2xhdGlvbiwgeUVuZDogaW50ZXJwb2xhdGlvbiB9LCB7IHdpZHRoOiAuMSB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dC5wdXNoKG5ldyBUZXh0KHsgeFN0YXJ0OiB0aGlzLmRpbWVuc2lvbnMuZ2V0V2lkdGgoKSAtIDUwLCB5U3RhcnQ6IGludGVycG9sYXRpb24gKyA2IH0sIHt9LCBgJHtob3Jpem9udGFsTGluZU9mZnNldC50b0ZpeGVkKDIpfWApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgSTJEQ29vcmRzLCBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgeyB4U3RhcnQsIHhFbmQsIHlTdGFydCwgeUVuZCB9OiBJMkRDb29yZHMsIFxuICAgICAgICBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcyxcbiAgICApIHtcbiAgICAgICAgdGhpcy54U3RhcnQgPSB4U3RhcnQgPz8gMDtcbiAgICAgICAgdGhpcy54RW5kID0geEVuZCA/PyB4U3RhcnQgPz8gMDtcbiAgICAgICAgdGhpcy55U3RhcnQgPSB5U3RhcnQgPz8gMDtcbiAgICAgICAgdGhpcy55RW5kID0geUVuZCA/PyB5U3RhcnQgPz8gMDtcbiAgICAgICAgdGhpcy5yZW5kZXJQcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgeFN0YXJ0OiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIHhFbmQ6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgeVN0YXJ0OiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIHlFbmQ6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXM7XG5cbiAgICBwdWJsaWMgZ2V0WFN0YXJ0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnhTdGFydDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0WEVuZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54RW5kO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRZU3RhcnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueVN0YXJ0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRZRW5kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnlFbmQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFByb3BlcnRpZXMoKTogSVJlbmRlclByb3BlcnRpZXMge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoZWxlbWVudDogRWxlbWVudCwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkaW1lbnNpb25zOiBEaW1lbnNpb25zKTogdm9pZCB7fTtcbn0iLCJpbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudFwiO1xuaW1wb3J0IHsgSTJEQ29vcmRzLCBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBMaW5lUmVuZGVyZXIgfSBmcm9tICcuLi9yZW5kZXJlci9saW5lLXJlbmRlcmVyJztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tIFwiLi4vZGltZW5zaW9uc1wiO1xuXG5leHBvcnQgY2xhc3MgTGluZSBleHRlbmRzIEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvb3JkczogSTJEQ29vcmRzLCBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcykge1xuICAgICAgICBzdXBlcihjb29yZHMsIHByb3BlcnRpZXMpO1xuXG4gICAgICAgIExpbmUuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVuZGVyZXI6IExpbmVSZW5kZXJlcjtcblxuICAgIHB1YmxpYyBvdmVycmlkZSByZW5kZXIoZWxlbWVudDogTGluZSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkaW1lbnNpb25zOiBEaW1lbnNpb25zKTogdm9pZCB7XG4gICAgICAgIExpbmUucmVuZGVyZXIuZHJhdyhlbGVtZW50LCBkaW1lbnNpb25zLCBjb250ZXh0LCB0aGlzLmdldFByb3BlcnRpZXMoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVJlbmRlcmVyKCk6IHZvaWQge1xuICAgICAgICBpZighTGluZS5yZW5kZXJlcikge1xuICAgICAgICAgICAgTGluZS5yZW5kZXJlciA9IG5ldyBMaW5lUmVuZGVyZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJMkRDb29yZHMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3JlbmRlcmVsZW1lbnQnO1xuaW1wb3J0IHsgSVJlbmRlclByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3JlbmRlcmVsZW1lbnQnO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVGV4dFJlbmRlcmVyIH0gZnJvbSAnLi4vcmVuZGVyZXIvdGV4dC1yZW5kZXJlcic7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50JztcblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb29yZHM6IEkyRENvb3JkcywgcHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXMsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoY29vcmRzLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIFRleHQuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVuZGVyZXI6IFRleHRSZW5kZXJlcjtcbiAgICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgcmVuZGVyKGVsZW1lbnQ6IFRleHQsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGltZW5zaW9uczogRGltZW5zaW9ucyk6IHZvaWQge1xuICAgICAgICBUZXh0LnJlbmRlcmVyLmRyYXcoZWxlbWVudCwgZGltZW5zaW9ucywgY29udGV4dCwgdGhpcy5nZXRQcm9wZXJ0aWVzKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgICAgIGlmKCFUZXh0LnJlbmRlcmVyKSB7XG4gICAgICAgICAgICBUZXh0LnJlbmRlcmVyID0gbmV3IFRleHRSZW5kZXJlcigpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcbmltcG9ydCB7IENoYXJ0RXZlbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2V2ZW50JztcblxuZXhwb3J0IGNsYXNzIEV2ZW50TWFuYWdlciB7XG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgZGltZW5zaW9uczogRGltZW5zaW9ucztcbiAgICBwcml2YXRlIHZpZXc6IFZpZXc7XG5cbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3KSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgbGlzdGVuKGV2ZW50OiBDaGFydEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQuZXZlbnROYW1lLCAoY2FudmFzRXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5jYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuY2FudmFzLCB0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldywgY2FudmFzRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIE1vdXNlZG93biBpbXBsZW1lbnRzIENoYXJ0RXZlbnQge1xuICAgIGV2ZW50TmFtZTogc3RyaW5nID0gJ21vdXNlZG93bic7XG5cbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIEV2ZW50TWFuYWdlci5tb3VzZURvd24gPSB0cnVlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDaGFydEV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ldmVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuL2V2ZW50LW1hbmFnZXInO1xuXG5leHBvcnQgY2xhc3MgTW91c2Vtb3ZlIGltcGxlbWVudHMgQ2hhcnRFdmVudCB7XG4gICAgZXZlbnROYW1lID0gJ21vdXNlbW92ZSc7XG5cbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYodmlldy5nZXRWaWV3T2Zmc2V0KCkgKyBldmVudC5tb3ZlbWVudFggPiAwICYmIEV2ZW50TWFuYWdlci5tb3VzZURvd24pIHtcbiAgICAgICAgICAgIHZpZXcuc2V0Vmlld09mZnNldCh2aWV3LmdldFZpZXdPZmZzZXQoKSArIGV2ZW50Lm1vdmVtZW50WCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIE1vdXNlb3V0IGltcGxlbWVudHMgQ2hhcnRFdmVudCB7XG4gICAgZXZlbnROYW1lOiBzdHJpbmcgPSAnbW91c2VvdXQnO1xuXG4gICAgcHVibGljIGNhbGxiYWNrKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICBFdmVudE1hbmFnZXIubW91c2VEb3duID0gZmFsc2U7XG4gICAgfVxufSIsImltcG9ydCB7IENoYXJ0RXZlbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2V2ZW50JztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gJy4vZXZlbnQtbWFuYWdlcic7XG5cbmV4cG9ydCBjbGFzcyBNb3VzZXVwIGltcGxlbWVudHMgQ2hhcnRFdmVudCB7XG4gICAgZXZlbnROYW1lID0gJ21vdXNldXAnO1xuXG4gICAgcHVibGljIGNhbGxiYWNrKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICBFdmVudE1hbmFnZXIubW91c2VEb3duID0gZmFsc2U7XG4gICAgfVxufSIsImltcG9ydCB7IENoYXJ0RXZlbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2V2ZW50JztcbmltcG9ydCB7IEFuaW1hdGlvbnNNYW5hZ2VyIH0gZnJvbSAnLi4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXInO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuXG5leHBvcnQgY2xhc3MgV2hlZWwgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcbiAgICBldmVudE5hbWUgPSAnd2hlZWwnO1xuXG4gICAgcHVibGljIGNhbGxiYWNrKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIHdoZWVsRXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YVlWYWx1ZSA9ICh3aGVlbEV2ZW50LmRlbHRhWSA+IDAgJiYgd2hlZWxFdmVudC5kZWx0YVkgIT09IDAgPyAxIDogLTEpIC8gMiAqIHZpZXcuZ2V0RGl2aWRlcigpO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgICAgICAgb2Zmc2V0WDogd2hlZWxFdmVudC5vZmZzZXRYLFxuICAgICAgICAgICAgZGVsdGFZOiBkZWx0YVlWYWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIuc3RhcnRBbmltYXRpb24oXG4gICAgICAgICAgICAnd2hlZWwnLFxuICAgICAgICAgICAgNDAwLFxuICAgICAgICAgICAgWzBdLFxuICAgICAgICAgICAgW2V2ZW50LmRlbHRhWV0sXG4gICAgICAgICAgICAoZWFzZWRWYWx1ZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgICAgKC1ldmVudC5kZWx0YVkgJiYgdmlldy5tYXhab29tSW4oLWV2ZW50LmRlbHRhWSkpIHx8ICgtZXZlbnQuZGVsdGFZICYmIHZpZXcubWF4Wm9vbU91dCgtZXZlbnQuZGVsdGFZKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IFsgd2hlZWxWYWx1ZSBdID0gZWFzZWRWYWx1ZXM7IFxuICAgICAgICAgICAgICAgIFdoZWVsLmNhbGN1bGF0ZShjYW52YXMsIGRpbWVuc2lvbnMsIHZpZXcsIGV2ZW50IGFzIFdoZWVsRXZlbnQsIC13aGVlbFZhbHVlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogV2hlZWxFdmVudCwgd2hlZWxWYWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGdyYXBoV2lkdGggPSBkaW1lbnNpb25zLmdldFdpZHRoKCk7XG4gICAgICAgIGNvbnN0IHNjcm9sbFNwZWVkID0gd2hlZWxWYWx1ZTtcbiAgICAgICAgY29uc3Qgem9vbU9mZnNldFN5bmNWYWx1ZSA9IHRoaXMuY2FsY3VsYXRlT2Zmc2V0U3luYyhncmFwaFdpZHRoLCBkaW1lbnNpb25zLCBldmVudCwgc2Nyb2xsU3BlZWQsIHZpZXcpO1xuICAgICAgICBcbiAgICAgICAgaWYoem9vbU9mZnNldFN5bmNWYWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlWm9vbShzY3JvbGxTcGVlZCwgem9vbU9mZnNldFN5bmNWYWx1ZSwgdmlldyk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU9mZnNldE92ZXJmbG93KHZpZXcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlT2Zmc2V0U3luYyhncmFwaFdpZHRoOiBudW1iZXIsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIGV2ZW50OiBXaGVlbEV2ZW50LCBzY3JvbGxTcGVlZDogbnVtYmVyLCB2aWV3OiBWaWV3KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChncmFwaFdpZHRoICsgdmlldy5nZXRWaWV3T2Zmc2V0KCkgLSBkaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSAtIGV2ZW50Lm9mZnNldFgpIC8gdmlldy5nZXRDb2xJbnRlcnZhbCgpICogc2Nyb2xsU3BlZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXhlY3V0ZVpvb20oc2Nyb2xsU3BlZWQ6IG51bWJlciwgem9vbU9mZnNldFN5bmNWYWx1ZTogbnVtYmVyLCB2aWV3OiBWaWV3KTogdm9pZCB7XG4gICAgICAgIHZpZXcuYWRkQ29sSW50ZXJ2YWwoc2Nyb2xsU3BlZWQpO1xuICAgICAgICB2aWV3LmFkZFZpZXdPZmZzZXQoem9vbU9mZnNldFN5bmNWYWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXBkYXRlT2Zmc2V0T3ZlcmZsb3codmlldzogVmlldyk6IHZvaWQge1xuICAgICAgICBpZih2aWV3LmdldFZpZXdPZmZzZXQoKSA8PSAwKSB7XG4gICAgICAgICAgICB2aWV3LnNldFZpZXdPZmZzZXQoMCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIE1hdGhVdGlscyB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIHN0YXRpYyBpbnRlcnBvbGF0ZShjaGFydEhlaWdodDogbnVtYmVyLCB5VG9EcmF3OiBudW1iZXIsIG1heExvd0NhbmRsZTogbnVtYmVyLCBtYXhIaWdoQ2FuZGxlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9uID0gKChjaGFydEhlaWdodCkgKiAoeVRvRHJhdyAtIG1heExvd0NhbmRsZSkpIC8gKG1heEhpZ2hDYW5kbGUgLSBtYXhMb3dDYW5kbGUpO1xuICAgICAgICBpZihpbnRlcnBvbGF0aW9uID4gY2hhcnRIZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGludGVycG9sYXRpb24gLSBjaGFydEhlaWdodCAvIDIpO1xuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0SGVpZ2h0IC8gMiAtIGRpZmY7XG4gICAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGlvbiA8IGNoYXJ0SGVpZ2h0IC8gMikge1xuICAgICAgICAgICAgbGV0IGRpZmYgPSBNYXRoLmFicyhpbnRlcnBvbGF0aW9uIC0gY2hhcnRIZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIHJldHVybiBjaGFydEhlaWdodCAvIDIgKyBkaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGludGVycG9sYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgQ2FuZGxlIH0gZnJvbSAnLi4vZWxlbWVudHMvY2FuZGxlJztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IE1hdGhVdGlscyB9IGZyb20gJy4uL21hdGgtdXRpbHMnO1xuZXhwb3J0IGNsYXNzIENhbmRsZVJlbmRlcmVyIHtcbiAgICBwdWJsaWMgZHJhdyhjYW5kbGU6IENhbmRsZSwgZGltZW5zaW9uczogRGltZW5zaW9ucywgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IFsgbWF4SGlnaENhbmRsZSwgbWF4TG93Q2FuZGxlIF0gPSBDYW5kbGUuZ2V0SGlnaExvdygpOyBcbiAgICAgICAgY29uc3QgZ3JhcGhIZWlnaHQgPSBkaW1lbnNpb25zLmdldEhlaWdodCgpIC0gZGltZW5zaW9ucy5nZXRWZXJ0aWNhbE1hcmdpbigpO1xuXG4gICAgICAgIGlmKGNhbmRsZS5nZXRYU3RhcnQoKSA8PSBkaW1lbnNpb25zLmdldFdpZHRoKCkgLSBkaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSArIDEwKSB7XG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ0hpZ2ggPSBNYXRoVXRpbHMuaW50ZXJwb2xhdGUoZ3JhcGhIZWlnaHQsIGNhbmRsZS55SGlnaCwgbWF4TG93Q2FuZGxlLCBtYXhIaWdoQ2FuZGxlKTtcbiAgICAgICAgICAgIGNvbnN0IHlEcmF3aW5nTG93ID0gTWF0aFV0aWxzLmludGVycG9sYXRlKGdyYXBoSGVpZ2h0LCBjYW5kbGUueUxvdywgbWF4TG93Q2FuZGxlLCBtYXhIaWdoQ2FuZGxlKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhjYW5kbGUuZ2V0WFN0YXJ0KCksIHlEcmF3aW5nTG93KTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGNhbmRsZS5nZXRYU3RhcnQoKSwgeURyYXdpbmdIaWdoKTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjYW5kbGUuZ2V0Q29sb3IoKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cblxuICAgICAgICAgICAgY29uc3QgeURyYXdpbmdTdGFydCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLmdldFlTdGFydCgpLCBtYXhMb3dDYW5kbGUsIG1heEhpZ2hDYW5kbGUpO1xuICAgICAgICAgICAgY29uc3QgeURyYXdpbmdFbmQgPSBNYXRoVXRpbHMuaW50ZXJwb2xhdGUoZ3JhcGhIZWlnaHQsIGNhbmRsZS5nZXRZRW5kKCksIG1heExvd0NhbmRsZSwgbWF4SGlnaENhbmRsZSk7XG4gICAgXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5yb3VuZFJlY3QoY2FuZGxlLmdldFhTdGFydCgpIC0gKDEgKiAoY2FuZGxlLndpZHRoID8/IDApKSAvIDIsIHlEcmF3aW5nRW5kLCAxICogKGNhbmRsZS53aWR0aCA/PyAwKSwgeURyYXdpbmdTdGFydCAtIHlEcmF3aW5nRW5kLCAxKVxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjYW5kbGUuZ2V0Q29sb3IoKTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi4vZWxlbWVudHMvbGluZSc7XG5cbmV4cG9ydCBjbGFzcyBMaW5lUmVuZGVyZXIge1xuICAgIHB1YmxpYyBkcmF3KGxpbmU6IExpbmUsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXMpOiB2b2lkIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8obGluZS5nZXRYU3RhcnQoKSwgbGluZS5nZXRZU3RhcnQoKSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGxpbmUuZ2V0WEVuZCgpLCBsaW5lLmdldFlFbmQoKSk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0E5QTlBOSc7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcHJvcGVydGllcy53aWR0aCA/PyAxO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi4vZWxlbWVudHMvZWxlbWVudCdcbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICAgICAgZGltZW5zaW9uczogRGltZW5zaW9uc1xuICAgICkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgZGltZW5zaW9uczogRGltZW5zaW9ucztcblxuICAgIHB1YmxpYyBkcmF3KGVsZW1lbnRTZXQ6IFNldDxFbGVtZW50W10+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXJWaWV3KCk7XG5cbiAgICAgICAgZWxlbWVudFNldC5mb3JFYWNoKHJlbmRlckVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgcmVuZGVyRWxlbWVudC5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihlbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJWaWV3KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpLCB0aGlzLmRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYoZWxlbWVudC5nZXRYU3RhcnQoKSA8PSB0aGlzLmRpbWVuc2lvbnMuZ2V0V2lkdGgoKSkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW5kZXIoZWxlbWVudCwgdGhpcy5jb250ZXh0LCB0aGlzLmRpbWVuc2lvbnMpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudFwiO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gXCIuLi9kaW1lbnNpb25zXCI7XG5pbXBvcnQgeyBUZXh0IH0gZnJvbSBcIi4uL2VsZW1lbnRzL3RleHRcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRSZW5kZXJlciB7XG4gICAgcHVibGljIGRyYXcodGV4dDogVGV4dCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcyk6IHZvaWQge1xuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjlweCBCYXJsb3dcIjtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0E5QTlBOSc7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQodGV4dC5nZXRWYWx1ZSgpLCB0ZXh0LmdldFhTdGFydCgpLCB0ZXh0LmdldFlTdGFydCgpKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSVZpZXdDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKHZpZXdDb25maWc6IElWaWV3Q29uZmlnKSB7XG4gICAgICAgIGNvbnN0IHsgXG4gICAgICAgICAgICBpbnRlcnZhbENvbEluaXQsIFxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xSYXRpb3MsIFxuICAgICAgICAgICAgdmlld09mZnNldCwgXG4gICAgICAgICAgICBpbnRlcnZhbFN0ZXAsIFxuICAgICAgICAgICAgaW50ZXJ2YWxDYW5kbGVzLFxuICAgICAgICAgICAgaW50ZXJ2YWxTdWJDb2xSYXRpb3NcbiAgICAgICAgfSA9IHZpZXdDb25maWc7XG5cbiAgICAgICAgdGhpcy5jb2xJbnRlcnZhbCA9IGludGVydmFsQ29sSW5pdDtcbiAgICAgICAgdGhpcy52aWV3T2Zmc2V0ID0gdmlld09mZnNldDtcbiAgICAgICAgdGhpcy5jb2xJbnRlcnZhbFJhdGlvcyA9IGludGVydmFsQ29sUmF0aW9zO1xuICAgICAgICB0aGlzLmludGVydmFsU3RlcCA9IGludGVydmFsU3RlcDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbENhbmRsZXMgPSBpbnRlcnZhbENhbmRsZXM7XG4gICAgICAgIHRoaXMuc3ViQ29sSW50ZXJ2YWxSYXRpb3MgPSBpbnRlcnZhbFN1YkNvbFJhdGlvcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbEludGVydmFsOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB2aWV3T2Zmc2V0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBjb2xJbnRlcnZhbFJhdGlvczogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBzdWJDb2xJbnRlcnZhbFJhdGlvczogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBpbnRlcnZhbFN0ZXA6IG51bWJlcjtcbiAgICBwcml2YXRlIGludGVydmFsQ2FuZGxlczogbnVtYmVyO1xuXG4gICAgcHVibGljIGdldEludGVydmFsQ2FuZGxlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbENhbmRsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERpdmlkZXIoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDIsIHRoaXMuaW50ZXJ2YWxTdGVwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3ViQ29sUmF0aW8oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQ29sSW50ZXJ2YWxSYXRpb3NbdGhpcy5pbnRlcnZhbFN0ZXBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRDb2xJbnRlcnZhbCh4OiBudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5tYXhab29tT3V0KHgpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbEludGVydmFsID0gdGhpcy5nZXRNaW5Db2xJbnRlcnZhbCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5tYXhab29tSW4oeCkpIHtcbiAgICAgICAgICAgIHRoaXMuY29sSW50ZXJ2YWwgPSB0aGlzLmdldE1heENvbEludGVydmFsKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbEludGVydmFsICs9IHg7XG4gICAgICAgIHRoaXMudXBkYXRlSW50ZXJ2YWxTdGVwKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRNaW5Db2xJbnRlcnZhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xJbnRlcnZhbFJhdGlvc1swXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SW50ZXJ2YWxTdGVwKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVydmFsU3RlcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1heENvbEludGVydmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbEludGVydmFsUmF0aW9zW3RoaXMuY29sSW50ZXJ2YWxSYXRpb3MubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgcHVibGljIG1heFpvb21PdXQoeDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xJbnRlcnZhbCArIHggPD0gdGhpcy5nZXRNaW5Db2xJbnRlcnZhbCgpICYmIHggPD0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF4Wm9vbUluKHg6IG51bWJlciA9IDApOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWwgKyB4ID49IHRoaXMuZ2V0TWF4Q29sSW50ZXJ2YWwoKSAgJiYgeCA+PSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSW50ZXJ2YWxTdGVwKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrSWZOZXh0U3RlcCgpO1xuICAgICAgICB0aGlzLmNoZWNrSWZQcmV2U3RlcCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tJZk5leHRTdGVwKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmludGVydmFsU3RlcCAhPT0gKHRoaXMuY29sSW50ZXJ2YWxSYXRpb3MubGVuZ3RoIC0gMSkgJiYgdGhpcy5jb2xJbnRlcnZhbCA+PSB0aGlzLmNvbEludGVydmFsUmF0aW9zW3RoaXMuaW50ZXJ2YWxTdGVwICsgMV0pIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxTdGVwKys7XG4gICAgICAgIH0gXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0lmUHJldlN0ZXAoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuaW50ZXJ2YWxTdGVwICE9PSAwICYmIHRoaXMuY29sSW50ZXJ2YWwgPCB0aGlzLmNvbEludGVydmFsUmF0aW9zW3RoaXMuaW50ZXJ2YWxTdGVwXSkge1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbFN0ZXAtLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb2xJbnRlcnZhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xJbnRlcnZhbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Vmlld09mZnNldCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3T2Zmc2V0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRWaWV3T2Zmc2V0KHg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnZpZXdPZmZzZXQgPSB4O1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRWaWV3T2Zmc2V0KHg6IG51bWJlcikge1xuICAgICAgICBpZih0aGlzLmNvbEludGVydmFsICE9PSB0aGlzLmdldE1pbkNvbEludGVydmFsKCkgJiYgdGhpcy5jb2xJbnRlcnZhbCAhPT0gdGhpcy5nZXRNYXhDb2xJbnRlcnZhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdPZmZzZXQgKz0geDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgKiBmcm9tICcuL2NoYXJ0L2NoYXJ0JztcbmV4cG9ydCAqIGZyb20gJy4vY2hhcnQvYXBpL2FwaS1jb250cm9sbGVyJzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=