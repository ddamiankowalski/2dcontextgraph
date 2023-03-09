import { Dimensions } from '../dimensions';
import { View } from '../view';
import { CandlePayload } from '../../interfaces/candlestick';
import { Candle } from './candle';
import { Element } from './element';
export declare class ElementCollector {
    constructor(dimensions: Dimensions, view: View, candleData: CandlePayload[]);
    private renderingElementsSet;
    private dimensions;
    private view;
    private candleData;
    private candles;
    private mainColumnLines;
    private subColumnLines;
    private text;
    private horizontalLines;
    getElements(): Set<Element[]>;
    resetElements(): void;
    getCandles(): Candle[];
    setElements(): void;
    private addCandlesInInterval;
    private getIntervalCandleDistance;
    private addCandleIfInView;
    private addTimeStamps;
    private addHorizontalLines;
}
