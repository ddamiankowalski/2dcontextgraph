import { Candlestick } from "../interfaces/candlestick";

export class ChartPosition {
    constructor(initialColsDist: number, maxColsDistance: number) {
        this._colsDistance = initialColsDist;
        this._maxColsDistance = maxColsDistance;
        this._viewOffset = 0;
    }

    private _colsDistance: number;
    private _maxColsDistance: number;
    private _viewOffset;

    get colsDistance(): number {
        return this._colsDistance;
    }

    set colsDistance(value: number) {
        this._colsDistance = value;
    }

    get maxColsDistance(): number {
        return this._maxColsDistance;
    }

    set maxColsDistance(value: number) {
        this._maxColsDistance = value;
    }

    get viewOffset(): number {
        return this._viewOffset;
    }

    set viewOffset(value: number) {
        this._viewOffset = value;
    }
}