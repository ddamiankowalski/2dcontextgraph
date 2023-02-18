import { Renderer } from '../interfaces/renderer';
import { ChartRenderer } from './chart-renderer';
import { Candlestick } from '../interfaces/candlestick';

export class Chart {
    constructor(document: Document, chartId: string) {
        this.chartId = chartId;
        fetch('http://localhost:3000/candles')
            .then(res => res.json())
            .then(candles => this.intitializeChart(document, candles));
    }

    private canvas: HTMLCanvasElement | undefined;
    private renderer: Renderer;
    private canvasContext: RenderingContext;
    private chartId: string;

    private intitializeChart(document: Document, candles: Candlestick[]): void {
        this.canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');
        this.renderer = new ChartRenderer(this.canvasContext, this.canvas);
        this.renderer.draw(candles.reverse());
    }
}