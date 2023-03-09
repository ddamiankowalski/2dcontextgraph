import { CandlePayload } from '../../interfaces/candlestick';
import { Element } from './element';
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';
export declare class Candle extends Element {
    constructor(coords: I2DCoords, properties: IRenderProperties, candle: CandlePayload);
    private static renderer;
    private static currentMaxHigh?;
    private static currentMaxLow?;
    private static maxHigh;
    private static maxLow;
    private color;
    width?: number;
    yHigh: number;
    yLow: number;
    private time;
    render(element: Candle, context: CanvasRenderingContext2D, dimensions: Dimensions): void;
    getCandleTime(): string;
    private setColor;
    getColor(): string;
    private setCurrentHighLow;
    static findMaxLowInData(candlesData: CandlePayload[]): void;
    static getMaxLowInData(): number[];
    static resetHighLow(): void;
    static getHighLow(): Array<number>;
    static getHigh(): number;
    static getLow(): number;
    private static initializeRenderer;
}
