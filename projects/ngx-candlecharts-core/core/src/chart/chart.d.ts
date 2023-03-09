import { ChartAPIController } from './api/api-controller';
export declare class Chart {
    constructor(canvas: HTMLCanvasElement);
    private canvas;
    private chartManager;
    private context;
    private initChart;
    private getRenderingContext;
    private fetchCandles;
    getApiController(): ChartAPIController;
}
