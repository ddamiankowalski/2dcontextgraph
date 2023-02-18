import { Candlestick } from '../interfaces/candlestick';
export class Candle {
    constructor(xPosition: number, candle: Candlestick, zoom: number, currentMaxAndLow: Array<number>, context: CanvasRenderingContext2D) {
        this.xPosition = xPosition;
        this.zoom = zoom;

        const [ max, low ] = currentMaxAndLow;
        const currentCandleMax = candle?.high;
        const currentCandleLow = candle?.low;


        const yDrawingStart = currentCandleMax / max * 680;
        const yDrawingEnd = currentCandleLow / low * 680;

        debugger

        this.yStart = yDrawingStart - 630;
        this.yEnd = yDrawingEnd - 50;
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