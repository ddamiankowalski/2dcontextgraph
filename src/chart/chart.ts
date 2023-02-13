import { Renderer } from '../interfaces/renderer';
import { ChartRenderer } from './chart-renderer';

export class Chart {
    constructor(document: Document) {
        this.intitializeChart(document);
    }

    private canvas: HTMLCanvasElement | undefined;
    private renderer: Renderer;
    private canvasContext: RenderingContext;

    private intitializeChart(document: Document): void {
        this.canvas = document.getElementById('chart') as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');
        this.renderer = new ChartRenderer(this.canvasContext, this.canvas);
        this.renderer.draw();
    }
}