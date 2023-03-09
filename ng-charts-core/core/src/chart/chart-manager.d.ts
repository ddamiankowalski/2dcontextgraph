import { CandlePayload } from '../interfaces/candlestick';
import { ChartAPIController } from './api/api-controller';
export declare class ChartManager {
    apiController: ChartAPIController;
    private context;
    private canvas;
    private dimensions;
    private view;
    private renderer;
    private eventManager;
    private candles;
    private lastRender;
    private animations;
    private elementCollector;
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, candles: CandlePayload[]);
    createApiController(): ChartAPIController;
    private setCanvasDimensions;
    private setView;
    private setRenderer;
    private setCandles;
    private addCanvasListeners;
    private requestNextFrame;
    private getRenderingElements;
    private renderElements;
}
