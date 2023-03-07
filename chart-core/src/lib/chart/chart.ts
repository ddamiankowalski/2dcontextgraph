import { ChartManager } from './chart-manager';
import { CandlePayload } from '../interfaces/candlestick';
import { ChartAPIController } from './api/api-controller';

export class Chart {
    constructor(canvas: HTMLCanvasElement) {
        this.fetchCandles('http://localhost:3000/candles')
            .then(res => res.json())
            .then(candles => this.initChart(candles, canvas));
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
        if(window.HTMLCanvasElement) {
            return this.canvas.getContext('2d');
        }
        throw new Error('Canvas is not supported');
    }

    private fetchCandles(endpoint: string): Promise<Response> {
        return fetch(endpoint);
    }

    public getApiController(): ChartAPIController {
        return this.chartManager.createApiController();
    }
}