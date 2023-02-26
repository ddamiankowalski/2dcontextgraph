export class View {
    constructor(maxColInterval: number) {
        this.colInterval = maxColInterval - 20;
        this.maxColInterval = maxColInterval;
        this.viewOffset = 0;
        this.zoom = .1;
    }

    private colInterval: number;
    private maxColInterval: number;
    private minColInterval: number = 0;
    private viewOffset: number;
    private zoom: number;
    private scrollSpeed: number = 25;
    private colIntervalStep: number = 0;

    public getColInterval(): number {
        return this.colInterval;
    }

    public addColInterval(x: number) {
        this.colInterval += x;

        // if(x < 0 && Math.round(this.colInterval) < this.maxColInterval) {
        //     this.colIntervalStep--;
        // } else if(x > 0 && Math.round(this.colInterval) > this.maxColInterval) {
        //     this.colIntervalStep++;
        // }

        console.log(this.colIntervalStep);
    }

    public getMaxColInterval(): number {
        return this.maxColInterval;
    }

    public setMaxColInterval(x: number) {
        this.maxColInterval = x;
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