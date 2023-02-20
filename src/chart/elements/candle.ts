import { Candlestick } from '../../interfaces/candlestick';
import { Element } from './element';
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { CandleRenderer } from '../renderer/candle-renderer';
import { ChartDimensions } from '../chart-dimensions';

export class Candle extends Element {
    constructor(
        coords: I2DCoords, 
        properties: IRenderProperties, 
        candle: Candlestick, 
        zoom: number
    ) {
        super(coords, properties);
        this.setCurrentHighLow(candle);
        Candle.initializeRenderer();

        this.zoom = zoom;
        this.yEnd = candle.open;
        this.yStart = candle.close;
        this.yHigh = candle.high;
        this.yLow = candle.low;
        this.time = candle.time;
    }

    private static renderer: CandleRenderer;

    private static currentMaxHigh?: number;
    private static currentMaxLow?: number;

    private static maxHigh: number;
    private static maxLow: number;
    
    public zoom: number;
    public yHigh: number;
    public yLow: number;
    private time: string;

    public render(element: Candle, context: CanvasRenderingContext2D, dimensions: ChartDimensions): void {
        Candle.renderer.draw(element, dimensions, context);
    }

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

    public static findMaxLowInData(candlesData: Candlestick[]): void {
        candlesData.forEach(candle => {
            if(!this.maxHigh || candle.high > this.maxHigh) {
                this.maxHigh = candle.high;
            }

            if(!this.maxLow || candle.low < this.maxLow) {
                this.maxLow = candle.low;
            }
        })

        console.log(this.maxLow, this.maxHigh, 'Max low and max high values');
    }

    public static getMaxLowInData(): number[] {
        return [ this.maxHigh, this.maxLow ];
    }

    public static resetHighLow(): void {
        Candle.currentMaxHigh = undefined;
        Candle.currentMaxLow = undefined;
    }

    public static getHighLow(): Array<number> {
        return [ Candle.currentMaxHigh, Candle.currentMaxLow ];
    }

    public static getHigh(): number {
        return Candle.currentMaxHigh;
    }

    public static getLow(): number {
        return Candle.currentMaxLow;
    }

    private static initializeRenderer(): void {
        if(!Candle.renderer) {
            Candle.renderer = new CandleRenderer();
        }
    }
}