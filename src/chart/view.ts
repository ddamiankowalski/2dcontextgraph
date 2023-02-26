export class View {
    constructor(colIntervalThreshold: number) {
        this.colInterval = colIntervalThreshold - 20;
        this.colIntervalThreshold = colIntervalThreshold;
        this.viewOffset = 0;
        this.zoom = .1;
    }

    private colInterval: number;
    private colIntervalThreshold: number;
    private viewOffset: number;
    private zoom: number;
    private scrollSpeed: number = 25;
    private colIntervalStep: number = 0;

    public getColInterval(): number {
        return this.colInterval;
    }

    public addColInterval(x: number) {
        this.colInterval += x;

        console.log(this.colIntervalStep);
    }

    public getViewOffset(): number {
        return this.viewOffset;
    }

    public setViewOffset(x: number) {
        this.viewOffset = x;
    }

    public addViewOffset(x: number) {
        this.viewOffset += x;
    }

    public getZoom(): number {
        return this.zoom;
    }

    public setZoom(value: number) {
        this.zoom = value;
    }

    public addZoom(value: number) {
        this.zoom += value;
    }

    public getScrollSpeed(): number {
        return this.scrollSpeed;
    }
}