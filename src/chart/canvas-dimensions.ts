import { GraphDimensions } from '../interfaces/dimensions';

export class CanvasDimensions {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setDimensions();
    }

    private canvas: HTMLCanvasElement;
    private dimensions: GraphDimensions = {};

    public getWidth(): number {
        return this.dimensions.width;
    }

    public getHeight(): number {
        return this.dimensions.height;
    }

    public getDimensions(): GraphDimensions {
        return this.dimensions;
    }

    private setDimensions(): void {
        this.setCanvasStyleWidthAndHeight();
        this.setCanvasWidthAndHeight();
        this.dimensions.height = this.canvas.offsetHeight;
        this.dimensions.width = this.canvas.offsetWidth;
    }

    private setCanvasStyleWidthAndHeight(width: number = 850, height: number = 450): void {
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    private setCanvasWidthAndHeight(): void {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
    }
}