import { ChartManager } from './chart-manager';
import { Candlestick } from '../interfaces/candlestick';

export class Chart {
    constructor(document: Document, chartId: string) {
        this.chartId = chartId;
        fetch('http://localhost:3000/candles')
            .then(res => res.json())
            .then(candles => this.intitializeChart(document, candles));
    }

    private canvas: HTMLCanvasElement | undefined;
    private canvasManager: ChartManager;
    private canvasContext: RenderingContext;
    private chartId: string;

    private intitializeChart(document: Document, candles: Candlestick[]): void {
        this.canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasManager = new ChartManager(this.canvasContext, this.canvas, candles.reverse());
        this.canvasManager.draw();
    }
}