import { GraphDimensions } from '../interfaces/dimensions';
import { Animation } from './animations/animation';
import { AnimationsManager } from './animations/animations-manager';
import { EventManager } from './events/event-manager';

export class Dimensions {
    constructor(canvas: HTMLCanvasElement, lineCanvas: HTMLCanvasElement, horizontalMargin: number, verticalMargin: number) {
        this.canvas = canvas;
        this.lineCanvas = lineCanvas;
        this.horizontalMargin = horizontalMargin;
        this.verticalMargin = verticalMargin;
        this.setDimensions();
    }

    private canvas: HTMLCanvasElement;
    private lineCanvas: HTMLCanvasElement;
    private dimensions: GraphDimensions = {};
    private horizontalMargin: number;
    private verticalMargin: number;

    public resize(entry: ResizeObserverEntry): void {
      this.canvas.height = entry.contentRect.height;
      this.canvas.width = entry.contentRect.width;
      this.dimensions.height = entry.contentRect.height;
      this.dimensions.width = entry.contentRect.width;

      AnimationsManager.getAnimationStack().push(new Animation('resize', 1, [], [], () => console.log('resized'), true))
    }

    public getWidth(): number {
        return this.dimensions.width ?? 0;
    }

    public getHeight(): number {
        return this.dimensions.height ?? 0;
    }

    public getDimensions(): GraphDimensions {
        return this.dimensions;
    }

    public getVerticalMargin(): number {
        return this.verticalMargin;
    }

    public getHorizontalMargin(): number {
        return this.horizontalMargin;
    }

    private setDimensions(): void {
        this.setCanvasStyleWidthAndHeight();
        this.setCanvasWidthAndHeight();
        this.dimensions.height = this.canvas.offsetHeight;
        this.dimensions.width = this.canvas.offsetWidth;
    }

    private setCanvasStyleWidthAndHeight(width: number = 1280, height: number = 400): void {
        this.canvas.style.width = `${100}%`;
        this.canvas.style.height = `${100}%`;

        this.lineCanvas.style.width = `${100}%`;
        this.lineCanvas.style.height = `${100}%`;
    }

    private setCanvasWidthAndHeight(): void {
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;

        this.lineCanvas.height = this.canvas.offsetHeight;
        this.lineCanvas.width = this.canvas.offsetWidth;
    }
}
