import { ChartManager } from './chart-manager';
import { CandlePayload } from '../interfaces/candlestick';

export class Chart {
    constructor(document: Document, chartId: string) {
        this.document = document;
        this.fetchCandles('http://localhost:3000/candles')
            .then(res => res.json())
            .then(candles => this.initChart(candles, chartId));
    }

    private canvas!: HTMLCanvasElement;
    private document: Document;
    private canvasManager!: ChartManager;
    private context!: CanvasRenderingContext2D | null;

    private initChart(candles: CandlePayload[], chartId: string): void {
        this.canvas = this.getHTMLCanvas(chartId);
        this.context = this.getRenderingContext();

        if(this.context) {
            this.canvasManager = new ChartManager(this.context, this.canvas, candles.reverse());
        }
    }

    private getHTMLCanvas(chartId: string): HTMLCanvasElement {
        return this.document.getElementById(chartId) as HTMLCanvasElement;
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
}