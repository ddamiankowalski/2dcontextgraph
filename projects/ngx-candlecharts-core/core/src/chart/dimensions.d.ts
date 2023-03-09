import { GraphDimensions } from '../interfaces/dimensions';
export declare class Dimensions {
    constructor(canvas: HTMLCanvasElement, horizontalMargin: number, verticalMargin: number);
    private canvas;
    private dimensions;
    private horizontalMargin;
    private verticalMargin;
    getWidth(): number;
    getHeight(): number;
    getDimensions(): GraphDimensions;
    getVerticalMargin(): number;
    getHorizontalMargin(): number;
    private setDimensions;
    private setCanvasStyleWidthAndHeight;
    private setCanvasWidthAndHeight;
}
