import { Candlestick } from '../../interfaces/candlestick';
import { RenderElement } from './render-element';
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';

export class Candle extends RenderElement {
    constructor(coords: I2DCoords, properties: IRenderProperties, candle: Candlestick, zoom: number) {
        super(coords, properties);
        this.setCurrentHighLow(candle);

        this.zoom = zoom;
        this.yEnd = candle.open;
        this.yStart = candle.close;
        this.yHigh = candle.high;
        this.yLow = candle.low;
        this.time = candle.time;
    }

    private static currentMaxHigh?: number;
    private static currentMaxLow?: number;
    
    public zoom: number;
    public yHigh: number;
    public yLow: number;
    private time: string;

    public getCandleTime(): string {
        return this.time;
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