export class ChartLine {
    constructor(time: number, xPosition: number) {
        this.time = time;
        this.xPosition = xPosition;
    }

    private time: number;
    private xPosition: number;

    public getTime(): number {
        return this.time;
    }

    public getXPosition(): number {
        return this.xPosition;
    }
}