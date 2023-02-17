import { Candlestick } from './candlestick';
export abstract class Renderer {
    abstract draw(candlesData: Candlestick[]): void;
    abstract drawGrid(ccandlesData: Candlestick[]): void;
    abstract drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void;
}