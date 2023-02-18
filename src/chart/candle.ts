import { Candlestick } from '../interfaces/candlestick';
export class Candle {
    constructor(xPosition: number, candle: Candlestick, zoom: number) {
        this.setCurrentHighLow(candle);
        this.zoom = zoom;
        this.yStart = candle.close;
        this.yEnd = candle.open;
        this.yHigh = candle.high;
        this.yLow = candle.low;
        this.time = candle.time;
        this.xPosition = xPosition;
    }

    private static currentMaxHigh?: number;
    private static currentMaxLow?: number;
    
    public zoom: number;
    public yStart: number;
    public yEnd: number;
    public yHigh: number;
    public yLow: number;
    private time: string;
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