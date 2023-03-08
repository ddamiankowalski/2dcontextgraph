import { ChartManager } from './chart-manager';
import { CandlePayload } from '../interfaces/candlestick';
import { ChartAPIController } from './api/api-controller';
import { View } from './view';
import { Dimensions } from './dimensions';

export class Chart {
    constructor(canvas: HTMLCanvasElement) {
        this.fetchCandles('http://localhost:3000/candles')
            .then(res => res.json())
            .then(candles => this.initChart(candles, canvas))
    }

    private canvas!: HTMLCanvasElement;
    private chartManager!: ChartManager;
    private context!: CanvasRenderingContext2D | null;

    private initChart(candles: CandlePayload[], canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.context = this.getRenderingContext();

        if(this.context) {
            this.chartManager = new ChartManager(this.context, this.canvas, candles.reverse());
        }
    }

    private getRenderingContext(): CanvasRenderingContext2D | null {
        return this.canvas.getContext('2d');
    }

    private fetchCandles(endpoint: string): Promise<Response> {
        return fetch(endpoint);
    }

    public getApiController(): ChartAPIController {
        return this.chartManager.createApiController();
    }

    public getManger(): ChartManager {
        return this.chartManager;
    }

    public getView(): View {
        console.log(this.chartManager.getView())
        return this.chartManager.getView();
    }

    public getDimensions(): Dimensions {
        return this.chartManager.getDimensions();
    }
}