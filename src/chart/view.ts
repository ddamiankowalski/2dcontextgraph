export class View {
    constructor(colIntervalInit: number) {
        this.colInterval = colIntervalInit;
        this.zoomOutMax = colIntervalInit;
        this.viewOffset = 0;
        this.zoom = .1;
    }

    private colInterval: number;
    private viewOffset: number;
    private zoom: number;
    private scrollSpeed: number = 25;
    private colIntervalStep: number = 1;
    private zoomOutMax: number;

    private colDistThresholds: number[] = [300, 600, 1800];
    private colDistRatio: number[] = [1, 2, 4, 12];
    private candlesInInterval: number[] = [ 60, 30, 15, 5 ];

    public isZoomOutMax(): boolean {
        return Math.floor(this.colInterval) <= this.zoomOutMax;
    }

    public isZoomInMax(): boolean {
        return Math.floor(this.colInterval) >= 2000;
    }

    public getColInterval(): number {
        return this.colInterval;
    }

    public getCandlesInInterval(): number {
        return this.candlesInInterval[this.colIntervalStep - 1];
    }

    public getColIntervalStepp(): number {
        return this.colIntervalStep;
    }

    public getMainColumnInterval(): number {
        return this.colInterval / this.colDistRatio[this.colIntervalStep - 1];
    }

    public getColIntervalStep(): number {
        return this.colDistRatio[this.colIntervalStep - 1];
    }

    public addColInterval(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.colInterval += x;
        this.updateStep();
    }

    private updateStep(): void {
        let result = 1;
        this.colDistThresholds.forEach(threshold => {
            if(this.colInterval > threshold) {
                result++;
            }  
        })

        this.colIntervalStep = result;
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