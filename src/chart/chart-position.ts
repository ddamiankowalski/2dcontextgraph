export class ChartPosition {
    constructor(initialColsDist: number, maxColsDistance: number, zoom: number) {
        this._colsDistance = initialColsDist;
        this._maxColsDistance = maxColsDistance;
        this._viewOffset = 0;
        this._zoom = zoom;
    }

    private _colsDistance: number;
    private _maxColsDistance: number;
    private _viewOffset: number;
    private _zoom: number;

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

    get zoom(): number {
        return this._zoom;
    }

    set zoom(value: number) {
        this._zoom = value;
    }
}