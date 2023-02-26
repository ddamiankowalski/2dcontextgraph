export class View {
    constructor(colIntervalThreshold: number) {
        this.colInterval = colIntervalThreshold;
        this.viewOffset = 0;
        this.zoom = .1;
    }

    private colInterval: number;
    private viewOffset: number;
    private zoom: number;
    private scrollSpeed: number = 25;
    private colIntervalStep: number = 1;

    private colDistThresholds: number[] = [300, 600, 3000];
    private colDistRatio: number[] = [1, 2, 4];

    public getColInterval(): number {
        return this.colInterval;
    }

    public getMainColumnInterval(): number {
        return this.colInterval / this.colDistRatio[this.colIntervalStep - 1];
    }

    public getColIntervalStep(): number {
        console.log(this.colIntervalStep)
        return this.colDistRatio[this.colIntervalStep];
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