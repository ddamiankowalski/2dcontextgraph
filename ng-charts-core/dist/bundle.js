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
var rxjs_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'rxjs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var Chart = /** @class */ (function () {
    function Chart(canvas) {
        var _this = this;
        this.candlesInitialised$ = new rxjs_1.Subject();
        this.fetchCandles('http://localhost:3000/candles')
            .then(function (res) { return res.json(); })
            .then(function (candles) { return _this.initChart(candles, canvas); })
            .catch(function () { return _this.initChart([], canvas); });
    }
    Chart.prototype.observeCandles$ = function () {
        return this.candlesInitialised$.asObservable();
    };
    Chart.prototype.initChart = function (candles, canvas) {
        this.canvas = canvas;
        this.context = this.getRenderingContext();
        if (this.context) {
            this.chartManager = new chart_manager_1.ChartManager(this.context, this.canvas, candles.reverse());
        }
        this.candlesInitialised$.next(candles);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBRyxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDeEYsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQUVNLDZCQUFjLEdBQXJCO1FBQ0ksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFTSw0QkFBYSxHQUFwQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sNEJBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0sNEJBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixJQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtZQUMvRixJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztTQUN4QjtJQUNMLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQztBQTNHWSxvQkFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRmpCLHdGQUE4QjtBQUM5QixrSEFBMkM7Ozs7Ozs7VUNEM0M7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FuaW1hdGlvbnMvYW5pbWF0aW9uLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FuaW1hdGlvbnMvYW5pbWF0aW9ucy1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2FwaS9hcGktY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9jaGFydC1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2NoYXJ0LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2RpbWVuc2lvbnMudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZWxlbWVudHMvY2FuZGxlLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2VsZW1lbnQtY29sbGVjdG9yLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2VsZW1lbnRzL2VsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZWxlbWVudHMvbGluZS50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9lbGVtZW50cy90ZXh0LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9ldmVudC1tYW5hZ2VyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L2V2ZW50cy9tb3VzZWRvd24udHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL21vdXNlbW92ZS50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC9ldmVudHMvbW91c2VvdXQudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL21vdXNldXAudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvZXZlbnRzL3doZWVsLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L21hdGgtdXRpbHMudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvY2FuZGxlLXJlbmRlcmVyLnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2NoYXJ0L3JlbmRlcmVyL2xpbmUtcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvLi9zcmMvY2hhcnQvcmVuZGVyZXIvdGV4dC1yZW5kZXJlci50cyIsIndlYnBhY2s6Ly9uZy1jaGFydHMtY29yZS8uL3NyYy9jaGFydC92aWV3LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vbmctY2hhcnRzLWNvcmUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL25nLWNoYXJ0cy1jb3JlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4vYW5pbWF0aW9ucy1tYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBkdXJhdGlvbjogbnVtYmVyLCBzdGFydFZhbHVlczogbnVtYmVyW10sIGVuZFZhbHVlczogbnVtYmVyW10sIGNhbGxiYWNrOiAoLi4uYXJnOiBhbnlbXSkgPT4gdm9pZCwgZWFzZVR5cGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFydFRpbWUgPSBBbmltYXRpb25zTWFuYWdlci5nZXRDdXJyZW50VGltZVN0YW1wKCk7XG4gICAgICAgIHRoaXMubXNEdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICB0aGlzLnN0YXJ0VmFsdWVzID0gc3RhcnRWYWx1ZXM7XG4gICAgICAgIHRoaXMuZW5kVmFsdWVzID0gZW5kVmFsdWVzO1xuICAgICAgICB0aGlzLnNldFZhbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuZWFzZVR5cGUgPSBlYXNlVHlwZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNGaW5pc2hlZCA9IGZhbHNlO1xuXG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwcml2YXRlIGVhc2VUeXBlOiBib29sZWFuO1xuICAgIHByaXZhdGUgYW5pbWF0aW9uU3RhcnRUaW1lOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBtc0R1cmF0aW9uOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzdGFydFZhbHVlczogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBlbmRWYWx1ZXM6IG51bWJlcltdO1xuICAgIHByaXZhdGUgc2V0VmFsQ2FsbGJhY2s6ICguLi5hcmc6IGFueVtdKSA9PiB2b2lkO1xuXG4gICAgcHVibGljIHVwZGF0ZUFuaW1hdGlvblBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBBbmltYXRpb25zTWFuYWdlci5nZXRDdXJyZW50VGltZVN0YW1wKCk7XG5cbiAgICAgICAgaWYoY3VycmVudFRpbWUgLSB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSA8PSB0aGlzLm1zRHVyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVQcm9ncmVzcyA9IHRoaXMuZ2V0VGltZVByb2dyZXNzKGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGVhc2UgPSB0aGlzLmdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3MpO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHRWYWx1ZXMgPSB0aGlzLnN0YXJ0VmFsdWVzLm1hcCgodiwgaW5kZXgpID0+IHYgKyAodGhpcy5lbmRWYWx1ZXNbaW5kZXhdIC0gdikgKiBlYXNlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsQ2FsbGJhY2socmVzdWx0VmFsdWVzLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEVhc2VGdW5jdGlvbih0aW1lUHJvZ3Jlc3M6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGlmKCF0aGlzLmVhc2VUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYXNlSW5PdXRRdWludCh0aW1lUHJvZ3Jlc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFzZUluT3V0U2luZSh0aW1lUHJvZ3Jlc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUaW1lUHJvZ3Jlc3MoY3VycmVudFRpbWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAoY3VycmVudFRpbWUgLSB0aGlzLmFuaW1hdGlvblN0YXJ0VGltZSkgLyB0aGlzLm1zRHVyYXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlSW5PdXRRdWludCh4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLTEwICogeCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlYXNlSW5PdXRTaW5lKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB4IDwgMC41XG4gICAgICAgID8gKDEgLSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KDIgKiB4LCAyKSkpIC8gMlxuICAgICAgICA6IChNYXRoLnNxcnQoMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U3RhcnRWYWx1ZXModmFsdWVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXJ0VmFsdWVzID0gdmFsdWVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRFbmRWYWx1ZXModmFsdWVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmVuZFZhbHVlcyA9IHZhbHVlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmFsdWVzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFZhbHVlczogdGhpcy5zdGFydFZhbHVlcyxcbiAgICAgICAgICAgIGVuZFZhbHVlczogdGhpcy5lbmRWYWx1ZXNcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICcuL2FuaW1hdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25zTWFuYWdlciB7IFxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBzdGF0aWMgY3VycmVudFJlbmRlckJsb2NrID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudFRpbWVTdGFtcDogbnVtYmVyO1xuICAgIHByaXZhdGUgc3RhdGljIGFuaW1hdGlvblN0YWNrOiBBbmltYXRpb25bXSA9IFtdO1xuXG4gICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VGltZVN0YW1wKHRpbWU6IG51bWJlcik6IHZvaWQgeyBcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZVN0YW1wID0gdGltZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEN1cnJlbnRUaW1lU3RhbXAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVTdGFtcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEFuaW1hdGlvblN0YWNrKCk6IEFuaW1hdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uU3RhY2s7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBzdGFydEFuaW1hdGlvbih0eXBlOiBzdHJpbmcsIG1zRHVyYXRpb246IG51bWJlciwgc3RhcnRWYWx1ZXM6IG51bWJlcltdLCBlbmRWYWx1ZXM6IG51bWJlcltdLCBjYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQsIGVhc2VUeXBlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tEdXBsaWNhdGVzKHR5cGUpXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhY2sucHVzaChuZXcgQW5pbWF0aW9uKHR5cGUsIG1zRHVyYXRpb24sIHN0YXJ0VmFsdWVzLCBlbmRWYWx1ZXMsIGNhbGxiYWNrLCBlYXNlVHlwZSkpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tEdXBsaWNhdGVzKHR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkdXBsaWNhdGVzID0gdGhpcy5hbmltYXRpb25TdGFjay5maWx0ZXIoYW5pbWF0aW9uID0+IGFuaW1hdGlvbi50eXBlID09PSB0eXBlKTtcblxuICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCB0aGUgZHVwbGljYXRlcyBpbiB0aGUgZnV0dXJlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICBBbmltYXRpb25zTWFuYWdlci51cGRhdGVTdGFjaygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YWNrLmZvckVhY2goYW5pbWF0aW9uID0+IHtcbiAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRSZW5kZXJCbG9jaykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi51cGRhdGVBbmltYXRpb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVTdGFjaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFjayA9IHRoaXMuYW5pbWF0aW9uU3RhY2suZmlsdGVyKGFuaW1hdGlvbiA9PiAhYW5pbWF0aW9uLmlzRmluaXNoZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXJTdGFjaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2V0QmxvY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudFJlbmRlckJsb2NrID0gdHJ1ZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQW5pbWF0aW9uc01hbmFnZXIgfSBmcm9tIFwiLi4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXJcIjtcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwiLi4vdmlld1wiO1xuXG5leHBvcnQgY2xhc3MgQ2hhcnRBUElDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSB2aWV3OiBWaWV3XG4gICAgKSB7fVxuXG4gICAgcHVibGljIHJlc2V0Vmlld09mZnNldChtc1RpbWUgPSA0MDApOiB2b2lkIHtcbiAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIuc3RhcnRBbmltYXRpb24oXG4gICAgICAgICAgICAncmVzZXRWaWV3T2Zmc2V0JyxcbiAgICAgICAgICAgIG1zVGltZSxcbiAgICAgICAgICAgIFt0aGlzLnZpZXcuZ2V0Vmlld09mZnNldCgpXSxcbiAgICAgICAgICAgIFswXSxcbiAgICAgICAgICAgIChlYXNlZFZhbHVlczogbnVtYmVyW10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBbIHZpZXdPZmZzZXQgXSA9IGVhc2VkVmFsdWVzOyBcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuc2V0Vmlld09mZnNldCh2aWV3T2Zmc2V0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgfVxufSIsImltcG9ydCB7IEVsZW1lbnRDb2xsZWN0b3IgfSBmcm9tICcuL2VsZW1lbnRzL2VsZW1lbnQtY29sbGVjdG9yJztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBDYW5kbGUgfSBmcm9tICcuL2VsZW1lbnRzL2NhbmRsZSc7IFxuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xuaW1wb3J0IHsgUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyL3JlbmRlcmVyJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICcuL2VsZW1lbnRzL2VsZW1lbnQnO1xuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudHMvZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQgeyBXaGVlbCB9IGZyb20gJy4vZXZlbnRzL3doZWVsJztcbmltcG9ydCB7IE1vdXNlb3V0IH0gZnJvbSAnLi9ldmVudHMvbW91c2VvdXQnO1xuaW1wb3J0IHsgTW91c2Vkb3duIH0gZnJvbSAnLi9ldmVudHMvbW91c2Vkb3duJztcbmltcG9ydCB7IE1vdXNldXAgfSBmcm9tICcuL2V2ZW50cy9tb3VzZXVwJztcbmltcG9ydCB7IE1vdXNlbW92ZSB9IGZyb20gJy4vZXZlbnRzL21vdXNlbW92ZSc7XG5pbXBvcnQgeyBBbmltYXRpb25zTWFuYWdlciB9IGZyb20gJy4vYW5pbWF0aW9ucy9hbmltYXRpb25zLW1hbmFnZXInO1xuaW1wb3J0IHsgSVZpZXdDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcuaW50ZXJmYWNlJztcbmltcG9ydCB7IENoYXJ0QVBJQ29udHJvbGxlciB9IGZyb20gJy4vYXBpL2FwaS1jb250cm9sbGVyJztcblxuZXhwb3J0IGNsYXNzIENoYXJ0TWFuYWdlciB7XG4gICAgcHVibGljIGFwaUNvbnRyb2xsZXIhOiBDaGFydEFQSUNvbnRyb2xsZXI7XG5cbiAgICBwcml2YXRlIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGRpbWVuc2lvbnMhOiBEaW1lbnNpb25zO1xuICAgIHByaXZhdGUgdmlldyE6IFZpZXc7XG4gICAgcHJpdmF0ZSByZW5kZXJlciE6IFJlbmRlcmVyO1xuICAgIHByaXZhdGUgZXZlbnRNYW5hZ2VyITogRXZlbnRNYW5hZ2VyO1xuICAgIHByaXZhdGUgY2FuZGxlcyE6IENhbmRsZVBheWxvYWRbXTtcbiAgICBwcml2YXRlIGxhc3RSZW5kZXIhOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBhbmltYXRpb25zITogQW5pbWF0aW9uc01hbmFnZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICAgICAgICB0aGlzLnNldENhbnZhc0RpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5zZXRWaWV3KCk7XG4gICAgICAgIHRoaXMuc2V0UmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDYW5kbGVzKGNhbmRsZXMpO1xuICAgICAgICB0aGlzLmFkZENhbnZhc0xpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxOTFmMmNcIjtcblxuICAgICAgICB0aGlzLnJlcXVlc3ROZXh0RnJhbWUoMCk7XG5cbiAgICAgICAgdGhpcy5hcGlDb250cm9sbGVyID0gbmV3IENoYXJ0QVBJQ29udHJvbGxlcih0aGlzLnZpZXcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVBcGlDb250cm9sbGVyKCk6IENoYXJ0QVBJQ29udHJvbGxlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaUNvbnRyb2xsZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW52YXNEaW1lbnNpb25zKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBbIGhvcml6b250YWxNYXJnaW4sIHZlcnRpY2FsTWFyZ2luIF0gPSBbIDc1LCA0MCBdO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBuZXcgRGltZW5zaW9ucyh0aGlzLmNhbnZhcywgaG9yaXpvbnRhbE1hcmdpbiwgdmVydGljYWxNYXJnaW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VmlldygpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgdmlld0NvbmZpZzogSVZpZXdDb25maWcgPSB7XG4gICAgICAgICAgICBpbnRlcnZhbE5hbWU6ICdNMScsXG4gICAgICAgICAgICBpbnRlcnZhbENhbmRsZXM6IDYwLFxuICAgICAgICAgICAgaW50ZXJ2YWxTdGVwOiAwLFxuICAgICAgICAgICAgaW50ZXJ2YWxDb2xJbml0OiAxNTAsXG4gICAgICAgICAgICBpbnRlcnZhbENvbFJhdGlvczogWzE1MCwgMzAwLCA2MDAsIDEyMDBdLFxuICAgICAgICAgICAgaW50ZXJ2YWxTdWJDb2xSYXRpb3M6IFsxMCwgNSwgMSwgMV0sXG4gICAgICAgICAgICB2aWV3T2Zmc2V0OiAwXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFZpZXcodmlld0NvbmZpZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLmNvbnRleHQsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW5kbGVzKGNhbmRsZXM6IENhbmRsZVBheWxvYWRbXSk6IHZvaWQge1xuICAgICAgICBDYW5kbGUuZmluZE1heExvd0luRGF0YShjYW5kbGVzKTtcbiAgICAgICAgdGhpcy5jYW5kbGVzID0gY2FuZGxlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENhbnZhc0xpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKHRoaXMuY2FudmFzLCB0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldyk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgV2hlZWwoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2VvdXQoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2Vkb3duKCkpO1xuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlci5saXN0ZW4obmV3IE1vdXNldXAoKSk7XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyLmxpc3RlbihuZXcgTW91c2Vtb3ZlKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdE5leHRGcmFtZSh0aW1lOiBudW1iZXIgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICAgICAgaWYodGltZSkge1xuICAgICAgICAgICAgQW5pbWF0aW9uc01hbmFnZXIuc2V0Q3VycmVudFRpbWVTdGFtcCh0aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLmxhc3RSZW5kZXIgfHwgdGltZSAmJiB0aW1lIC0gdGhpcy5sYXN0UmVuZGVyID49IDE2KSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZW5kZXIgPSB0aW1lID8/IDA7XG4gICAgICAgICAgICBDYW5kbGUucmVzZXRIaWdoTG93KCk7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZ2V0UmVuZGVyaW5nRWxlbWVudHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudHMoZWxlbWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlcXVlc3ROZXh0RnJhbWUuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZW5kZXJpbmdFbGVtZW50cygpOiBTZXQ8RWxlbWVudFtdPiB7XG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudENvbGxlY3Rvcih0aGlzLmRpbWVuc2lvbnMsIHRoaXMudmlldywgdGhpcy5jYW5kbGVzKS5nZXRFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyRWxlbWVudHMoZWxlbWVudHM6IFNldDxFbGVtZW50W10+KTogdm9pZCB7XG4gICAgICAgIEFuaW1hdGlvbnNNYW5hZ2VyLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmRyYXcoZWxlbWVudHMpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDaGFydE1hbmFnZXIgfSBmcm9tICcuL2NoYXJ0LW1hbmFnZXInO1xuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xuaW1wb3J0IHsgQ2hhcnRBUElDb250cm9sbGVyIH0gZnJvbSAnLi9hcGkvYXBpLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgY2xhc3MgQ2hhcnQge1xuXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB0aGlzLmZldGNoQ2FuZGxlcygnaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhbmRsZXMnKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihjYW5kbGVzID0+IHRoaXMuaW5pdENoYXJ0KGNhbmRsZXMsIGNhbnZhcykpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5pbml0Q2hhcnQoW10sIGNhbnZhcykpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FudmFzITogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjaGFydE1hbmFnZXIhOiBDaGFydE1hbmFnZXI7XG4gICAgcHJpdmF0ZSBjb250ZXh0ITogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcbiAgICBwcml2YXRlIGNhbmRsZXNJbml0aWFsaXNlZCQ6IFN1YmplY3Q8Q2FuZGxlUGF5bG9hZFtdPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICBwdWJsaWMgb2JzZXJ2ZUNhbmRsZXMkKCk6IE9ic2VydmFibGU8Q2FuZGxlUGF5bG9hZFtdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbmRsZXNJbml0aWFsaXNlZCQuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0Q2hhcnQoY2FuZGxlczogQ2FuZGxlUGF5bG9hZFtdLCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmdldFJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgICAgICBpZih0aGlzLmNvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcnRNYW5hZ2VyID0gbmV3IENoYXJ0TWFuYWdlcih0aGlzLmNvbnRleHQsIHRoaXMuY2FudmFzLCBjYW5kbGVzLnJldmVyc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbmRsZXNJbml0aWFsaXNlZCQubmV4dChjYW5kbGVzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJlbmRlcmluZ0NvbnRleHQoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCB7XG4gICAgICAgIGlmKHdpbmRvdy5IVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hDYW5kbGVzKGVuZHBvaW50OiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBmZXRjaChlbmRwb2ludCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFwaUNvbnRyb2xsZXIoKTogQ2hhcnRBUElDb250cm9sbGVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnRNYW5hZ2VyLmNyZWF0ZUFwaUNvbnRyb2xsZXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgR3JhcGhEaW1lbnNpb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kaW1lbnNpb25zJztcblxuZXhwb3J0IGNsYXNzIERpbWVuc2lvbnMge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGhvcml6b250YWxNYXJnaW46IG51bWJlciwgdmVydGljYWxNYXJnaW46IG51bWJlcikge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsTWFyZ2luID0gaG9yaXpvbnRhbE1hcmdpbjtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbE1hcmdpbiA9IHZlcnRpY2FsTWFyZ2luO1xuICAgICAgICB0aGlzLnNldERpbWVuc2lvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBHcmFwaERpbWVuc2lvbnMgPSB7fTtcbiAgICBwcml2YXRlIGhvcml6b250YWxNYXJnaW46IG51bWJlcjtcbiAgICBwcml2YXRlIHZlcnRpY2FsTWFyZ2luOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy53aWR0aCA/PyAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgPz8gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGltZW5zaW9ucygpOiBHcmFwaERpbWVuc2lvbnMge1xuICAgICAgICByZXR1cm4gdGhpcy5kaW1lbnNpb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWZXJ0aWNhbE1hcmdpbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbE1hcmdpbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SG9yaXpvbnRhbE1hcmdpbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3Jpem9udGFsTWFyZ2luO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RGltZW5zaW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNTdHlsZVdpZHRoQW5kSGVpZ2h0KCk7XG4gICAgICAgIHRoaXMuc2V0Q2FudmFzV2lkdGhBbmRIZWlnaHQoKTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLmhlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zLndpZHRoID0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYW52YXNTdHlsZVdpZHRoQW5kSGVpZ2h0KHdpZHRoOiBudW1iZXIgPSAxMjgwLCBoZWlnaHQ6IG51bWJlciA9IDQwMCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENhbnZhc1dpZHRoQW5kSGVpZ2h0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMub2Zmc2V0V2lkdGg7XG4gICAgfVxufSIsImltcG9ydCB7IENhbmRsZVBheWxvYWQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbmRsZXN0aWNrJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICcuL2VsZW1lbnQnO1xuaW1wb3J0IHsgSTJEQ29vcmRzLCBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBDYW5kbGVSZW5kZXJlciB9IGZyb20gJy4uL3JlbmRlcmVyL2NhbmRsZS1yZW5kZXJlcic7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBDYW5kbGUgZXh0ZW5kcyBFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgY29vcmRzOiBJMkRDb29yZHMsIFxuICAgICAgICBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcywgXG4gICAgICAgIGNhbmRsZTogQ2FuZGxlUGF5bG9hZFxuICAgICkge1xuICAgICAgICBzdXBlcihjb29yZHMsIHByb3BlcnRpZXMpO1xuICAgICAgICB0aGlzLnNldEN1cnJlbnRIaWdoTG93KGNhbmRsZSk7XG4gICAgICAgIENhbmRsZS5pbml0aWFsaXplUmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDb2xvcihjYW5kbGUpO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSBwcm9wZXJ0aWVzLndpZHRoO1xuICAgICAgICB0aGlzLnlFbmQgPSBjYW5kbGUub3BlbjtcbiAgICAgICAgdGhpcy55U3RhcnQgPSBjYW5kbGUuY2xvc2U7XG4gICAgICAgIHRoaXMueUhpZ2ggPSBjYW5kbGUuaGlnaDtcbiAgICAgICAgdGhpcy55TG93ID0gY2FuZGxlLmxvdztcbiAgICAgICAgdGhpcy50aW1lID0gY2FuZGxlLnRpbWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVuZGVyZXI6IENhbmRsZVJlbmRlcmVyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudE1heEhpZ2g/OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudE1heExvdz86IG51bWJlcjtcblxuICAgIHByaXZhdGUgc3RhdGljIG1heEhpZ2g6IG51bWJlcjtcbiAgICBwcml2YXRlIHN0YXRpYyBtYXhMb3c6IG51bWJlcjtcblxuICAgIHByaXZhdGUgY29sb3IhOiBzdHJpbmc7XG4gICAgXG4gICAgcHVibGljIHdpZHRoPzogbnVtYmVyO1xuICAgIHB1YmxpYyB5SGlnaDogbnVtYmVyO1xuICAgIHB1YmxpYyB5TG93OiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0aW1lOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgcmVuZGVyKGVsZW1lbnQ6IENhbmRsZSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkaW1lbnNpb25zOiBEaW1lbnNpb25zKTogdm9pZCB7XG4gICAgICAgIENhbmRsZS5yZW5kZXJlci5kcmF3KGVsZW1lbnQsIGRpbWVuc2lvbnMsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDYW5kbGVUaW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpbWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDb2xvcihjYW5kbGU6IENhbmRsZVBheWxvYWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNhbmRsZS5vcGVuID4gY2FuZGxlLmNsb3NlID8gJyM1NmI3ODYnIDogJyNlYjRlNWMnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEN1cnJlbnRIaWdoTG93KGNhbmRsZTogQ2FuZGxlUGF5bG9hZCk6IHZvaWQge1xuICAgICAgICBpZighQ2FuZGxlLmN1cnJlbnRNYXhIaWdoIHx8IGNhbmRsZS5oaWdoID4gQ2FuZGxlLmN1cnJlbnRNYXhIaWdoKSB7XG4gICAgICAgICAgICBDYW5kbGUuY3VycmVudE1heEhpZ2ggPSBjYW5kbGUuaGlnaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFDYW5kbGUuY3VycmVudE1heExvdyB8fCBjYW5kbGUubG93IDwgQ2FuZGxlLmN1cnJlbnRNYXhMb3cpIHtcbiAgICAgICAgICAgIENhbmRsZS5jdXJyZW50TWF4TG93ID0gY2FuZGxlLmxvdztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmluZE1heExvd0luRGF0YShjYW5kbGVzRGF0YTogQ2FuZGxlUGF5bG9hZFtdKTogdm9pZCB7XG4gICAgICAgIGNhbmRsZXNEYXRhLmZvckVhY2goY2FuZGxlID0+IHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1heEhpZ2ggfHwgY2FuZGxlLmhpZ2ggPiB0aGlzLm1heEhpZ2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1heEhpZ2ggPSBjYW5kbGUuaGlnaDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXRoaXMubWF4TG93IHx8IGNhbmRsZS5sb3cgPCB0aGlzLm1heExvdykge1xuICAgICAgICAgICAgICAgIHRoaXMubWF4TG93ID0gY2FuZGxlLmxvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldE1heExvd0luRGF0YSgpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiBbIHRoaXMubWF4SGlnaCwgdGhpcy5tYXhMb3cgXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlc2V0SGlnaExvdygpOiB2b2lkIHtcbiAgICAgICAgQ2FuZGxlLmN1cnJlbnRNYXhIaWdoID0gdW5kZWZpbmVkO1xuICAgICAgICBDYW5kbGUuY3VycmVudE1heExvdyA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhpZ2hMb3coKTogQXJyYXk8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBbIENhbmRsZS5jdXJyZW50TWF4SGlnaCA/PyAwLCBDYW5kbGUuY3VycmVudE1heExvdyA/PyAwIF07XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIaWdoKCk6IG51bWJlciB7XG4gICAgICAgIGlmKENhbmRsZS5jdXJyZW50TWF4SGlnaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBlc3RhYmxpc2ggY3VycmVudE1heEhpZ2ggZm9yIGEgY2FuZGxlJylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ2FuZGxlLmN1cnJlbnRNYXhIaWdoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TG93KCk6IG51bWJlciB7XG4gICAgICAgIGlmKENhbmRsZS5jdXJyZW50TWF4TG93ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGVzdGFibGlzaCBjdXJyZW50TWF4TG93IGZvciBhIGNhbmRsZScpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENhbmRsZS5jdXJyZW50TWF4TG93O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAgICAgaWYoIUNhbmRsZS5yZW5kZXJlcikge1xuICAgICAgICAgICAgQ2FuZGxlLnJlbmRlcmVyID0gbmV3IENhbmRsZVJlbmRlcmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuaW1wb3J0IHsgQ2FuZGxlUGF5bG9hZCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FuZGxlc3RpY2snO1xuaW1wb3J0IHsgQ2FuZGxlIH0gZnJvbSAnLi9jYW5kbGUnO1xuaW1wb3J0IHsgTGluZSB9IGZyb20gJy4vbGluZSc7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7IFRleHQgfSBmcm9tICcuL3RleHQnO1xuaW1wb3J0IHsgTWF0aFV0aWxzIH0gZnJvbSAnLi4vbWF0aC11dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50Q29sbGVjdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZGltZW5zaW9uczogRGltZW5zaW9ucyxcbiAgICAgICAgdmlldzogVmlldyxcbiAgICAgICAgY2FuZGxlRGF0YTogQ2FuZGxlUGF5bG9hZFtdLFxuICAgICkge1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgICB0aGlzLmNhbmRsZURhdGEgPSBjYW5kbGVEYXRhO1xuICAgICAgICB0aGlzLnNldEVsZW1lbnRzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXJpbmdFbGVtZW50c1NldDogU2V0PEVsZW1lbnRbXT4gPSBuZXcgU2V0KCk7XG5cbiAgICBwcml2YXRlIGRpbWVuc2lvbnM6IERpbWVuc2lvbnM7XG4gICAgcHJpdmF0ZSB2aWV3OiBWaWV3O1xuICAgIHByaXZhdGUgY2FuZGxlRGF0YTogQ2FuZGxlUGF5bG9hZFtdO1xuICAgIHByaXZhdGUgY2FuZGxlczogQ2FuZGxlW10gPSBbXTtcbiAgICBwcml2YXRlIG1haW5Db2x1bW5MaW5lczogTGluZVtdID0gW107XG4gICAgcHJpdmF0ZSBzdWJDb2x1bW5MaW5lczogTGluZVtdID0gW107XG4gICAgcHJpdmF0ZSB0ZXh0OiBUZXh0W10gPSBbXTtcbiAgICBwcml2YXRlIGhvcml6b250YWxMaW5lczogTGluZVtdID0gW107XG5cbiAgICBwdWJsaWMgZ2V0RWxlbWVudHMoKTogU2V0PEVsZW1lbnRbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEVsZW1lbnRzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjYW52YXNXaWR0aCA9IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpO1xuICAgICAgICBsZXQgY3VycmVudENvbHVtbiA9IDA7XG5cbiAgICAgICAgZm9yKGxldCB4RHJhd2luZ09mZnNldCA9IGNhbnZhc1dpZHRoOyB4RHJhd2luZ09mZnNldCArIHRoaXMudmlldy5nZXRWaWV3T2Zmc2V0KCkgPiAwOyB4RHJhd2luZ09mZnNldCA9IHhEcmF3aW5nT2Zmc2V0IC0gdGhpcy52aWV3LmdldENvbEludGVydmFsKCkpIHsgXG4gICAgICAgICAgICBjb25zdCB4RHJhd2luZ1Bvc2l0aW9uID0geERyYXdpbmdPZmZzZXQgKyB0aGlzLnZpZXcuZ2V0Vmlld09mZnNldCgpIC0gdGhpcy5kaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKTtcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4rKzsgICAgICAgICAgXG5cbiAgICAgICAgICAgIGlmKHhEcmF3aW5nUG9zaXRpb24gPiAwICYmIHhEcmF3aW5nUG9zaXRpb24gPCBjYW52YXNXaWR0aCArIHRoaXMudmlldy5nZXRDb2xJbnRlcnZhbCgpICogMikge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2FuZGxlc0luSW50ZXJ2YWwoeERyYXdpbmdQb3NpdGlvbiwgdGhpcy5jYW5kbGVEYXRhLCBjdXJyZW50Q29sdW1uLCBjYW52YXNXaWR0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUaW1lU3RhbXBzKHhEcmF3aW5nUG9zaXRpb24sIGN1cnJlbnRDb2x1bW4sIHRoaXMuY2FuZGxlRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRIb3Jpem9udGFsTGluZXMoKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLnRleHQpO1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLnN1YkNvbHVtbkxpbmVzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJpbmdFbGVtZW50c1NldC5hZGQodGhpcy5tYWluQ29sdW1uTGluZXMpO1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0VsZW1lbnRzU2V0LmFkZCh0aGlzLmhvcml6b250YWxMaW5lcyk7XG4gICAgICAgIHRoaXMucmVuZGVyaW5nRWxlbWVudHNTZXQuYWRkKHRoaXMuY2FuZGxlcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDYW5kbGVzSW5JbnRlcnZhbCh4TWFpbkNvbHVtbkRyYXdpbmdQb3NpdGlvbjogbnVtYmVyLCBjYW5kbGVzRGF0YTogQ2FuZGxlUGF5bG9hZFtdLCBjdXJyZW50Q29sdW1uOiBudW1iZXIsIGdyYXBoV2lkdGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBkaXN0YW5jZUJldHdlZW5DYW5kbGVzID0gdGhpcy5nZXRJbnRlcnZhbENhbmRsZURpc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IGNhbmRsZXNJbkludGVydmFsID0gdGhpcy52aWV3LmdldEludGVydmFsQ2FuZGxlcygpO1xuXG4gICAgICAgIGZvcihsZXQgY2FuZGxlID0gMDsgY2FuZGxlIDwgY2FuZGxlc0luSW50ZXJ2YWw7IGNhbmRsZSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2FuZGxlVG9SZW5kZXIgPSBjYW5kbGVzRGF0YVtjYW5kbGUgKyBjYW5kbGVzSW5JbnRlcnZhbCAqIChjdXJyZW50Q29sdW1uIC0gMSldO1xuICAgICAgICAgICAgdGhpcy5hZGRDYW5kbGVJZkluVmlldyh4TWFpbkNvbHVtbkRyYXdpbmdQb3NpdGlvbiwgY2FuZGxlLCBkaXN0YW5jZUJldHdlZW5DYW5kbGVzLCBncmFwaFdpZHRoLCBjdXJyZW50Q2FuZGxlVG9SZW5kZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnRlcnZhbENhbmRsZURpc3RhbmNlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAvIHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENhbmRsZUlmSW5WaWV3KFxuICAgICAgICB4TWFpbkNvbHVtbkRyYXdpbmdQb3NpdGlvbjogbnVtYmVyLCBcbiAgICAgICAgY2FuZGxlTnVtSW5JbnRlcnZhbDogbnVtYmVyLCBcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlczogbnVtYmVyLCBcbiAgICAgICAgZ3JhcGhXaWR0aDogbnVtYmVyLFxuICAgICAgICBjdXJyZW50Q2FuZGxlVG9SZW5kZXI6IENhbmRsZVBheWxvYWRcbiAgICApOiB2b2lkIHtcbiAgICAgICAgaWYoXG4gICAgICAgICAgICB4TWFpbkNvbHVtbkRyYXdpbmdQb3NpdGlvbiAtIGNhbmRsZU51bUluSW50ZXJ2YWwgKiBkaXN0YW5jZUJldHdlZW5DYW5kbGVzID4gMCAmJiBcbiAgICAgICAgICAgIHhNYWluQ29sdW1uRHJhd2luZ1Bvc2l0aW9uIC0gY2FuZGxlTnVtSW5JbnRlcnZhbCAqIGRpc3RhbmNlQmV0d2VlbkNhbmRsZXMgPCBncmFwaFdpZHRoIC0gdGhpcy5kaW1lbnNpb25zLmdldEhvcml6b250YWxNYXJnaW4oKSArIDEwXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgY2FuZGxlWFJlbmRlclBvc2l0aW9uID0geE1haW5Db2x1bW5EcmF3aW5nUG9zaXRpb24gLSBjYW5kbGVOdW1JbkludGVydmFsICogZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlcztcbiAgICAgICAgICAgIHRoaXMuY2FuZGxlcy5wdXNoKG5ldyBDYW5kbGUoeyB4U3RhcnQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiB9LCB7IHdpZHRoOiB0aGlzLnZpZXcuZ2V0Q29sSW50ZXJ2YWwoKSAvIDEwMCB9LCBjdXJyZW50Q2FuZGxlVG9SZW5kZXIpKTtcblxuICAgICAgICAgICAgY29uc3QgbWFpbkNvbHVtbkRpdmlkZXIgPSB0aGlzLnZpZXcuZ2V0RGl2aWRlcigpO1xuICAgICAgICAgICAgY29uc3QgbWFpbkNvbHVtbkxpbmVJbnRlcnZhbCA9IHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKSAvIG1haW5Db2x1bW5EaXZpZGVyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihjYW5kbGVOdW1JbkludGVydmFsICUgdGhpcy52aWV3LmdldFN1YkNvbFJhdGlvKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YkNvbHVtbkxpbmVzLnB1c2gobmV3IExpbmUoeyB4U3RhcnQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiwgeEVuZDogY2FuZGxlWFJlbmRlclBvc2l0aW9uLCB5U3RhcnQ6IDAsIHlFbmQ6IHRoaXMuZGltZW5zaW9ucy5nZXRIZWlnaHQoKSAtIHRoaXMuZGltZW5zaW9ucy5nZXRWZXJ0aWNhbE1hcmdpbigpIH0sIHsgd2lkdGg6IC4xIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY2FuZGxlTnVtSW5JbnRlcnZhbCAlIG1haW5Db2x1bW5MaW5lSW50ZXJ2YWwgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2x1bW5MaW5lcy5wdXNoKG5ldyBMaW5lKHsgeFN0YXJ0OiBjYW5kbGVYUmVuZGVyUG9zaXRpb24sIHhFbmQ6IGNhbmRsZVhSZW5kZXJQb3NpdGlvbiwgeVN0YXJ0OiAwLCB5RW5kOiB0aGlzLmRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmRpbWVuc2lvbnMuZ2V0VmVydGljYWxNYXJnaW4oKSB9LCB7IHdpZHRoOiAuMyB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFRpbWVTdGFtcHMoeFN0YXJ0OiBudW1iZXIsIGNvbHVtbk9mZnNldDogbnVtYmVyLCBjYW5kbGVzRGF0YTogQ2FuZGxlUGF5bG9hZFtdKTogdm9pZCB7XG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ1Bvc2l0aW9uID0gdGhpcy5kaW1lbnNpb25zLmdldEhlaWdodCgpIC0gdGhpcy5kaW1lbnNpb25zLmdldFZlcnRpY2FsTWFyZ2luKCkgKyAyMztcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKGNhbmRsZXNEYXRhWzBdLnRpbWUpKTtcbiAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSAtIHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKSAqIChjb2x1bW5PZmZzZXQgLSAxKSk7XG4gICAgICAgICAgICB0aGlzLnRleHQucHVzaChuZXcgVGV4dCh7IHhTdGFydDogeFN0YXJ0IC0gMTAsIHlTdGFydDogeURyYXdpbmdQb3NpdGlvbiB9LCB7fSwgYCR7ZGF0ZS5nZXRIb3VycygpfToke2RhdGUuZ2V0TWludXRlcygpfWApKTtcblxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VCZXR3ZWVuQ2FuZGxlID0gdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLyB0aGlzLnZpZXcuZ2V0SW50ZXJ2YWxDYW5kbGVzKCk7XG4gICAgICAgICAgICBsZXQgcHJldlkgPSB4U3RhcnRcblxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZHJhd2luZ1ggPSB4U3RhcnQgLSAxMCAtIChkaXN0YW5jZUJldHdlZW5DYW5kbGUgKyBkaXN0YW5jZUJldHdlZW5DYW5kbGUgKiBpKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZighcHJldlkgfHwgcHJldlkgLSBkcmF3aW5nWCA+IDQwICYmIHhTdGFydCAtIGRyYXdpbmdYIDwgdGhpcy52aWV3LmdldENvbEludGVydmFsKCkgLSAxMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShjYW5kbGVzRGF0YVswXS50aW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSAtIHRoaXMudmlldy5nZXRJbnRlcnZhbENhbmRsZXMoKSAqIChjb2x1bW5PZmZzZXQgLSAxKSAtIGkgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0LnB1c2gobmV3IFRleHQoeyB4U3RhcnQ6IGRyYXdpbmdYLCB5U3RhcnQ6IHlEcmF3aW5nUG9zaXRpb24gfSwge30sIGAke2RhdGUuZ2V0SG91cnMoKX06JHtkYXRlLmdldE1pbnV0ZXMoKX1gKSk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZZID0gZHJhd2luZ1g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSG9yaXpvbnRhbExpbmVzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB7IGhlaWdodCB9ID0gdGhpcy5kaW1lbnNpb25zLmdldERpbWVuc2lvbnMoKTtcbiAgICAgICAgY29uc3QgWyBjdXJyZW50TWF4LCBjdXJyZW50TG93IF0gPSBDYW5kbGUuZ2V0SGlnaExvdygpO1xuXG4gICAgICAgIGxldCBjdXJyZW50WVpvb20gPSAxO1xuXG4gICAgICAgIHdoaWxlKChNYXRoLmZsb29yKGN1cnJlbnRNYXgpIC0gTWF0aC5mbG9vcihjdXJyZW50TG93KSkgLyBjdXJyZW50WVpvb20gPj0gMTApIHtcbiAgICAgICAgICAgIGN1cnJlbnRZWm9vbSA9IGN1cnJlbnRZWm9vbSAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSgoTWF0aC5mbG9vcihjdXJyZW50TWF4KSAtIE1hdGguZmxvb3IoY3VycmVudExvdykpIC8gY3VycmVudFlab29tIDw9IDYpIHtcbiAgICAgICAgICAgIGN1cnJlbnRZWm9vbSA9IGN1cnJlbnRZWm9vbSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGhvcml6b250YWxMaW5lT2Zmc2V0ID0gTWF0aC5mbG9vcihjdXJyZW50TWF4KTsgaG9yaXpvbnRhbExpbmVPZmZzZXQgPj0gY3VycmVudExvdzsgaG9yaXpvbnRhbExpbmVPZmZzZXQgPSBob3Jpem9udGFsTGluZU9mZnNldCAtIC41KSB7XG4gICAgICAgICAgICBpZihob3Jpem9udGFsTGluZU9mZnNldCA8PSBjdXJyZW50TWF4ICYmIGhvcml6b250YWxMaW5lT2Zmc2V0ID49IGN1cnJlbnRMb3cpIHtcblxuICAgICAgICAgICAgICAgIGlmKE51bWJlcihob3Jpem9udGFsTGluZU9mZnNldC50b0ZpeGVkKDIpKSAlIGN1cnJlbnRZWm9vbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0aW9uID0gTWF0aFV0aWxzLmludGVycG9sYXRlKChoZWlnaHQgPz8gMCkgLSB0aGlzLmRpbWVuc2lvbnMuZ2V0VmVydGljYWxNYXJnaW4oKSwgaG9yaXpvbnRhbExpbmVPZmZzZXQsIGN1cnJlbnRMb3csIGN1cnJlbnRNYXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4RW5kID0gdGhpcy5kaW1lbnNpb25zLmdldFdpZHRoKCkgLSA2MDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsTGluZXMucHVzaChuZXcgTGluZSh7IHhTdGFydDogMCwgeEVuZCwgeVN0YXJ0OiBpbnRlcnBvbGF0aW9uLCB5RW5kOiBpbnRlcnBvbGF0aW9uIH0sIHsgd2lkdGg6IC4xIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0LnB1c2gobmV3IFRleHQoeyB4U3RhcnQ6IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpIC0gNTAsIHlTdGFydDogaW50ZXJwb2xhdGlvbiArIDYgfSwge30sIGAke2hvcml6b250YWxMaW5lT2Zmc2V0LnRvRml4ZWQoMil9YCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJMkRDb29yZHMsIElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICB7IHhTdGFydCwgeEVuZCwgeVN0YXJ0LCB5RW5kIH06IEkyRENvb3JkcywgXG4gICAgICAgIHByb3BlcnRpZXM6IElSZW5kZXJQcm9wZXJ0aWVzLFxuICAgICkge1xuICAgICAgICB0aGlzLnhTdGFydCA9IHhTdGFydCA/PyAwO1xuICAgICAgICB0aGlzLnhFbmQgPSB4RW5kID8/IHhTdGFydCA/PyAwO1xuICAgICAgICB0aGlzLnlTdGFydCA9IHlTdGFydCA/PyAwO1xuICAgICAgICB0aGlzLnlFbmQgPSB5RW5kID8/IHlTdGFydCA/PyAwO1xuICAgICAgICB0aGlzLnJlbmRlclByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB4U3RhcnQ6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgeEVuZDogbnVtYmVyO1xuICAgIHByb3RlY3RlZCB5U3RhcnQ6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgeUVuZDogbnVtYmVyO1xuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcztcblxuICAgIHB1YmxpYyBnZXRYU3RhcnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueFN0YXJ0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRYRW5kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnhFbmQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFlTdGFydCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55U3RhcnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFlFbmQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueUVuZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UHJvcGVydGllcygpOiBJUmVuZGVyUHJvcGVydGllcyB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBFbGVtZW50LCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMpOiB2b2lkIHt9O1xufSIsImltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50XCI7XG5pbXBvcnQgeyBJMkRDb29yZHMsIElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcbmltcG9ydCB7IExpbmVSZW5kZXJlciB9IGZyb20gJy4uL3JlbmRlcmVyL2xpbmUtcmVuZGVyZXInO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gXCIuLi9kaW1lbnNpb25zXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lIGV4dGVuZHMgRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoY29vcmRzOiBJMkRDb29yZHMsIHByb3BlcnRpZXM6IElSZW5kZXJQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHN1cGVyKGNvb3JkcywgcHJvcGVydGllcyk7XG5cbiAgICAgICAgTGluZS5pbml0aWFsaXplUmVuZGVyZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZW5kZXJlcjogTGluZVJlbmRlcmVyO1xuXG4gICAgcHVibGljIG92ZXJyaWRlIHJlbmRlcihlbGVtZW50OiBMaW5lLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMpOiB2b2lkIHtcbiAgICAgICAgTGluZS5yZW5kZXJlci5kcmF3KGVsZW1lbnQsIGRpbWVuc2lvbnMsIGNvbnRleHQsIHRoaXMuZ2V0UHJvcGVydGllcygpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgICAgIGlmKCFMaW5lLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICBMaW5lLnJlbmRlcmVyID0gbmV3IExpbmVSZW5kZXJlcigpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IEkyRENvb3JkcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBJUmVuZGVyUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvcmVuZGVyZWxlbWVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBUZXh0UmVuZGVyZXIgfSBmcm9tICcuLi9yZW5kZXJlci90ZXh0LXJlbmRlcmVyJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICcuL2VsZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvb3JkczogSTJEQ29vcmRzLCBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcywgdmFsdWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcihjb29yZHMsIHByb3BlcnRpZXMpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgVGV4dC5pbml0aWFsaXplUmVuZGVyZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZW5kZXJlcjogVGV4dFJlbmRlcmVyO1xuICAgIHByaXZhdGUgdmFsdWU6IHN0cmluZztcblxuICAgIHB1YmxpYyBvdmVycmlkZSByZW5kZXIoZWxlbWVudDogVGV4dCwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkaW1lbnNpb25zOiBEaW1lbnNpb25zKTogdm9pZCB7XG4gICAgICAgIFRleHQucmVuZGVyZXIuZHJhdyhlbGVtZW50LCBkaW1lbnNpb25zLCBjb250ZXh0LCB0aGlzLmdldFByb3BlcnRpZXMoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFZhbHVlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAgICAgaWYoIVRleHQucmVuZGVyZXIpIHtcbiAgICAgICAgICAgIFRleHQucmVuZGVyZXIgPSBuZXcgVGV4dFJlbmRlcmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBEaW1lbnNpb25zO1xuICAgIHByaXZhdGUgdmlldzogVmlldztcblxuICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBtb3VzZURvd24gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBsaXN0ZW4oZXZlbnQ6IENoYXJ0RXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudC5ldmVudE5hbWUsIChjYW52YXNFdmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LmNhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5jYW52YXMsIHRoaXMuZGltZW5zaW9ucywgdGhpcy52aWV3LCBjYW52YXNFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDaGFydEV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ldmVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuL2V2ZW50LW1hbmFnZXInO1xuXG5leHBvcnQgY2xhc3MgTW91c2Vkb3duIGltcGxlbWVudHMgQ2hhcnRFdmVudCB7XG4gICAgZXZlbnROYW1lOiBzdHJpbmcgPSAnbW91c2Vkb3duJztcblxuICAgIHB1YmxpYyBjYWxsYmFjayhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgRXZlbnRNYW5hZ2VyLm1vdXNlRG93biA9IHRydWU7XG4gICAgfVxufSIsImltcG9ydCB7IENoYXJ0RXZlbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2V2ZW50JztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3JztcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gJy4vZXZlbnQtbWFuYWdlcic7XG5cbmV4cG9ydCBjbGFzcyBNb3VzZW1vdmUgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcbiAgICBldmVudE5hbWUgPSAnbW91c2Vtb3ZlJztcblxuICAgIHB1YmxpYyBjYWxsYmFjayhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCB2aWV3OiBWaWV3LCBldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZih2aWV3LmdldFZpZXdPZmZzZXQoKSArIGV2ZW50Lm1vdmVtZW50WCA+IDAgJiYgRXZlbnRNYW5hZ2VyLm1vdXNlRG93bikge1xuICAgICAgICAgICAgdmlldy5zZXRWaWV3T2Zmc2V0KHZpZXcuZ2V0Vmlld09mZnNldCgpICsgZXZlbnQubW92ZW1lbnRYKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDaGFydEV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ldmVudCc7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuL2V2ZW50LW1hbmFnZXInO1xuXG5leHBvcnQgY2xhc3MgTW91c2VvdXQgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcbiAgICBldmVudE5hbWU6IHN0cmluZyA9ICdtb3VzZW91dCc7XG5cbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIEV2ZW50TWFuYWdlci5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL3ZpZXcnO1xuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIE1vdXNldXAgaW1wbGVtZW50cyBDaGFydEV2ZW50IHtcbiAgICBldmVudE5hbWUgPSAnbW91c2V1cCc7XG5cbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIEV2ZW50TWFuYWdlci5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2hhcnRFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXZlbnQnO1xuaW1wb3J0IHsgQW5pbWF0aW9uc01hbmFnZXIgfSBmcm9tICcuLi9hbmltYXRpb25zL2FuaW1hdGlvbnMtbWFuYWdlcic7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSAnLi4vZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldyc7XG5cbmV4cG9ydCBjbGFzcyBXaGVlbCBpbXBsZW1lbnRzIENoYXJ0RXZlbnQge1xuICAgIGV2ZW50TmFtZSA9ICd3aGVlbCc7XG5cbiAgICBwdWJsaWMgY2FsbGJhY2soY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGltZW5zaW9uczogRGltZW5zaW9ucywgdmlldzogVmlldywgd2hlZWxFdmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlbHRhWVZhbHVlID0gKHdoZWVsRXZlbnQuZGVsdGFZID4gMCAmJiB3aGVlbEV2ZW50LmRlbHRhWSAhPT0gMCA/IDEgOiAtMSkgLyAyICogdmlldy5nZXREaXZpZGVyKCk7XG5cbiAgICAgICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgICAgICBvZmZzZXRYOiB3aGVlbEV2ZW50Lm9mZnNldFgsXG4gICAgICAgICAgICBkZWx0YVk6IGRlbHRhWVZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICBBbmltYXRpb25zTWFuYWdlci5zdGFydEFuaW1hdGlvbihcbiAgICAgICAgICAgICd3aGVlbCcsXG4gICAgICAgICAgICA0MDAsXG4gICAgICAgICAgICBbMF0sXG4gICAgICAgICAgICBbZXZlbnQuZGVsdGFZXSxcbiAgICAgICAgICAgIChlYXNlZFZhbHVlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgICAoLWV2ZW50LmRlbHRhWSAmJiB2aWV3Lm1heFpvb21JbigtZXZlbnQuZGVsdGFZKSkgfHwgKC1ldmVudC5kZWx0YVkgJiYgdmlldy5tYXhab29tT3V0KC1ldmVudC5kZWx0YVkpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgWyB3aGVlbFZhbHVlIF0gPSBlYXNlZFZhbHVlczsgXG4gICAgICAgICAgICAgICAgV2hlZWwuY2FsY3VsYXRlKGNhbnZhcywgZGltZW5zaW9ucywgdmlldywgZXZlbnQgYXMgV2hlZWxFdmVudCwgLXdoZWVsVmFsdWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGRpbWVuc2lvbnM6IERpbWVuc2lvbnMsIHZpZXc6IFZpZXcsIGV2ZW50OiBXaGVlbEV2ZW50LCB3aGVlbFZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZ3JhcGhXaWR0aCA9IGRpbWVuc2lvbnMuZ2V0V2lkdGgoKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsU3BlZWQgPSB3aGVlbFZhbHVlO1xuICAgICAgICBjb25zdCB6b29tT2Zmc2V0U3luY1ZhbHVlID0gdGhpcy5jYWxjdWxhdGVPZmZzZXRTeW5jKGdyYXBoV2lkdGgsIGRpbWVuc2lvbnMsIGV2ZW50LCBzY3JvbGxTcGVlZCwgdmlldyk7XG4gICAgICAgIFxuICAgICAgICBpZih6b29tT2Zmc2V0U3luY1ZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVab29tKHNjcm9sbFNwZWVkLCB6b29tT2Zmc2V0U3luY1ZhbHVlLCB2aWV3KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlT2Zmc2V0T3ZlcmZsb3codmlldyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVPZmZzZXRTeW5jKGdyYXBoV2lkdGg6IG51bWJlciwgZGltZW5zaW9uczogRGltZW5zaW9ucywgZXZlbnQ6IFdoZWVsRXZlbnQsIHNjcm9sbFNwZWVkOiBudW1iZXIsIHZpZXc6IFZpZXcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKGdyYXBoV2lkdGggKyB2aWV3LmdldFZpZXdPZmZzZXQoKSAtIGRpbWVuc2lvbnMuZ2V0SG9yaXpvbnRhbE1hcmdpbigpIC0gZXZlbnQub2Zmc2V0WCkgLyB2aWV3LmdldENvbEludGVydmFsKCkgKiBzY3JvbGxTcGVlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBleGVjdXRlWm9vbShzY3JvbGxTcGVlZDogbnVtYmVyLCB6b29tT2Zmc2V0U3luY1ZhbHVlOiBudW1iZXIsIHZpZXc6IFZpZXcpOiB2b2lkIHtcbiAgICAgICAgdmlldy5hZGRDb2xJbnRlcnZhbChzY3JvbGxTcGVlZCk7XG4gICAgICAgIHZpZXcuYWRkVmlld09mZnNldCh6b29tT2Zmc2V0U3luY1ZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB1cGRhdGVPZmZzZXRPdmVyZmxvdyh2aWV3OiBWaWV3KTogdm9pZCB7XG4gICAgICAgIGlmKHZpZXcuZ2V0Vmlld09mZnNldCgpIDw9IDApIHtcbiAgICAgICAgICAgIHZpZXcuc2V0Vmlld09mZnNldCgwKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgTWF0aFV0aWxzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgc3RhdGljIGludGVycG9sYXRlKGNoYXJ0SGVpZ2h0OiBudW1iZXIsIHlUb0RyYXc6IG51bWJlciwgbWF4TG93Q2FuZGxlOiBudW1iZXIsIG1heEhpZ2hDYW5kbGU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGludGVycG9sYXRpb24gPSAoKGNoYXJ0SGVpZ2h0KSAqICh5VG9EcmF3IC0gbWF4TG93Q2FuZGxlKSkgLyAobWF4SGlnaENhbmRsZSAtIG1heExvd0NhbmRsZSk7XG4gICAgICAgIGlmKGludGVycG9sYXRpb24gPiBjaGFydEhlaWdodCAvIDIpIHtcbiAgICAgICAgICAgIGxldCBkaWZmID0gTWF0aC5hYnMoaW50ZXJwb2xhdGlvbiAtIGNoYXJ0SGVpZ2h0IC8gMik7XG4gICAgICAgICAgICByZXR1cm4gY2hhcnRIZWlnaHQgLyAyIC0gZGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0aW9uIDwgY2hhcnRIZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGludGVycG9sYXRpb24gLSBjaGFydEhlaWdodCAvIDIpO1xuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0SGVpZ2h0IC8gMiArIGRpZmY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDYW5kbGUgfSBmcm9tICcuLi9lbGVtZW50cy9jYW5kbGUnO1xuaW1wb3J0IHsgRGltZW5zaW9ucyB9IGZyb20gJy4uL2RpbWVuc2lvbnMnO1xuaW1wb3J0IHsgTWF0aFV0aWxzIH0gZnJvbSAnLi4vbWF0aC11dGlscyc7XG5leHBvcnQgY2xhc3MgQ2FuZGxlUmVuZGVyZXIge1xuICAgIHB1YmxpYyBkcmF3KGNhbmRsZTogQ2FuZGxlLCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgWyBtYXhIaWdoQ2FuZGxlLCBtYXhMb3dDYW5kbGUgXSA9IENhbmRsZS5nZXRIaWdoTG93KCk7IFxuICAgICAgICBjb25zdCBncmFwaEhlaWdodCA9IGRpbWVuc2lvbnMuZ2V0SGVpZ2h0KCkgLSBkaW1lbnNpb25zLmdldFZlcnRpY2FsTWFyZ2luKCk7XG5cbiAgICAgICAgaWYoY2FuZGxlLmdldFhTdGFydCgpIDw9IGRpbWVuc2lvbnMuZ2V0V2lkdGgoKSAtIGRpbWVuc2lvbnMuZ2V0SG9yaXpvbnRhbE1hcmdpbigpICsgMTApIHtcbiAgICAgICAgICAgIGNvbnN0IHlEcmF3aW5nSGlnaCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLnlIaWdoLCBtYXhMb3dDYW5kbGUsIG1heEhpZ2hDYW5kbGUpO1xuICAgICAgICAgICAgY29uc3QgeURyYXdpbmdMb3cgPSBNYXRoVXRpbHMuaW50ZXJwb2xhdGUoZ3JhcGhIZWlnaHQsIGNhbmRsZS55TG93LCBtYXhMb3dDYW5kbGUsIG1heEhpZ2hDYW5kbGUpO1xuICAgIFxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGNhbmRsZS5nZXRYU3RhcnQoKSwgeURyYXdpbmdMb3cpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oY2FuZGxlLmdldFhTdGFydCgpLCB5RHJhd2luZ0hpZ2gpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNhbmRsZS5nZXRDb2xvcigpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuXG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ1N0YXJ0ID0gTWF0aFV0aWxzLmludGVycG9sYXRlKGdyYXBoSGVpZ2h0LCBjYW5kbGUuZ2V0WVN0YXJ0KCksIG1heExvd0NhbmRsZSwgbWF4SGlnaENhbmRsZSk7XG4gICAgICAgICAgICBjb25zdCB5RHJhd2luZ0VuZCA9IE1hdGhVdGlscy5pbnRlcnBvbGF0ZShncmFwaEhlaWdodCwgY2FuZGxlLmdldFlFbmQoKSwgbWF4TG93Q2FuZGxlLCBtYXhIaWdoQ2FuZGxlKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LnJvdW5kUmVjdChjYW5kbGUuZ2V0WFN0YXJ0KCkgLSAoMSAqIChjYW5kbGUud2lkdGggPz8gMCkpIC8gMiwgeURyYXdpbmdFbmQsIDEgKiAoY2FuZGxlLndpZHRoID8/IDApLCB5RHJhd2luZ1N0YXJ0IC0geURyYXdpbmdFbmQsIDEpXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNhbmRsZS5nZXRDb2xvcigpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IElSZW5kZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50JztcbmltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IExpbmUgfSBmcm9tICcuLi9lbGVtZW50cy9saW5lJztcblxuZXhwb3J0IGNsYXNzIExpbmVSZW5kZXJlciB7XG4gICAgcHVibGljIGRyYXcobGluZTogTGluZSwgZGltZW5zaW9uczogRGltZW5zaW9ucywgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcm9wZXJ0aWVzOiBJUmVuZGVyUHJvcGVydGllcyk6IHZvaWQge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhsaW5lLmdldFhTdGFydCgpLCBsaW5lLmdldFlTdGFydCgpKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8obGluZS5nZXRYRW5kKCksIGxpbmUuZ2V0WUVuZCgpKTtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjQTlBOUE5JztcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBwcm9wZXJ0aWVzLndpZHRoID8/IDE7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxufSIsImltcG9ydCB7IERpbWVuc2lvbnMgfSBmcm9tICcuLi9kaW1lbnNpb25zJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICcuLi9lbGVtZW50cy9lbGVtZW50J1xuZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgICAgICBkaW1lbnNpb25zOiBEaW1lbnNpb25zXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBkaW1lbnNpb25zOiBEaW1lbnNpb25zO1xuXG4gICAgcHVibGljIGRyYXcoZWxlbWVudFNldDogU2V0PEVsZW1lbnRbXT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhclZpZXcoKTtcblxuICAgICAgICBlbGVtZW50U2V0LmZvckVhY2gocmVuZGVyRWxlbWVudCA9PiB7XG4gICAgICAgICAgICByZW5kZXJFbGVtZW50LmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKGVsKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclZpZXcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5kaW1lbnNpb25zLmdldFdpZHRoKCksIHRoaXMuZGltZW5zaW9ucy5nZXRIZWlnaHQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXIoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBpZihlbGVtZW50LmdldFhTdGFydCgpIDw9IHRoaXMuZGltZW5zaW9ucy5nZXRXaWR0aCgpKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbmRlcihlbGVtZW50LCB0aGlzLmNvbnRleHQsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgSVJlbmRlclByb3BlcnRpZXMgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9yZW5kZXJlbGVtZW50XCI7XG5pbXBvcnQgeyBEaW1lbnNpb25zIH0gZnJvbSBcIi4uL2RpbWVuc2lvbnNcIjtcbmltcG9ydCB7IFRleHQgfSBmcm9tIFwiLi4vZWxlbWVudHMvdGV4dFwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dFJlbmRlcmVyIHtcbiAgICBwdWJsaWMgZHJhdyh0ZXh0OiBUZXh0LCBkaW1lbnNpb25zOiBEaW1lbnNpb25zLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByb3BlcnRpZXM6IElSZW5kZXJQcm9wZXJ0aWVzKTogdm9pZCB7XG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiOXB4IEJhcmxvd1wiO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjQTlBOUE5JztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LmdldFZhbHVlKCksIHRleHQuZ2V0WFN0YXJ0KCksIHRleHQuZ2V0WVN0YXJ0KCkpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJVmlld0NvbmZpZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvdmlldy5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3Iodmlld0NvbmZpZzogSVZpZXdDb25maWcpIHtcbiAgICAgICAgY29uc3QgeyBcbiAgICAgICAgICAgIGludGVydmFsQ29sSW5pdCwgXG4gICAgICAgICAgICBpbnRlcnZhbENvbFJhdGlvcywgXG4gICAgICAgICAgICB2aWV3T2Zmc2V0LCBcbiAgICAgICAgICAgIGludGVydmFsU3RlcCwgXG4gICAgICAgICAgICBpbnRlcnZhbENhbmRsZXMsXG4gICAgICAgICAgICBpbnRlcnZhbFN1YkNvbFJhdGlvc1xuICAgICAgICB9ID0gdmlld0NvbmZpZztcblxuICAgICAgICB0aGlzLmNvbEludGVydmFsID0gaW50ZXJ2YWxDb2xJbml0O1xuICAgICAgICB0aGlzLnZpZXdPZmZzZXQgPSB2aWV3T2Zmc2V0O1xuICAgICAgICB0aGlzLmNvbEludGVydmFsUmF0aW9zID0gaW50ZXJ2YWxDb2xSYXRpb3M7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWxTdGVwID0gaW50ZXJ2YWxTdGVwO1xuICAgICAgICB0aGlzLmludGVydmFsQ2FuZGxlcyA9IGludGVydmFsQ2FuZGxlcztcbiAgICAgICAgdGhpcy5zdWJDb2xJbnRlcnZhbFJhdGlvcyA9IGludGVydmFsU3ViQ29sUmF0aW9zO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29sSW50ZXJ2YWw6IG51bWJlcjtcbiAgICBwcml2YXRlIHZpZXdPZmZzZXQ6IG51bWJlcjtcbiAgICBwcml2YXRlIGNvbEludGVydmFsUmF0aW9zOiBudW1iZXJbXTtcbiAgICBwcml2YXRlIHN1YkNvbEludGVydmFsUmF0aW9zOiBudW1iZXJbXTtcbiAgICBwcml2YXRlIGludGVydmFsU3RlcDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW50ZXJ2YWxDYW5kbGVzOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgZ2V0SW50ZXJ2YWxDYW5kbGVzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVydmFsQ2FuZGxlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGl2aWRlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coMiwgdGhpcy5pbnRlcnZhbFN0ZXApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdWJDb2xSYXRpbygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJDb2xJbnRlcnZhbFJhdGlvc1t0aGlzLmludGVydmFsU3RlcF07XG4gICAgfVxuXG4gICAgcHVibGljIGFkZENvbEludGVydmFsKHg6IG51bWJlcikge1xuICAgICAgICBpZih0aGlzLm1heFpvb21PdXQoeCkpIHtcbiAgICAgICAgICAgIHRoaXMuY29sSW50ZXJ2YWwgPSB0aGlzLmdldE1pbkNvbEludGVydmFsKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLm1heFpvb21Jbih4KSkge1xuICAgICAgICAgICAgdGhpcy5jb2xJbnRlcnZhbCA9IHRoaXMuZ2V0TWF4Q29sSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29sSW50ZXJ2YWwgKz0geDtcbiAgICAgICAgdGhpcy51cGRhdGVJbnRlcnZhbFN0ZXAoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1pbkNvbEludGVydmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbEludGVydmFsUmF0aW9zWzBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJbnRlcnZhbFN0ZXAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWxTdGVwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TWF4Q29sSW50ZXJ2YWwoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sSW50ZXJ2YWxSYXRpb3NbdGhpcy5jb2xJbnRlcnZhbFJhdGlvcy5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWF4Wm9vbU91dCh4OiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbEludGVydmFsICsgeCA8PSB0aGlzLmdldE1pbkNvbEludGVydmFsKCkgJiYgeCA8PSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXhab29tSW4oeDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xJbnRlcnZhbCArIHggPj0gdGhpcy5nZXRNYXhDb2xJbnRlcnZhbCgpICAmJiB4ID49IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVJbnRlcnZhbFN0ZXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tJZk5leHRTdGVwKCk7XG4gICAgICAgIHRoaXMuY2hlY2tJZlByZXZTdGVwKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0lmTmV4dFN0ZXAoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuaW50ZXJ2YWxTdGVwICE9PSAodGhpcy5jb2xJbnRlcnZhbFJhdGlvcy5sZW5ndGggLSAxKSAmJiB0aGlzLmNvbEludGVydmFsID49IHRoaXMuY29sSW50ZXJ2YWxSYXRpb3NbdGhpcy5pbnRlcnZhbFN0ZXAgKyAxXSkge1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbFN0ZXArKztcbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrSWZQcmV2U3RlcCgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5pbnRlcnZhbFN0ZXAgIT09IDAgJiYgdGhpcy5jb2xJbnRlcnZhbCA8IHRoaXMuY29sSW50ZXJ2YWxSYXRpb3NbdGhpcy5pbnRlcnZhbFN0ZXBdKSB7XG4gICAgICAgICAgICB0aGlzLmludGVydmFsU3RlcC0tO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbEludGVydmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbEludGVydmFsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWaWV3T2Zmc2V0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdPZmZzZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFZpZXdPZmZzZXQoeDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmlld09mZnNldCA9IHg7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFZpZXdPZmZzZXQoeDogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuY29sSW50ZXJ2YWwgIT09IHRoaXMuZ2V0TWluQ29sSW50ZXJ2YWwoKSAmJiB0aGlzLmNvbEludGVydmFsICE9PSB0aGlzLmdldE1heENvbEludGVydmFsKCkpIHtcbiAgICAgICAgICAgIHRoaXMudmlld09mZnNldCArPSB4O1xuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCAqIGZyb20gJy4vY2hhcnQvY2hhcnQnO1xuZXhwb3J0ICogZnJvbSAnLi9jaGFydC9hcGkvYXBpLWNvbnRyb2xsZXInOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==