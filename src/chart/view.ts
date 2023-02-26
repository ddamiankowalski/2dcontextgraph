export class View {
    constructor(colIntervalThreshold: number) {
        this.colInterval = colIntervalThreshold;
        this.colIntervalThreshold = colIntervalThreshold;
        this.viewOffset = 0;
        this.zoom = .1;
    }

    private colInterval: number;
    private colIntervalThreshold: number;
    private viewOffset: number;
    private zoom: number;
    private scrollSpeed: number = 25;
    private colIntervalStep: number = 1;

    private colDistRatioConfig: number[] = [2, 2, 3];

    public getColInterval(): number {
        return this.colInterval;
    }

    public getMainColumnInterval(): number {
        return this.colInterval / this.colIntervalStep;
    }

    public getColIntervalStep(): number {
        return this.colIntervalStep;
    }

    public addColInterval(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.colInterval += x;
        console.log(this.colInterval / this.colIntervalThreshold)
        this.colIntervalStep = Math.floor(this.colInterval / this.colIntervalThreshold) || 1;
    }

    public getViewOffset(): number {
        return this.viewOffset;
    }

    public setViewOffset(x: number) {
        this.viewOffset = x;
    }

    public addViewOffset(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.viewOffset += x;
    }

    public getZoom(): number {
        return this.zoom;
    }

    public setZoom(value: number) {
        this.zoom = value;
    }

    public addZoom(value: number) {
        if(this.maxZoomOut(value)) {
            this.colInterval = 150;
            return;
        }

        this.zoom += value;
    }

    public getScrollSpeed(): number {
        return this.scrollSpeed;
    }

    private maxZoomOut(x: number): boolean {
        return this.colIntervalStep === 1 && this.colInterval <= 150 && x < 0;
    }
}