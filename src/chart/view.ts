export class View {
    constructor(colIntervalInit: number) {
        View.colInterval = colIntervalInit;
        View.zoomOutMax = colIntervalInit;
        View.viewOffset = 0;
        View.zoom = .1;
    }

    private static colInterval: number;
    private static viewOffset: number;
    private static zoom: number;
    private static scrollSpeed: number = 25;
    private static colIntervalStep: number = 1;
    private static zoomOutMax: number;

    private static colDistThresholds: number[] = [300, 600, 1800];
    private static colDistRatio: number[] = [1, 2, 4, 12];
    private static candlesInInterval: number[] = [ 60, 30, 15, 5 ];

    public static isZoomOutMax(): boolean {
        return Math.floor(this.colInterval) <= this.zoomOutMax;
    }

    public static isZoomInMax(): boolean {
        return Math.floor(this.colInterval) >= 2000;
    }

    public static getColInterval(): number {
        return this.colInterval;
    }

    public static getCandlesInInterval(): number {
        return this.candlesInInterval[this.colIntervalStep - 1];
    }

    public static getColIntervalStep(): number {
        return this.colIntervalStep;
    }

    public static getMainColumnInterval(): number {
        return this.colInterval / this.colDistRatio[this.colIntervalStep - 1];
    }

    public static addColInterval(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.colInterval += x;
        this.updateStep();
    }

    private static updateStep(): void {
        let result = 1;
        this.colDistThresholds.forEach(threshold => {
            if(this.colInterval > threshold) {
                result++;
            }  
        })

        this.colIntervalStep = result;
    }

    public static getViewOffset(): number {
        return this.viewOffset;
    }

    public static setViewOffset(x: number) {
        this.viewOffset = x;
    }

    public static addViewOffset(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.viewOffset += x;
    }

    public static getZoom(): number {
        return this.zoom;
    }

    public static setZoom(value: number) {
        this.zoom = value;
    }

    public static addZoom(value: number) {
        if(this.maxZoomOut(value)) {
            this.colInterval = 150;
            return;
        }

        this.zoom += value;
    }

    public static getScrollSpeed(): number {
        return this.scrollSpeed;
    }

    private static maxZoomOut(x: number): boolean {
        return this.colIntervalStep === 1 && this.colInterval <= 150 && x < 0;
    }
}