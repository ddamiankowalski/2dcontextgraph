"use strict";
exports.__esModule = true;
exports.View = void 0;
var View = (function () {
    function View(colIntervalInit) {
        View.colInterval = colIntervalInit;
        View.minColInterval = colIntervalInit;
        View.viewOffset = 0;
        View.zoom = .1;
        View.colIntervalStep = 1;
    }
    View.isZoomOutMax = function () {
        return Math.floor(this.colInterval) <= this.minColInterval;
    };
    View.isZoomInMax = function () {
        return Math.floor(this.colInterval) >= 2000;
    };
    View.getColInterval = function () {
        return this.colInterval;
    };
    View.getCandlesInInterval = function () {
        return this.candlesInInterval[this.colIntervalStep - 1];
    };
    View.getColIntervalStep = function () {
        return this.colIntervalStep;
    };
    View.getMainColumnInterval = function () {
        return this.colInterval / this.colDistRatio[this.colIntervalStep - 1];
    };
    View.addColInterval = function (x) {
        if (this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }
        this.colInterval += x;
        this.updateStep();
    };
    View.updateStep = function () {
        var _this = this;
        var result = 1;
        this.colDistThresholds.forEach(function (threshold) {
            if (_this.colInterval > threshold) {
                result++;
            }
        });
        this.colIntervalStep = result;
    };
    View.getViewOffset = function () {
        return this.viewOffset;
    };
    View.setViewOffset = function (x) {
        this.viewOffset = x;
    };
    View.addViewOffset = function (x) {
        if (this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }
        this.viewOffset += x;
    };
    View.getZoom = function () {
        return this.zoom;
    };
    View.setZoom = function (value) {
        this.zoom = value;
    };
    View.addZoom = function (value) {
        if (this.maxZoomOut(value)) {
            this.colInterval = 150;
            return;
        }
        this.zoom += value;
    };
    View.maxZoomOut = function (x) {
        return this.colIntervalStep === 1 && this.colInterval <= 150 && x < 0;
    };
    View.colDistThresholds = [300, 600, 1800];
    View.colDistRatio = [1, 2, 4, 12];
    View.candlesInInterval = [60, 30, 15, 5];
    return View;
}());
exports.View = View;
//# sourceMappingURL=view.js.map