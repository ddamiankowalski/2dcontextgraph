import { Candlestick } from '../interfaces/candlestick';
export class Candle {
    constructor(xPosition: number, candle: Candlestick, zoom: number) {
        this.setCurrentHighLow(candle);
        this.zoom = zoom;
        this.yStart = candle.high;
        this.yEnd = candle.low;
        this.xPosition = xPosition;
    }

    private static currentMaxHigh?: number;
    private static currentMaxLow?: number;
    
    public zoom: number;
    public yStart: number;
    public yEnd: number;
    public xPosition: number;

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