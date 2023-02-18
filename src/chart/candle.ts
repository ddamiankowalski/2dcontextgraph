import { Candlestick } from '../interfaces/candlestick';
export class Candle {
    constructor(xPosition: number, candle: Candlestick, zoom: number, currentMaxAndLow: Array<number>, context: CanvasRenderingContext2D) {
        this.xPosition = xPosition;
        this.zoom = zoom;

        const [ max, low ] = currentMaxAndLow;
        const currentCandleMax = candle?.high;
        const currentCandleLow = candle?.low;
        debugger
        this.yStart = (candle?.high - 1800) * 5;
        this.yEnd = (candle?.low - 1800) * 15;
        // this.yStart = 40;
        // this.yEnd = 200;

        this.renderCandle(context, xPosition);
    }

    private static columnOffset: number = 0;
    private xPosition: number;
    private zoom: number;

    private yStart: number;
    private yEnd: number;

    private renderCandle(context: CanvasRenderingContext2D, xPosition: number): void {
        context.beginPath();

        context.moveTo(xPosition, this.yStart);
        context.lineTo(xPosition, this.yEnd);
        context.strokeStyle = '#00ff00';
        context.lineWidth = 1 * this.zoom + 1;
        context.stroke();

        context.beginPath();

        context.moveTo(xPosition, this.yStart + 1);
        context.lineTo(xPosition, this.yEnd - 1);
        context.strokeStyle = '#ff0000';
        context.lineWidth = 1 * this.zoom;
        context.stroke();
    }
    
    public static getColumnOffset(): number {
        return this.columnOffset;
    }

    public getXPosition(): number {
        return this.xPosition;
    }
}