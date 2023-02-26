import { CandlePayload } from '../../interfaces/candlestick';
import { Element } from './element';
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { CandleRenderer } from '../renderer/candle-renderer';
import { Dimensions } from '../dimensions';

export class Candle extends Element {
    constructor(
        coords: I2DCoords, 
        properties: IRenderProperties, 
        candle: CandlePayload, 
        zoom: number
    ) {
        super(coords, properties);
        this.setCurrentHighLow(candle);
        Candle.initializeRenderer();
        this.setColor(candle);

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

    private color?: string;
    
    public zoom: number;
    public yHigh: number;
    public yLow: number;
    private time: string;

    public render(element: Candle, context: CanvasRenderingContext2D, dimensions: Dimensions): void {
        Candle.renderer.draw(element, dimensions, context);
    }

    public getCandleTime(): string {
        return this.time;
    }

    private setColor(candle: CandlePayload): void {
        this.color = candle.open > candle.close ? '#56b786' : '#eb4e5c';
    }

    public getColor(): string {
        return this.color;
    }

    private setCurrentHighLow(candle: CandlePayload): void {
        if(!Candle.currentMaxHigh || candle.high > Candle.currentMaxHigh) {
            Candle.currentMaxHigh = candle.high;
        }

        if(!Candle.currentMaxLow || candle.low < Candle.currentMaxLow) {
            Candle.currentMaxLow = candle.low;
        }
    }

    public static findMaxLowInData(candlesData: CandlePayload[]): void {
        candlesData.forEach(candle => {
            if(!this.maxHigh || candle.high > this.maxHigh) {
                this.maxHigh = candle.high;
            }

            if(!this.maxLow || candle.low < this.maxLow) {
                this.maxLow = candle.low;
            }
        })
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