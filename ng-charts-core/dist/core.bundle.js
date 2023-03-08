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
var chart_1 = __webpack_require__(/*! ./chart/chart */ "./src/chart/chart.ts");
var chartCanvas = document.getElementById('chart');
var chart = new chart_1.Chart(chartCanvas);
console.log('chart', chart, chartCanvas);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVNLDRCQUFhLEdBQXBCO1FBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSw0QkFBYSxHQUFwQixVQUFxQixDQUFTO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSw0QkFBYSxHQUFwQixVQUFxQixDQUFTO1FBQzFCLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO1lBQy9GLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDO0FBM0dZLG9CQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGakIsd0ZBQThCO0FBQzlCLGtIQUEyQztBQUUzQywrRUFBc0M7QUFFdEMsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRCxJQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxXQUFnQyxDQUFDLENBQUM7QUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDOzs7Ozs7O1VDUHpDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9hbmltYXRpb25zL2FuaW1hdGlvbi50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9hbmltYXRpb25zL2FuaW1hdGlvbnMtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9hcGkvYXBpLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvY2hhcnQtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9jaGFydC50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9kaW1lbnNpb25zLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2NhbmRsZS50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9lbGVtZW50cy9lbGVtZW50LWNvbGxlY3Rvci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9lbGVtZW50cy9lbGVtZW50LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2xpbmUudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZWxlbWVudHMvdGV4dC50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9ldmVudHMvZXZlbnQtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9ldmVudHMvbW91c2Vkb3duLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9tb3VzZW1vdmUudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL21vdXNlb3V0LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9tb3VzZXVwLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy93aGVlbC50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9tYXRoLXV0aWxzLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L3JlbmRlcmVyL2NhbmRsZS1yZW5kZXJlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9yZW5kZXJlci9saW5lLXJlbmRlcmVyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L3JlbmRlcmVyL3JlbmRlcmVyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L3JlbmRlcmVyL3RleHQtcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvdmlldy50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uc01hbmFnZXIgfSBmcm9tICcuL2FuaW1hdGlvbnMtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgZHVyYXRpb246IG51bWJlciwgc3RhcnRWYWx1ZXM6IG51bWJlcltdLCBlbmRWYWx1ZXM6IG51bWJlcltdLCBjYWxsYmFjazogKC4uLmFyZzogYW55W10pID0+IHZvaWQsIGVhc2VUeXBlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSA9IEFuaW1hdGlvbnNNYW5hZ2VyLmdldEN1cnJlbnRUaW1lU3RhbXAoKTtcclxuICAgICAgICB0aGlzLm1zRHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICB0aGlzLnN0YXJ0VmFsdWVzID0gc3RhcnRWYWx1ZXM7XHJcbiAgICAgICAgdGhpcy5lbmRWYWx1ZXMgPSBlbmRWYWx1ZXM7XHJcbiAgICAgICAgdGhpcy5zZXRWYWxDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuZWFzZVR5cGUgPSBlYXNlVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNGaW5pc2hlZCA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGVhc2VUeXBlOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb25TdGFydFRpbWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbXNEdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGFydFZhbHVlczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIGVuZFZhbHVlczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIHNldFZhbENhbGxiYWNrOiAoLi4uYXJnOiBhbnlbXSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQW5pbWF0aW9uUG9zaXRpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gQW5pbWF0aW9uc01hbmFnZXIuZ2V0Q3VycmVudFRpbWVTdGFtcCgpO1xyXG5cclxuICAgICAgICBpZihjdXJyZW50VGltZSAtIHRoaXMuYW5pbWF0aW9uU3RhcnRUaW1lIDw9IHRoaXMubXNEdXJhdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lUHJvZ3Jlc3MgPSB0aGlzLmdldFRpbWVQcm9ncmVzcyhjdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVhc2UgPSB0aGlzLmdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3MpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0VmFsdWVzID0gdGhpcy5zdGFydFZhbHVlcy5tYXAoKHYsIGluZGV4KSA9PiB2ICsgKHRoaXMuZW5kVmFsdWVzW2luZGV4XSAtIHYpICogZWFzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsQ2FsbGJhY2socmVzdWx0VmFsdWVzLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3M6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYoIXRoaXMuZWFzZVR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFzZUluT3V0UXVpbnQodGltZVByb2dyZXNzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYXNlSW5PdXRTaW5lKHRpbWVQcm9ncmVzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0VGltZVByb2dyZXNzKGN1cnJlbnRUaW1lOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoY3VycmVudFRpbWUgLSB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSkgLyB0aGlzLm1zRHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlYXNlSW5PdXRRdWludCh4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtMTAgKiB4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGVhc2VJbk91dFNpbmUoeDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNVxyXG4gICAgICAgID8gKDEgLSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KDIgKiB4LCAyKSkpIC8gMlxyXG4gICAgICAgIDogKE1hdGguc3FydCgxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMikpICsgMSkgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTdGFydFZhbHVlcyh2YWx1ZXM6IG51bWJlcltdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGFydFZhbHVlcyA9IHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RW5kVmFsdWVzKHZhbHVlczogbnVtYmVyW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVuZFZhbHVlcyA9IHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWVzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhcnRWYWx1ZXM6IHRoaXMuc3RhcnRWYWx1ZXMsXHJcbiAgICAgICAgICAgIGVuZFZhbHVlczogdGhpcy5lbmRWYWx1ZXNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICcuL2FuaW1hdGlvbic7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uc01hbmFnZXIgeyBcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGN1cnJlbnRSZW5kZXJCbG9jayA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudFRpbWVTdGFtcDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYW5pbWF0aW9uU3RhY2s6IEFuaW1hdGlvbltdID0gW107XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VGltZVN0YW1wKHRpbWU6IG51bWJlcik6IHZvaWQgeyBcclxuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lU3RhbXAgPSB0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q3VycmVudFRpbWVTdGFtcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU3RhbXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRBbmltYXRpb25TdGFjaygpOiBBbmltYXRpb25bXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uU3RhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzdGFydEFuaW1hdGlvbih0eXBlOiBzdHJpbmcsIG1zRHVyYXRpb246IG51bWJlciwgc3RhcnRWYWx1ZXM6IG51bWJlcltdLCBlbmRWYWx1ZXM6IG51bWJlcltdLCBjYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQsIGVhc2VUeXBlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGVja0R1cGxpY2F0ZXModHlwZSlcclxuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YWNrLnB1c2gobmV3IEFuaW1hdGlvbih0eXBlLCBtc0R1cmF0aW9uLCBzdGFydFZhbHVlcywgZW5kVmFsdWVzLCBjYWxsYmFjaywgZWFzZVR5cGUpKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNoZWNrRHVwbGljYXRlcyh0eXBlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBkdXBsaWNhdGVzID0gdGhpcy5hbmltYXRpb25TdGFjay5maWx0ZXIoYW5pbWF0aW9uID0+IGFuaW1hdGlvbi50eXBlID09PSB0eXBlKTtcclxuXHJcbiAgICAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIGR1cGxpY2F0ZXMgaW4gdGhlIGZ1dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBBbmltYXRpb25zTWFuYWdlci51cGRhdGVTdGFjaygpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhY2suZm9yRWFjaChhbmltYXRpb24gPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5jdXJyZW50UmVuZGVyQmxvY2spIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi51cGRhdGVBbmltYXRpb25Qb3NpdGlvbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVTdGFjaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YWNrID0gdGhpcy5hbmltYXRpb25TdGFjay5maWx0ZXIoYW5pbWF0aW9uID0+ICFhbmltYXRpb24uaXNGaW5pc2hlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGVhclN0YWNrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhY2sgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gdHJ1ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEFuaW1hdGlvbnNNYW5hZ2VyIH0gZnJvbSBcIi4uL2FuaW1hdGlvbnMvYW5pbWF0aW9ucy1tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi4vdmlld1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0QVBJQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHZpZXc6IFZpZXdcclxuICAgICkge31cclxuXHJcbiAgICBwdWJsaWMgcmVzZXRWaWV3T2Zmc2V0KG1zVGltZSA9IDQwMCk6IHZvaWQge1xyXG4gICAgICAgIEFuaW1hdGlvbnNNYW5hZ2VyLnN0YXJ0QW5pbWF0aW9uKFxyXG4gICAgICAgICAgICAncmVzZXRWaWV3T2Zmc2V0JyxcclxuICAgICAgICAgICAgbXNUaW1lLFxyXG4gICAgICAgICAgICBbdGhpcy52aWV3LmdldFZpZXdPZmZzZXQoKV0sXHJcbiAgICAgICAgICAgIFswXSxcclxuICAgICAgICAgICAgKGVhc2VkVmFsdWVzOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgWyB2aWV3T2Zmc2V0IF0gPSBlYXNlZFZhbHVlczsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuc2V0Vmlld09mZnNldCh2aWV3T2Zmc2V0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbGVtZW50Q29sbGVjdG9yIH0gZnJvbSAnLi9lbGVtZW50cy9lbGVtZW50LWNvbGxlY3Rvcic7XHJcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuL2RpbWVuc2lvbnMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi92aWV3JztcclxuaW1wb3J0IHsgQ2FuZGxlIH0gZnJvbSAnLi9lbGVtZW50cy9jYW5kbGUnOyBcclxuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xyXG5pbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXIvcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50cy9lbGVtZW50JztcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudHMvZXZlbnQtbWFuYWdlcic7XHJcbmltcG9ydCB7IFdoZWVsIH0gZnJvbSAnLi9ldmVudHMvd2hlZWwnO1xyXG5pbXBvcnQgeyBNb3VzZW91dCB9IGZyb20gJy4vZXZlbnRzL21vdXNlb3V0JztcclxuaW1wb3J0IHsgTW91c2Vkb3duIH0gZnJvbSAnLi9ldmVudHMvbW91c2Vkb3duJztcclxuaW1wb3J0IHsgTW91c2V1cCB9IGZyb20gJy4vZXZlbnRzL21vdXNldXAnO1xyXG5pbXBvcnQgeyBNb3VzZW1vdmUgfSBmcm9tICcuL2V2ZW50cy9tb3VzZW1vdmUnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBJVmlld0NvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDaGFydEFQSUNvbnRyb2xsZXIgfSBmcm9tICcuL2FwaS9hcGktY29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcnRNYW5hZ2VyIHtcclxuICAgIHB1YmxpYyBhcGlDb250cm9sbGVyITogQ2hhcnRBUElDb250cm9sbGVyO1xyXG5cclxuICAgIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgZGltZW5zaW9ucyE6IERpbWVuc2lvbnM7XHJcbiAgICBwcml2YXRlIHZpZXchOiBWaWV3O1xyXG4gICAgcHJpdmF0ZSByZW5kZXJlciE6IFJlbmRlcmVyO1xyXG4gICAgcHJpdmF0ZSBldmVudE1hbmFnZXIhOiBFdmVudE1hbmFnZXI7XHJcbiAgICBwcml2YXRlIGNhbmRsZXMhOiBDYW5kbGVQYXlsb2FkW107XHJcbiAgICBwcml2YXRlIGxhc3RSZW5kZXIhOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbnMhOiBBbmltYXRpb25zTWFuYWdlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q2FudmFzRGltZW5zaW9ucygpO1xyXG4gICAgICAgIHRoaXMuc2V0VmlldygpO1xyXG4gICAgICAgIHRoaXMuc2V0UmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLnNldENhbmRsZXMoY2FuZGxlcyk7XHJcbiAgICAgICAgdGhpcy5hZGRDYW52YXNMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxOTFmMmNcIjtcclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0TmV4dEZyYW1lKDApO1xyXG5cclxuICAgICAgICB0aGlzLmFwaUNvbnRyb2xsZXIgPSBuZXcgQ2hhcnRBUElDb250cm9sbGVyKHRoaXMudmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUFwaUNvbnRyb2xsZXIoKTogQ2hhcnRBUElDb250cm9sbGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcGlDb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Q2FudmFzRGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBbIGhvcml6b250YWxNYXJnaW4sIHZlcnRpY2FsTWFyZ2luIF0gPSBbIDc1LCA0MCBdO1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IG5ldyBEaW1lbnNpb25zKHRoaXMuY2FudmFzLCBob3Jpem9udGFsTWFyZ2luLCB2ZXJ0aWNhbE1hcmdpbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZpZXdDb25maWc6IElWaWV3Q29uZmlnID0ge1xyXG4gICAgICAgICAgICBpbnRlcnZhbE5hbWU6ICdNMScsXHJcbiAgICAgICAgICAgIGludGVydmFsQ2FuZGxlczogNjAsXHJcbiAgICAgICAgICAgIGludGVydmFsU3RlcDogMCxcclxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xJbml0OiAxNTAsXHJcbiAgICAgICAgICAgIGludGVydmFsQ29sUmF0aW9zOiBbMTUwLCAzMDAsIDYwMCwgMTIwMF0sXHJcbiAgICAgICAgICAgIGludGVydmFsU3ViQ29sUmF0aW9zOiBbMTAsIDUsIDEsIDFdLFxyXG4gICAgICAgICAgICB2aWV3T2Zmc2V0OiAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KHZpZXdDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0UmVuZGVyZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLmNvbnRleHQsIHRoaXMuZGltZW5zaW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDYW5kbGVzKGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSk6IHZvaWQge1xyXG4gICAgICAgIENhbmRsZS5maW5kTWF4TG93SW5EYXRhKGNhbmRsZXMpO1xyXG4gICAgICAgIHRoaXMuY2FuZGxlcyA9IGNhbmRsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRDYW52YXNMaXN0ZW5lcnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKHRoaXMuY2FudmFzLCB0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldyk7XHJcbiAgICAgICAgdGhpcy5ldmVudE1hbmFnZXIubGlzdGVuKG5ldyBXaGVlbCgpKTtcclxuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5saXN0ZW4obmV3IE1vdXNlb3V0KCkpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2Vkb3duKCkpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2V1cCgpKTtcclxuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5saXN0ZW4obmV3IE1vdXNlbW92ZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlcXVlc3ROZXh0RnJhbWUodGltZTogbnVtYmVyIHwgdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgICAgaWYodGltZSkge1xyXG4gICAgICAgICAgICBBbmltYXRpb25zTWFuYWdlci5zZXRDdXJyZW50VGltZVN0YW1wKHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMubGFzdFJlbmRlciB8fCB0aW1lICYmIHRpbWUgLSB0aGlzLmxhc3RSZW5kZXIgPj0gMTYpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0UmVuZGVyID0gdGltZSA/PyAwO1xyXG4gICAgICAgICAgICBDYW5kbGUucmVzZXRIaWdoTG93KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5nZXRSZW5kZXJpbmdFbGVtZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnRzKGVsZW1lbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZXF1ZXN0TmV4dEZyYW1lLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UmVuZGVyaW5nRWxlbWVudHMoKTogU2V0PEVsZW1lbnRbXT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudENvbGxlY3Rvcih0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldywgdGhpcy5jYW5kbGVzKS5nZXRFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyRWxlbWVudHMoZWxlbWVudHM6IFNldDxFbGVtZW50W10+KTogdm9pZCB7XHJcbiAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5kcmF3KGVsZW1lbnRzKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENoYXJ0TWFuYWdlciB9IGZyb20gJy4vY2hhcnQtbWFuYWdlcic7XHJcbmltcG9ydCB7IENhbmRsZVBheWxvYWQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhbmRsZXN0aWNrJztcclxuaW1wb3J0IHsgQ2hhcnRBUElDb250cm9sbGVyIH0gZnJvbSAnLi9hcGkvYXBpLWNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaENhbmRsZXMoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYW5kbGVzJylcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGNhbmRsZXMgPT4gdGhpcy5pbml0Q2hhcnQoY2FuZGxlcywgY2FudmFzKSlcclxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMuaW5pdENoYXJ0KFtdLCBjYW52YXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbnZhcyE6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjaGFydE1hbmFnZXIhOiBDaGFydE1hbmFnZXI7XHJcbiAgICBwcml2YXRlIGNvbnRleHQhOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgaW5pdENoYXJ0KGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSwgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZ2V0UmVuZGVyaW5nQ29udGV4dCgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbnRleHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFydE1hbmFnZXIgPSBuZXcgQ2hhcnRNYW5hZ2VyKHRoaXMuY29udGV4dCwgdGhpcy5jYW52YXMsIGNhbmRsZXMucmV2ZXJzZSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSZW5kZXJpbmdDb250ZXh0KCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwge1xyXG4gICAgICAgIGlmKHdpbmRvdy5IVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgaXMgbm90IHN1cHBvcnRlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hDYW5kbGVzKGVuZHBvaW50OiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGVuZHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXBpQ29udHJvbGxlcigpOiBDaGFydEFQSUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0TWFuYWdlci5jcmVhdGVBcGlDb250cm9sbGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHcmFwaERpbWVuc2lvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RpbWVuc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERpbWVuc2lvbnMge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgaG9yaXpvbnRhbE1hcmdpbjogbnVtYmVyLCB2ZXJ0aWNhbE1hcmdpbjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsTWFyZ2luID0gaG9yaXpvbnRhbE1hcmdpbjtcclxuICAgICAgICB0aGlzLnZlcnRpY2FsTWFyZ2luID0gdmVydGljYWxNYXJnaW47XHJcbiAgICAgICAgdGhpcy5zZXREaW1lbnNpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBHcmFwaERpbWVuc2lvbnMgPSB7fTtcclxuICAgIHByaXZhdGUgaG9yaXpvbnRhbE1hcmdpbjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB2ZXJ0aWNhbE1hcmdpbjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXRXaWR0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMud2lkdGggPz8gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgPz8gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGltZW5zaW9ucygpOiBHcmFwaERpbWVuc2lvbnMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZlcnRpY2FsTWFyZ2luKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljYWxNYXJnaW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhvcml6b250YWxNYXJnaW4oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ob3Jpem9udGFsTWFyZ2luO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNldENhbnZhc1N0eWxlV2lkdGhBbmRIZWlnaHQoKTtcclxuICAgICAgICB0aGlzLnNldENhbnZhc1dpZHRoQW5kSGVpZ2h0KCk7XHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldENhbnZhc1N0eWxlV2lkdGhBbmRIZWlnaHQod2lkdGg6IG51bWJlciA9IDEyODAsIGhlaWdodDogbnVtYmVyID0gNDAwKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldENhbnZhc1dpZHRoQW5kSGVpZ2h0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xyXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50JztcclxuaW1wb3J0IHsgSTJEQ29vcmRzLCBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XHJcbmltcG9ydCB7IENhbmRsZVJlbmRlcmVyIH0gZnJvbSAnLi4vcmVuZGVyZXIvY2FuZGxlLXJlbmRlcmVyJztcclxuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbmRsZSBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY29vcmRzOiBJMkRDb29yZHMsIFxyXG4gICAgICAgIHByb3BlcnRpZXM6IElSZW5kZXJQcm9wZXJ0aWVzLCBcclxuICAgICAgICBjYW5kbGU6IENhbmRsZVBheWxvYWRcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGNvb3JkcywgcHJvcGVydGllcyk7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50SGlnaExvdyhjYW5kbGUpO1xyXG4gICAgICAgIENhbmRsZS5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLnNldENvbG9yKGNhbmRsZSk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBwcm9wZXJ0aWVzLndpZHRoO1xyXG4gICAgICAgIHRoaXMueUVuZCA9IGNhbmRsZS5vcGVuO1xyXG4gICAgICAgIHRoaXMueVN0YXJ0ID0gY2FuZGxlLmNsb3NlO1xyXG4gICAgICAgIHRoaXMueUhpZ2ggPSBjYW5kbGUuaGlnaDtcclxuICAgICAgICB0aGlzLnlMb3cgPSBjYW5kbGUubG93O1xyXG4gICAgICAgIHRoaXMudGltZSA9IGNhbmRsZS50aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlbmRlcmVyOiBDYW5kbGVSZW5kZXJlcjtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXJyZW50TWF4SGlnaD86IG51bWJlcjtcclxuICAgIHByaXZhdGUgc3RhdGljIGN1cnJlbnRNYXhMb3c/OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWF4SGlnaDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWF4TG93OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBjb2xvciE6IHN0cmluZztcclxuICAgIFxyXG4gICAgcHVibGljIHdpZHRoPzogbnVtYmVyO1xyXG4gICAgcHVibGljIHlIaWdoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeUxvdzogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB0aW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIG92ZXJyaWRlIHJlbmRlcihlbGVtZW50OiBDYW5kbGUsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGltZW5zaW9uczogRGltZW5zaW9ucyk6IHZvaWQge1xyXG4gICAgICAgIENhbmRsZS5yZW5kZXJlci5kcmF3KGVsZW1lbnQsIGRpbWVuc2lvbnMsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDYW5kbGVUaW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldENvbG9yKGNhbmRsZTogQ2FuZGxlUGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjYW5kbGUub3BlbiA+IGNhbmRsZS5jbG9zZSA/ICcjNTZiNzg2JyA6ICcjZWI0ZTVjJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEN1cnJlbnRIaWdoTG93KGNhbmRsZTogQ2FuZGxlUGF5bG9hZCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFDYW5kbGUuY3VycmVudE1heEhpZ2ggfHwgY2FuZGxlLmhpZ2ggPiBDYW5kbGUuY3VycmVudE1heEhpZ2gpIHtcclxuICAgICAgICAgICAgQ2FuZGxlLmN1cnJlbnRNYXhIaWdoID0gY2FuZGxlLmhpZ2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighQ2FuZGxlLmN1cnJlbnRNYXhMb3cgfHwgY2FuZGxlLmxvdyA8IENhbmRsZS5jdXJyZW50TWF4TG93KSB7XHJcbiAgICAgICAgICAgIENhbmRsZS5jdXJyZW50TWF4TG93ID0gY2FuZGxlLmxvdztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kTWF4TG93SW5EYXRhKGNhbmRsZXNEYXRhOiBDYW5kbGVQYXlsb2FkW10pOiB2b2lkIHtcclxuICAgICAgICBjYW5kbGVzRGF0YS5mb3JFYWNoKGNhbmRsZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLm1heEhpZ2ggfHwgY2FuZGxlLmhpZ2ggPiB0aGlzLm1heEhpZ2gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF4SGlnaCA9IGNhbmRsZS5oaWdoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighdGhpcy5tYXhMb3cgfHwgY2FuZGxlLmxvdyA8IHRoaXMubWF4TG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1heExvdyA9IGNhbmRsZS5sb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TWF4TG93SW5EYXRhKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gWyB0aGlzLm1heEhpZ2gsIHRoaXMubWF4TG93IF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZXNldEhpZ2hMb3coKTogdm9pZCB7XHJcbiAgICAgICAgQ2FuZGxlLmN1cnJlbnRNYXhIaWdoID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIENhbmRsZS5jdXJyZW50TWF4TG93ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlnaExvdygpOiBBcnJheTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gWyBDYW5kbGUuY3VycmVudE1heEhpZ2ggPz8gMCwgQ2FuZGxlLmN1cnJlbnRNYXhMb3cgPz8gMCBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlnaCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKENhbmRsZS5jdXJyZW50TWF4SGlnaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGVzdGFibGlzaCBjdXJyZW50TWF4SGlnaCBmb3IgYSBjYW5kbGUnKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2FuZGxlLmN1cnJlbnRNYXhIaWdoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TG93KCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYoQ2FuZGxlLmN1cnJlbnRNYXhMb3cgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBlc3RhYmxpc2ggY3VycmVudE1heExvdyBmb3IgYSBjYW5kbGUnKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2FuZGxlLmN1cnJlbnRNYXhMb3c7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVJlbmRlcmVyKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFDYW5kbGUucmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgQ2FuZGxlLnJlbmRlcmVyID0gbmV3IENhbmRsZVJlbmRlcmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XHJcbmltcG9ydCB7IENhbmRsZVBheWxvYWQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbmRsZXN0aWNrJztcclxuaW1wb3J0IHsgQ2FuZGxlIH0gZnJvbSAnLi9jYW5kbGUnO1xyXG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi9saW5lJztcclxuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gJy4vZWxlbWVudCc7XHJcbmltcG9ydCB7IFRleHQgfSBmcm9tICcuL3RleHQnO1xyXG5pbXBvcnQgeyBNYXRoVXRpbHMgfSBmcm9tICcuLi9tYXRoLXV0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbGVtZW50Q29sbGVjdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsXHJcbiAgICAgICAgdmlldzogVmlldyxcclxuICAgICAgICBjYW5kbGVEYXRhOiBDYW5kbGVQYXlsb2FkW10sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xyXG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XHJcbiAgICAgICAgdGhpcy5jYW5kbGVEYXRhID0gY2FuZGxlRGF0YTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJpbmdFbGVtZW50c1NldDogU2V0PEVsZW1lbnRbXT4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBEaW1lbnNpb25zO1xyXG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3O1xyXG4gICAgcHJpdmF0ZSBjYW5kbGVEYXRhOiBDYW5kbGVQYXlsb2FkW107XHJcbiAgICBwcml2YXRlIGNhbmRsZXM6IENhbmRsZVtdID0gW107XHJcbiAgICBwcml2YXRlIG1haW5Db2x1bW5MaW5lczogTGluZVtdID0gW107XHJcbiAgICBwcml2YXRlIHN1YkNvbHVtbkxpbmVzOiBMaW5lW10gPSBbXTtcclxuICAgIHByaXZhdGUgdGV4dDogVGV4dFtdID0gW107XHJcbiAgICBwcml2YXRlIGhvcml6b250YWxMaW5lczogTGluZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIGdldEVsZW1lbnRzKCk6IFNldDxFbGVtZW50W10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gdGhpcy5kaW1lbnNpb25zLmdldFdpZHRoKCk7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAwO1xyXG5cclxuICAgICAgICBmb3IobGV0IHhEcmF3aW5nT2Zmc2V0ID0gY2FudmFzV2lkdGg7IHhEcmF3aW5nT2Zmc2V0ICsgdGhpcy52aWV3LmdldFZpZXdPZmZzZXQoKSA+IDA7IHhEcmF3aW5nT2Zmc2V0ID0geERyYXdpbmdPZmZzZXQgLSB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSkgeyBcclxuICAgICAgICAgICAgY29uc3QgeERyYXdpbmdQb3NpdGlvbiA9IHhEcmF3aW5nT2Zmc2V0ICsgdGhpcy52aWV3LmdldFZpZXdPZmZzZXQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRIb3Jpem9udGFsTWFyZ2luKCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4rKzsgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBpZih4RHJhd2luZ1Bvc2l0aW9uID4gMCAmJiB4RHJhd2luZ1Bvc2l0aW9uIDwgY2FudmFzV2lkdGggKyB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAqIDIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2FuZGxlc0luSW50ZXJ2YWwoeERyYXdpbmdQb3NpdGlvbiwgdGhpcy5jYW5kbGVEYXRhLCBjdXJyZW50Q29sdW1uLCBjYW52YXNXaWR0aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRpbWVTdGFtcHMoeERyYXdpbmdQb3NpdGlvbiwgY3VycmVudENvbHVtbiwgdGhpcy5jYW5kbGVEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZEhvcml6b250YWxMaW5lcygpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLnRleHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyaW5nRWxlbWVudHNTZXQuYWRkKHRoaXMuc3ViQ29sdW1uTGluZXMpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyaW5nRWxlbWVudHNTZXQuYWRkKHRoaXMubWFpbkNvbHVtbkxpbmVzKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLmhvcml6b250YWxMaW5lcyk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldC5hZGQodGhpcy5jYW5kbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENhbmRsZXNJbkludGVydmFsKHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uOiBudW1iZXIsIGNhbmRsZXNEYXRhOiBDYW5kbGVQYXlsb2FkW10sIGN1cnJlbnRDb2x1bW46IG51bWJlciwgZ3JhcGhXaWR0aDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcyA9IHRoaXMuZ2V0SW50ZXJ2YWxDYW5kbGVEaXN0YW5jZSgpO1xyXG4gICAgICAgIGNvbnN0IGNhbmRsZXNJbkludGVydmFsID0gdGhpcy52aWV3LmdldEludGVydmFsQ2FuZGxlcygpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNhbmRsZSA9IDA7IGNhbmRsZSA8IGNhbmRsZXNJbkludGVydmFsOyBjYW5kbGUrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2FuZGxlVG9SZW5kZXIgPSBjYW5kbGVzRGF0YVtjYW5kbGUgKyBjYW5kbGVzSW5JbnRlcnZhbCAqIChjdXJyZW50Q29sdW1uIC0gMSldO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENhbmRsZUlmSW5WaWV3KHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uLCBjYW5kbGUsIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXMsIGdyYXBoV2lkdGgsIGN1cnJlbnRDYW5kbGVUb1JlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0SW50ZXJ2YWxDYW5kbGVEaXN0YW5jZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAvIHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENhbmRsZUlmSW5WaWV3KFxyXG4gICAgICAgIHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uOiBudW1iZXIsIFxyXG4gICAgICAgIGNhbmRsZU51bUluSW50ZXJ2YWw6IG51bWJlciwgXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlczogbnVtYmVyLCBcclxuICAgICAgICBncmFwaFdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgY3VycmVudENhbmRsZVRvUmVuZGVyOiBDYW5kbGVQYXlsb2FkXHJcbiAgICApOiB2b2lkIHtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgeE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb24gLSBjYW5kbGVOdW1JbkludGVydmFsICogZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcyA+IDAgJiYgXHJcbiAgICAgICAgICAgIHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uIC0gY2FuZGxlTnVtSW5JbnRlcnZhbCAqIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXMgPCBncmFwaFdpZHRoIC0gdGhpcy5kaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSArIDEwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiA9IHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uIC0gY2FuZGxlTnVtSW5JbnRlcnZhbCAqIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuZGxlcy5wdXNoKG5ldyBDYW5kbGUoeyB4U3RhcnQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiB9LCB7IHdpZHRoOiB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAvIDEwMCB9LCBjdXJyZW50Q2FuZGxlVG9SZW5kZXIpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1haW5Db2x1bW5EaXZpZGVyID0gdGhpcy52aWV3LmdldERpdmlkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFpbkNvbHVtbkxpbmVJbnRlcnZhbCA9IHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKSAvIG1haW5Db2x1bW5EaXZpZGVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2FuZGxlTnVtSW5JbnRlcnZhbCAlIHRoaXMudmlldy5nZXRTdWJDb2xSYXRpbygpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YkNvbHVtbkxpbmVzLnB1c2gobmV3IExpbmUoeyB4U3RhcnQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiwgeEVuZDogY2FuZGxlWFJlbmRlclBvc2l0aW9uLCB5U3RhcnQ6IDAsIHlFbmQ6IHRoaXMuZGltZW5zaW9ucy5nZXRIZWlnaHQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRWZXJ0aWNhbE1hcmdpbigpIH0sIHsgd2lkdGg6IC4xIH0pKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoY2FuZGxlTnVtSW5JbnRlcnZhbCAlIG1haW5Db2x1bW5MaW5lSW50ZXJ2YWwgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFpbkNvbHVtbkxpbmVzLnB1c2gobmV3IExpbmUoeyB4U3RhcnQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiwgeEVuZDogY2FuZGxlWFJlbmRlclBvc2l0aW9uLCB5U3RhcnQ6IDAsIHlFbmQ6IHRoaXMuZGltZW5zaW9ucy5nZXRIZWlnaHQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRWZXJ0aWNhbE1hcmdpbigpIH0sIHsgd2lkdGg6IC4zIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFRpbWVTdGFtcHMoeFN0YXJ0OiBudW1iZXIsIGNvbHVtbk9mZnNldDogbnVtYmVyLCBjYW5kbGVzRGF0YTogQ2FuZGxlUGF5bG9hZFtdKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHlEcmF3aW5nUG9zaXRpb24gPSB0aGlzLmRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmRpbWVuc2lvbnMuZ2V0VmVydGljYWxNYXJnaW4oKSArIDIzO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShjYW5kbGVzRGF0YVswXS50aW1lKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSAtIHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKSAqIChjb2x1bW5PZmZzZXQgLSAxKSk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dC5wdXNoKG5ldyBUZXh0KHsgeFN0YXJ0OiB4U3RhcnQgLSAxMCwgeVN0YXJ0OiB5RHJhd2luZ1Bvc2l0aW9uIH0sIHt9LCBgJHtkYXRlLmdldEhvdXJzKCl9OiR7ZGF0ZS5nZXRNaW51dGVzKCl9YCkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlID0gdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLyB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCk7XHJcbiAgICAgICAgICAgIGxldCBwcmV2WSA9IHhTdGFydFxyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkcmF3aW5nWCA9IHhTdGFydCAtIDEwIC0gKGRpc3RhbmNlQmV0d2VlbkNhbmRsZSArIGRpc3RhbmNlQmV0d2VlbkNhbmRsZSAqIGkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZighcHJldlkgfHwgcHJldlkgLSBkcmF3aW5nWCA+IDQwICYmIHhTdGFydCAtIGRyYXdpbmdYIDwgdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLSAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKGNhbmRsZXNEYXRhWzBdLnRpbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgLSB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCkgKiAoY29sdW1uT2Zmc2V0IC0gMSkgLSBpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0LnB1c2gobmV3IFRleHQoeyB4U3RhcnQ6IGRyYXdpbmdYLCB5U3RhcnQ6IHlEcmF3aW5nUG9zaXRpb24gfSwge30sIGAke2RhdGUuZ2V0SG91cnMoKX06JHtkYXRlLmdldE1pbnV0ZXMoKX1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlkgPSBkcmF3aW5nWDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkSG9yaXpvbnRhbExpbmVzKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHsgaGVpZ2h0IH0gPSB0aGlzLmRpbWVuc2lvbnMuZ2V0RGltZW5zaW9ucygpO1xyXG4gICAgICAgIGNvbnN0IFsgY3VycmVudE1heCwgY3VycmVudExvdyBdID0gQ2FuZGxlLmdldEhpZ2hMb3coKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRZWm9vbSA9IDE7XHJcblxyXG4gICAgICAgIHdoaWxlKChNYXRoLmZsb29yKGN1cnJlbnRNYXgpIC0gTWF0aC5mbG9vcihjdXJyZW50TG93KSkgLyBjdXJyZW50WVpvb20gPj0gMTApIHtcclxuICAgICAgICAgICAgY3VycmVudFlab29tID0gY3VycmVudFlab29tICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlKChNYXRoLmZsb29yKGN1cnJlbnRNYXgpIC0gTWF0aC5mbG9vcihjdXJyZW50TG93KSkgLyBjdXJyZW50WVpvb20gPD0gNikge1xyXG4gICAgICAgICAgICBjdXJyZW50WVpvb20gPSBjdXJyZW50WVpvb20gLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKGxldCBob3Jpem9udGFsTGluZU9mZnNldCA9IE1hdGguZmxvb3IoY3VycmVudE1heCk7IGhvcml6b250YWxMaW5lT2Zmc2V0ID49IGN1cnJlbnRMb3c7IGhvcml6b250YWxMaW5lT2Zmc2V0ID0gaG9yaXpvbnRhbExpbmVPZmZzZXQgLSAuNSkge1xyXG4gICAgICAgICAgICBpZihob3Jpem9udGFsTGluZU9mZnNldCA8PSBjdXJyZW50TWF4ICYmIGhvcml6b250YWxMaW5lT2Zmc2V0ID49IGN1cnJlbnRMb3cpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihOdW1iZXIoaG9yaXpvbnRhbExpbmVPZmZzZXQudG9GaXhlZCgyKSkgJSBjdXJyZW50WVpvb20gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9uID0gTWF0aFV0aWxzLmludGVycG9sYXRlKChoZWlnaHQgPz8gMCkgLSB0aGlzLmRpbWVuc2lvbnMuZ2V0VmVydGljYWxNYXJnaW4oKSwgaG9yaXpvbnRhbExpbmVPZmZzZXQsIGN1cnJlbnRMb3csIGN1cnJlbnRNYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhFbmQgPSB0aGlzLmRpbWVuc2lvbnMuZ2V0V2lkdGgoKSAtIDYwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbExpbmVzLnB1c2gobmV3IExpbmUoeyB4U3RhcnQ6IDAsIHhFbmQsIHlTdGFydDogaW50ZXJwb2xhdGlvbiwgeUVuZDogaW50ZXJwb2xhdGlvbiB9LCB7IHdpZHRoOiAuMSB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0LnB1c2gobmV3IFRleHQoeyB4U3RhcnQ6IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpIC0gNTAsIHlTdGFydDogaW50ZXJwb2xhdGlvbiArIDYgfSwge30sIGAke2hvcml6b250YWxMaW5lT2Zmc2V0LnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSTJEQ29vcmRzLCBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XHJcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHsgeFN0YXJ0LCB4RW5kLCB5U3RhcnQsIHlFbmQgfTogSTJEQ29vcmRzLCBcclxuICAgICAgICBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcyxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMueFN0YXJ0ID0geFN0YXJ0ID8/IDA7XHJcbiAgICAgICAgdGhpcy54RW5kID0geEVuZCA/PyB4U3RhcnQgPz8gMDtcclxuICAgICAgICB0aGlzLnlTdGFydCA9IHlTdGFydCA/PyAwO1xyXG4gICAgICAgIHRoaXMueUVuZCA9IHlFbmQgPz8geVN0YXJ0ID8/IDA7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJQcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgeFN0YXJ0OiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgeEVuZDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHlTdGFydDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHlFbmQ6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcztcclxuXHJcbiAgICBwdWJsaWMgZ2V0WFN0YXJ0KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueFN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRYRW5kKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueEVuZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0WVN0YXJ0KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueVN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRZRW5kKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueUVuZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvcGVydGllcygpOiBJUmVuZGVyUHJvcGVydGllcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IEVsZW1lbnQsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGltZW5zaW9uczogRGltZW5zaW9ucyk6IHZvaWQge307XHJcbn0iLCJpbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudFwiO1xyXG5pbXBvcnQgeyBJMkRDb29yZHMsIElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcclxuaW1wb3J0IHsgTGluZVJlbmRlcmVyIH0gZnJvbSAnLi4vcmVuZGVyZXIvbGluZS1yZW5kZXJlcic7XHJcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tIFwiLi4vZGltZW5zaW9uc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvb3JkczogSTJEQ29vcmRzLCBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcykge1xyXG4gICAgICAgIHN1cGVyKGNvb3JkcywgcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIExpbmUuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVuZGVyZXI6IExpbmVSZW5kZXJlcjtcclxuXHJcbiAgICBwdWJsaWMgb3ZlcnJpZGUgcmVuZGVyKGVsZW1lbnQ6IExpbmUsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGltZW5zaW9uczogRGltZW5zaW9ucyk6IHZvaWQge1xyXG4gICAgICAgIExpbmUucmVuZGVyZXIuZHJhdyhlbGVtZW50LCBkaW1lbnNpb25zLCBjb250ZXh0LCB0aGlzLmdldFByb3BlcnRpZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVJlbmRlcmVyKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCFMaW5lLnJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgIExpbmUucmVuZGVyZXIgPSBuZXcgTGluZVJlbmRlcmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSTJEQ29vcmRzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcclxuaW1wb3J0IHsgSVJlbmRlclByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3JlbmRlcmVsZW1lbnQnO1xyXG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFRleHRSZW5kZXJlciB9IGZyb20gJy4uL3JlbmRlcmVyL3RleHQtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50JztcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb29yZHM6IEkyRENvb3JkcywgcHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXMsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihjb29yZHMsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgVGV4dC5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZW5kZXJlcjogVGV4dFJlbmRlcmVyO1xyXG4gICAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBvdmVycmlkZSByZW5kZXIoZWxlbWVudDogVGV4dCwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkaW1lbnNpb25zOiBEaW1lbnNpb25zKTogdm9pZCB7XHJcbiAgICAgICAgVGV4dC5yZW5kZXJlci5kcmF3KGVsZW1lbnQsIGRpbWVuc2lvbnMsIGNvbnRleHQsIHRoaXMuZ2V0UHJvcGVydGllcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplUmVuZGVyZXIoKTogdm9pZCB7XHJcbiAgICAgICAgaWYoIVRleHQucmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgVGV4dC5yZW5kZXJlciA9IG5ldyBUZXh0UmVuZGVyZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcclxuaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50TWFuYWdlciB7XHJcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGRpbWVuc2lvbnM6IERpbWVuc2lvbnM7XHJcbiAgICBwcml2YXRlIHZpZXc6IFZpZXc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XHJcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG1vdXNlRG93biA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBsaXN0ZW4oZXZlbnQ6IENoYXJ0RXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LmV2ZW50TmFtZSwgKGNhbnZhc0V2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5jYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuY2FudmFzLCB0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldywgY2FudmFzRXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xyXG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb3VzZWRvd24gaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcclxuICAgIGV2ZW50TmFtZTogc3RyaW5nID0gJ21vdXNlZG93bic7XHJcblxyXG4gICAgcHVibGljIGNhbGxiYWNrKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIEV2ZW50TWFuYWdlci5tb3VzZURvd24gPSB0cnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xyXG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb3VzZW1vdmUgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcclxuICAgIGV2ZW50TmFtZSA9ICdtb3VzZW1vdmUnO1xyXG5cclxuICAgIHB1YmxpYyBjYWxsYmFjayhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHZpZXcuZ2V0Vmlld09mZnNldCgpICsgZXZlbnQubW92ZW1lbnRYID4gMCAmJiBFdmVudE1hbmFnZXIubW91c2VEb3duKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2V0Vmlld09mZnNldCh2aWV3LmdldFZpZXdPZmZzZXQoKSArIGV2ZW50Lm1vdmVtZW50WCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xyXG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb3VzZW91dCBpbXBsZW1lbnRzIENoYXJ0RXZlbnQge1xyXG4gICAgZXZlbnROYW1lOiBzdHJpbmcgPSAnbW91c2VvdXQnO1xyXG5cclxuICAgIHB1YmxpYyBjYWxsYmFjayhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBFdmVudE1hbmFnZXIubW91c2VEb3duID0gZmFsc2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDaGFydEV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ldmVudCc7XHJcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xyXG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuL2V2ZW50LW1hbmFnZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vdXNldXAgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcclxuICAgIGV2ZW50TmFtZSA9ICdtb3VzZXVwJztcclxuXHJcbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLm1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4uL2FuaW1hdGlvbnMvYW5pbWF0aW9ucy1tYW5hZ2VyJztcclxuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlZWwgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcclxuICAgIGV2ZW50TmFtZSA9ICd3aGVlbCc7XHJcblxyXG4gICAgcHVibGljIGNhbGxiYWNrKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIHdoZWVsRXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGRlbHRhWVZhbHVlID0gKHdoZWVsRXZlbnQuZGVsdGFZID4gMCAmJiB3aGVlbEV2ZW50LmRlbHRhWSAhPT0gMCA/IDEgOiAtMSkgLyAyICogdmlldy5nZXREaXZpZGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0ge1xyXG4gICAgICAgICAgICBvZmZzZXRYOiB3aGVlbEV2ZW50Lm9mZnNldFgsXHJcbiAgICAgICAgICAgIGRlbHRhWTogZGVsdGFZVmFsdWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEFuaW1hdGlvbnNNYW5hZ2VyLnN0YXJ0QW5pbWF0aW9uKFxyXG4gICAgICAgICAgICAnd2hlZWwnLFxyXG4gICAgICAgICAgICA0MDAsXHJcbiAgICAgICAgICAgIFswXSxcclxuICAgICAgICAgICAgW2V2ZW50LmRlbHRhWV0sXHJcbiAgICAgICAgICAgIChlYXNlZFZhbHVlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgICAgICAgICAgKC1ldmVudC5kZWx0YVkgJiYgdmlldy5tYXhab29tSW4oLWV2ZW50LmRlbHRhWSkpIHx8ICgtZXZlbnQuZGVsdGFZICYmIHZpZXcubWF4Wm9vbU91dCgtZXZlbnQuZGVsdGFZKSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBbIHdoZWVsVmFsdWUgXSA9IGVhc2VkVmFsdWVzOyBcclxuICAgICAgICAgICAgICAgIFdoZWVsLmNhbGN1bGF0ZShjYW52YXMsIGRpbWVuc2lvbnMsIHZpZXcsIGV2ZW50IGFzIFdoZWVsRXZlbnQsIC13aGVlbFZhbHVlKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogV2hlZWxFdmVudCwgd2hlZWxWYWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZ3JhcGhXaWR0aCA9IGRpbWVuc2lvbnMuZ2V0V2lkdGgoKTtcclxuICAgICAgICBjb25zdCBzY3JvbGxTcGVlZCA9IHdoZWVsVmFsdWU7XHJcbiAgICAgICAgY29uc3Qgem9vbU9mZnNldFN5bmNWYWx1ZSA9IHRoaXMuY2FsY3VsYXRlT2Zmc2V0U3luYyhncmFwaFdpZHRoLCBkaW1lbnNpb25zLCBldmVudCwgc2Nyb2xsU3BlZWQsIHZpZXcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHpvb21PZmZzZXRTeW5jVmFsdWUgIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5leGVjdXRlWm9vbShzY3JvbGxTcGVlZCwgem9vbU9mZnNldFN5bmNWYWx1ZSwgdmlldyk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlT2Zmc2V0T3ZlcmZsb3codmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZU9mZnNldFN5bmMoZ3JhcGhXaWR0aDogbnVtYmVyLCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCBldmVudDogV2hlZWxFdmVudCwgc2Nyb2xsU3BlZWQ6IG51bWJlciwgdmlldzogVmlldyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIChncmFwaFdpZHRoICsgdmlldy5nZXRWaWV3T2Zmc2V0KCkgLSBkaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSAtIGV2ZW50Lm9mZnNldFgpIC8gdmlldy5nZXRDb2xJbnRlcnZhbCgpICogc2Nyb2xsU3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXhlY3V0ZVpvb20oc2Nyb2xsU3BlZWQ6IG51bWJlciwgem9vbU9mZnNldFN5bmNWYWx1ZTogbnVtYmVyLCB2aWV3OiBWaWV3KTogdm9pZCB7XHJcbiAgICAgICAgdmlldy5hZGRDb2xJbnRlcnZhbChzY3JvbGxTcGVlZCk7XHJcbiAgICAgICAgdmlldy5hZGRWaWV3T2Zmc2V0KHpvb21PZmZzZXRTeW5jVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHVwZGF0ZU9mZnNldE92ZXJmbG93KHZpZXc6IFZpZXcpOiB2b2lkIHtcclxuICAgICAgICBpZih2aWV3LmdldFZpZXdPZmZzZXQoKSA8PSAwKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2V0Vmlld09mZnNldCgwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgTWF0aFV0aWxzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGludGVycG9sYXRlKGNoYXJ0SGVpZ2h0OiBudW1iZXIsIHlUb0RyYXc6IG51bWJlciwgbWF4TG93Q2FuZGxlOiBudW1iZXIsIG1heEhpZ2hDYW5kbGU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGlvbiA9ICgoY2hhcnRIZWlnaHQpICogKHlUb0RyYXcgLSBtYXhMb3dDYW5kbGUpKSAvIChtYXhIaWdoQ2FuZGxlIC0gbWF4TG93Q2FuZGxlKTtcclxuICAgICAgICBpZihpbnRlcnBvbGF0aW9uID4gY2hhcnRIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICAgIGxldCBkaWZmID0gTWF0aC5hYnMoaW50ZXJwb2xhdGlvbiAtIGNoYXJ0SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGFydEhlaWdodCAvIDIgLSBkaWZmO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGlvbiA8IGNoYXJ0SGVpZ2h0IC8gMikge1xyXG4gICAgICAgICAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGludGVycG9sYXRpb24gLSBjaGFydEhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhcnRIZWlnaHQgLyAyICsgZGlmZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBDYW5kbGUgfSBmcm9tICcuLi9lbGVtZW50cy9jYW5kbGUnO1xyXG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IE1hdGhVdGlscyB9IGZyb20gJy4uL21hdGgtdXRpbHMnO1xyXG5leHBvcnQgY2xhc3MgQ2FuZGxlUmVuZGVyZXIge1xyXG4gICAgcHVibGljIGRyYXcoY2FuZGxlOiBDYW5kbGUsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IFsgbWF4SGlnaENhbmRsZSwgbWF4TG93Q2FuZGxlIF0gPSBDYW5kbGUuZ2V0SGlnaExvdygpOyBcclxuICAgICAgICBjb25zdCBncmFwaEhlaWdodCA9IGRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkgLSBkaW1lbnNpb25zLmdldFZlcnRpY2FsTWFyZ2luKCk7XHJcblxyXG4gICAgICAgIGlmKGNhbmRsZS5nZXRYU3RhcnQoKSA8PSBkaW1lbnNpb25zLmdldFdpZHRoKCkgLSBkaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSArIDEwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHlEcmF3aW5nSGlnaCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLnlIaWdoLCBtYXhMb3dDYW5kbGUsIG1heEhpZ2hDYW5kbGUpO1xyXG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ0xvdyA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLnlMb3csIG1heExvd0NhbmRsZSwgbWF4SGlnaENhbmRsZSk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oY2FuZGxlLmdldFhTdGFydCgpLCB5RHJhd2luZ0xvdyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGNhbmRsZS5nZXRYU3RhcnQoKSwgeURyYXdpbmdIaWdoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNhbmRsZS5nZXRDb2xvcigpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgeURyYXdpbmdTdGFydCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLmdldFlTdGFydCgpLCBtYXhMb3dDYW5kbGUsIG1heEhpZ2hDYW5kbGUpO1xyXG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ0VuZCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLmdldFlFbmQoKSwgbWF4TG93Q2FuZGxlLCBtYXhIaWdoQ2FuZGxlKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnJvdW5kUmVjdChjYW5kbGUuZ2V0WFN0YXJ0KCkgLSAoMSAqIChjYW5kbGUud2lkdGggPz8gMCkpIC8gMiwgeURyYXdpbmdFbmQsIDEgKiAoY2FuZGxlLndpZHRoID8/IDApLCB5RHJhd2luZ1N0YXJ0IC0geURyYXdpbmdFbmQsIDEpXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY2FuZGxlLmdldENvbG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcclxuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xyXG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi4vZWxlbWVudHMvbGluZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZVJlbmRlcmVyIHtcclxuICAgIHB1YmxpYyBkcmF3KGxpbmU6IExpbmUsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvcGVydGllczogSVJlbmRlclByb3BlcnRpZXMpOiB2b2lkIHtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKGxpbmUuZ2V0WFN0YXJ0KCksIGxpbmUuZ2V0WVN0YXJ0KCkpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKGxpbmUuZ2V0WEVuZCgpLCBsaW5lLmdldFlFbmQoKSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjQTlBOUE5JztcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHByb3BlcnRpZXMud2lkdGggPz8gMTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xyXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi4vZWxlbWVudHMvZWxlbWVudCdcclxuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICAgICBkaW1lbnNpb25zOiBEaW1lbnNpb25zXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIGRpbWVuc2lvbnM6IERpbWVuc2lvbnM7XHJcblxyXG4gICAgcHVibGljIGRyYXcoZWxlbWVudFNldDogU2V0PEVsZW1lbnRbXT4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNsZWFyVmlldygpO1xyXG5cclxuICAgICAgICBlbGVtZW50U2V0LmZvckVhY2gocmVuZGVyRWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHJlbmRlckVsZW1lbnQuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihlbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyVmlldygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpLCB0aGlzLmRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgICBpZihlbGVtZW50LmdldFhTdGFydCgpIDw9IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVuZGVyKGVsZW1lbnQsIHRoaXMuY29udGV4dCwgdGhpcy5kaW1lbnNpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3JlbmRlcmVsZW1lbnRcIjtcclxuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gXCIuLi9kaW1lbnNpb25zXCI7XHJcbmltcG9ydCB7IFRleHQgfSBmcm9tIFwiLi4vZWxlbWVudHMvdGV4dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRSZW5kZXJlciB7XHJcbiAgICBwdWJsaWMgZHJhdyh0ZXh0OiBUZXh0LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByb3BlcnRpZXM6IElSZW5kZXJQcm9wZXJ0aWVzKTogdm9pZCB7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCI5cHggQmFybG93XCI7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0E5QTlBOSc7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LmdldFZhbHVlKCksIHRleHQuZ2V0WFN0YXJ0KCksIHRleHQuZ2V0WVN0YXJ0KCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSVZpZXdDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3IHtcclxuICAgIGNvbnN0cnVjdG9yKHZpZXdDb25maWc6IElWaWV3Q29uZmlnKSB7XHJcbiAgICAgICAgY29uc3QgeyBcclxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xJbml0LCBcclxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xSYXRpb3MsIFxyXG4gICAgICAgICAgICB2aWV3T2Zmc2V0LCBcclxuICAgICAgICAgICAgaW50ZXJ2YWxTdGVwLCBcclxuICAgICAgICAgICAgaW50ZXJ2YWxDYW5kbGVzLFxyXG4gICAgICAgICAgICBpbnRlcnZhbFN1YkNvbFJhdGlvc1xyXG4gICAgICAgIH0gPSB2aWV3Q29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLmNvbEludGVydmFsID0gaW50ZXJ2YWxDb2xJbml0O1xyXG4gICAgICAgIHRoaXMudmlld09mZnNldCA9IHZpZXdPZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5jb2xJbnRlcnZhbFJhdGlvcyA9IGludGVydmFsQ29sUmF0aW9zO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxTdGVwID0gaW50ZXJ2YWxTdGVwO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxDYW5kbGVzID0gaW50ZXJ2YWxDYW5kbGVzO1xyXG4gICAgICAgIHRoaXMuc3ViQ29sSW50ZXJ2YWxSYXRpb3MgPSBpbnRlcnZhbFN1YkNvbFJhdGlvcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbEludGVydmFsOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHZpZXdPZmZzZXQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY29sSW50ZXJ2YWxSYXRpb3M6IG51bWJlcltdO1xyXG4gICAgcHJpdmF0ZSBzdWJDb2xJbnRlcnZhbFJhdGlvczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIGludGVydmFsU3RlcDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBpbnRlcnZhbENhbmRsZXM6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0SW50ZXJ2YWxDYW5kbGVzKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWxDYW5kbGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREaXZpZGVyKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDIsIHRoaXMuaW50ZXJ2YWxTdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3ViQ29sUmF0aW8oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDb2xJbnRlcnZhbFJhdGlvc1t0aGlzLmludGVydmFsU3RlcF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbEludGVydmFsKHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmKHRoaXMubWF4Wm9vbU91dCh4KSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbEludGVydmFsID0gdGhpcy5nZXRNaW5Db2xJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLm1heFpvb21Jbih4KSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbEludGVydmFsID0gdGhpcy5nZXRNYXhDb2xJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbEludGVydmFsICs9IHg7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJbnRlcnZhbFN0ZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE1pbkNvbEludGVydmFsKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWxSYXRpb3NbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEludGVydmFsU3RlcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmludGVydmFsU3RlcDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE1heENvbEludGVydmFsKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWxSYXRpb3NbdGhpcy5jb2xJbnRlcnZhbFJhdGlvcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWF4Wm9vbU91dCh4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWwgKyB4IDw9IHRoaXMuZ2V0TWluQ29sSW50ZXJ2YWwoKSAmJiB4IDw9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1heFpvb21Jbih4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWwgKyB4ID49IHRoaXMuZ2V0TWF4Q29sSW50ZXJ2YWwoKSAgJiYgeCA+PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlSW50ZXJ2YWxTdGVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2hlY2tJZk5leHRTdGVwKCk7XHJcbiAgICAgICAgdGhpcy5jaGVja0lmUHJldlN0ZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrSWZOZXh0U3RlcCgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLmludGVydmFsU3RlcCAhPT0gKHRoaXMuY29sSW50ZXJ2YWxSYXRpb3MubGVuZ3RoIC0gMSkgJiYgdGhpcy5jb2xJbnRlcnZhbCA+PSB0aGlzLmNvbEludGVydmFsUmF0aW9zW3RoaXMuaW50ZXJ2YWxTdGVwICsgMV0pIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbFN0ZXArKztcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tJZlByZXZTdGVwKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuaW50ZXJ2YWxTdGVwICE9PSAwICYmIHRoaXMuY29sSW50ZXJ2YWwgPCB0aGlzLmNvbEludGVydmFsUmF0aW9zW3RoaXMuaW50ZXJ2YWxTdGVwXSkge1xyXG4gICAgICAgICAgICB0aGlzLmludGVydmFsU3RlcC0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29sSW50ZXJ2YWwoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xJbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Vmlld09mZnNldCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdPZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZpZXdPZmZzZXQoeDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy52aWV3T2Zmc2V0ID0geDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkVmlld09mZnNldCh4OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLmNvbEludGVydmFsICE9PSB0aGlzLmdldE1pbkNvbEludGVydmFsKCkgJiYgdGhpcy5jb2xJbnRlcnZhbCAhPT0gdGhpcy5nZXRNYXhDb2xJbnRlcnZhbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld09mZnNldCArPSB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCAqIGZyb20gJy4vY2hhcnQvY2hhcnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2NoYXJ0L2FwaS9hcGktY29udHJvbGxlcic7XHJcblxyXG5pbXBvcnQgeyBDaGFydCB9IGZyb20gJy4vY2hhcnQvY2hhcnQnO1xyXG5cclxuY29uc3QgY2hhcnRDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcnQnKTtcclxuY29uc3QgY2hhcnQgPSBuZXcgQ2hhcnQoY2hhcnRDYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xyXG5jb25zb2xlLmxvZygnY2hhcnQnLCBjaGFydCwgY2hhcnRDYW52YXMpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==