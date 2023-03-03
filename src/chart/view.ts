export class View {
    constructor(colIntervalInit: number) {
        this.colInterval = colIntervalInit;
        this.minColInterval = colIntervalInit;
        this.maxColInterval = colIntervalInit;
        this.viewOffset = 0;
    }

    private colInterval: number;
    private viewOffset: number;
    private minColInterval: number;
    private maxColInterval: number;

    private colDistThresholds: number[] = [300, 600, 1800];
    private colDistRatio: number[] = [1, 2, 4, 12];
    private candlesInInterval: number[] = [60, 30, 15, 5];

    public addColInterval(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = this.minColInterval;
            return;
        }
        this.colInterval += x;
    }

    private maxZoomOut(x: number): boolean {
        return this.colInterval + x <= this.minColInterval && x < 0;
    }

    public isZoomOutMax(): boolean {
        return Math.floor(this.colInterval) <= this.minColInterval;
    }

    public isZoomInMax(): boolean {
        return Math.floor(this.colInterval) >= 2000;
    }

    public getColInterval(): number {
        return this.colInterval;
    }

    public getCandlesInInterval(): number {
        return 1
    }

    public getColIntervalStep(): number {
        return 1
    }

    public getMainColumnInterval(): number {
        return 1
    }

    // private updateStep(): void {
    //     let result = 1;
    //     this.colDistThresholds.forEach(threshold => {
    //         if(this.colInterval > threshold) {
    //             result++;
    //         }  
    //     })

    //     this.colIntervalStep = result;
    // }

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
        return 1;
        //return this.zoom;
    }

    public setZoom(value: number) {
        //this.zoom = value;
    }

    public addZoom(value: number) {
        if(this.maxZoomOut(value)) {
            this.colInterval = 150;
            return;
        }

        //this.zoom += value;
    }
}