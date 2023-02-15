export class ChartLine {
    constructor(columnOffset: number, xPosition: number, context: CanvasRenderingContext2D) {
        this.columnOffset = columnOffset;
        this.xPosition = xPosition;

        this.renderCandle(context, xPosition);
    }

    private columnOffset: number;
    private xPosition: number;

    private renderCandle(context: CanvasRenderingContext2D, xPosition: number): void {
        context.beginPath();
        context.moveTo(xPosition, 0);
        context.lineTo(xPosition, 20);
        context.strokeStyle = '#ff0000';
        context.lineWidth = 4;
        context.stroke();
    }
    
    public getColumnOffset(): number {
        return this.columnOffset;
    }

    public getXPosition(): number {
        return this.xPosition;
    }
}