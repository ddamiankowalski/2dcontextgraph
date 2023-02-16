export class Candle {
    constructor(xPosition: number, zoom: number, context: CanvasRenderingContext2D) {
        this.xPosition = xPosition;
        this.zoom = zoom;

        this.renderCandle(context, xPosition);
    }

    private static columnOffset: number = 0;
    private xPosition: number;
    private zoom: number;

    private renderCandle(context: CanvasRenderingContext2D, xPosition: number): void {
        context.beginPath();

        context.moveTo(xPosition, 99);
        context.lineTo(xPosition, 121);
        context.strokeStyle = '#00ff00';
        context.lineWidth = 1 * this.zoom + 1;
        context.stroke();

        context.beginPath();

        context.moveTo(xPosition, 100);
        context.lineTo(xPosition, 120);
        context.strokeStyle = '#ff0000';
        context.lineWidth = 1 * this.zoom;
        context.stroke();
    }

    public static incrementColumnOffset(): void {
        Candle.columnOffset++;
    }
    
    public static getColumnOffset(): number {
        return this.columnOffset;
    }

    public getXPosition(): number {
        return this.xPosition;
    }
}