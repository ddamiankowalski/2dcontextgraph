import { GraphDimensions } from '../interfaces/dimensions';

export class Dimensions {
    constructor(canvas: HTMLCanvasElement, horizontalMargin: number, verticalMargin: number) {
        this.horizontalMargin = horizontalMargin;
        this.verticalMargin = verticalMargin;
        this.setDimensions();
    }

    private dimensions: GraphDimensions = {};
    private horizontalMargin: number;
    private verticalMargin: number;

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
        //this.setCanvasStyleWidthAndHeight();
        //this.setCanvasWidthAndHeight();
        this.dimensions.height = 400;
        this.dimensions.width = 1280;
    }
}