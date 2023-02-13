import { GraphDimensions } from '../interfaces/dimensions';

export class CanvasDimensions {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setCanvasStyleWidthAndHeight();
        this.setDimensions();
    }

    private canvas: HTMLCanvasElement;
    private dimensions: GraphDimensions = {};

    private setCanvasStyleWidthAndHeight(width: number = 850, height: number = 450): void {
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    private setDimensions(): void {
        this.dimensions.height = this.canvas.offsetHeight;
        this.dimensions.width = this.canvas.offsetWidth;
    }
}