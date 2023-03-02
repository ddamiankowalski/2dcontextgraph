"use strict";
exports.__esModule = true;
exports.View = void 0;
var View = (function () {
    function View(colIntervalInit) {
        this.scrollSpeed = 25;
        this.colIntervalStep = 1;
        this.colDistThresholds = [300, 600, 1800];
        this.colDistRatio = [1, 2, 4, 12];
        this.candlesInInterval = [60, 30, 15, 5];
        this.colInterval = colIntervalInit;
        this.zoomOutMax = colIntervalInit;
        this.viewOffset = 0;
        this.zoom = .1;
    }
    View.prototype.isZoomOutMax = function () {
        return Math.floor(this.colInterval) <= this.zoomOutMax;
    };
    View.prototype.isZoomInMax = function () {
        return Math.floor(this.colInterval) >= 2000;
    };
    View.prototype.getColInterval = function () {
        return this.colInterval;
    };
    View.prototype.getCandlesInInterval = function () {
        return this.candlesInInterval[this.colIntervalStep - 1];
    };
    View.prototype.getColIntervalStepp = function () {
        return this.colIntervalStep;
    };
    View.prototype.getMainColumnInterval = function () {
        return this.colInterval / this.colDistRatio[this.colIntervalStep - 1];
    };
    View.prototype.getColIntervalStep = function () {
        return this.colDistRatio[this.colIntervalStep - 1];
    };
    View.prototype.addColInterval = function (x) {
        if (this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }
        this.colInterval += x;
        this.updateStep();
    };
    View.prototype.updateStep = function () {
        var _this = this;
        var result = 1;
        this.colDistThresholds.forEach(function (threshold) {
            if (_this.colInterval > threshold) {
                result++;
            }
        });
        this.colIntervalStep = result;
    };
    View.prototype.getViewOffset = function () {
        return this.viewOffset;
    };
    View.prototype.setViewOffset = function (x) {
        this.viewOffset = x;
    };
    View.prototype.addViewOffset = function (x) {
        if (this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }
        this.viewOffset += x;
    };
    View.prototype.getZoom = function () {
        return this.zoom;
    };
    View.prototype.setZoom = function (value) {
        this.zoom = value;
    };
    View.prototype.addZoom = function (value) {
        if (this.maxZoomOut(value)) {
            this.colInterval = 150;
            return;
        }
        this.zoom += value;
    };
    View.prototype.getScrollSpeed = function () {
        return this.scrollSpeed;
    };
    View.prototype.maxZoomOut = function (x) {
        return this.colIntervalStep === 1 && this.colInterval <= 150 && x < 0;
    };
    return View;
}());
exports.View = View;
//# sourceMappingURL=view.js.map