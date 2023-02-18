import { Candlestick } from '../interfaces/candlestick';
export class Candle {
    constructor(xPosition: number, candle: Candlestick, zoom: number, context: CanvasRenderingContext2D) {
        this.zoom = zoom;

        this.setCurrentHighLow(candle);

        this.yStart = 630;
        this.yEnd = 50;
        // this.yStart = 40;
        // this.yEnd = 200;

        this.renderCandle(context, xPosition);
    }

    private static currentMaxHigh?: number;
    private static currentMaxLow?: number;
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

    private setCurrentHighLow(candle: Candlestick): void {
        if(!Candle.currentMaxHigh || candle.high > Candle.currentMaxHigh) {
            Candle.currentMaxHigh = candle.high;
        }

        if(!Candle.currentMaxLow || candle.low < Candle.currentMaxLow) {
            Candle.currentMaxLow = candle.low;
        }
    }

    public static resetHighLow(): void {
        Candle.currentMaxHigh = undefined;
        Candle.currentMaxLow = undefined;
    }

    public static getHighLow(): Array<number> {
        return [ Candle.currentMaxHigh, Candle.currentMaxLow ];
    }
}