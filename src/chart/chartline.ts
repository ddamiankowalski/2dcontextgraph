export class ChartLine {
    constructor(columnOffset: number, xPosition: number) {
        this.columnOffset = columnOffset;
        this.xPosition = xPosition;
    }

    private columnOffset: number;
    private xPosition: number;

    public getColumnOffset(): number {
        return this.columnOffset;
    }

    public getXPosition(): number {
        return this.xPosition;
    }
}