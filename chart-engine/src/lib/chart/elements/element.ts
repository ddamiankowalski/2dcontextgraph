import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';

export class Element {
    constructor(
        { xStart, xEnd, yStart, yEnd }: I2DCoords, 
        properties: IRenderProperties,
    ) {
        this.xStart = xStart ?? 0;
        this.xEnd = xEnd ?? xStart ?? 0;
        this.yStart = yStart ?? 0;
        this.yEnd = yEnd ?? yStart ?? 0;
        this.renderProperties = properties;
    }

    protected xStart: number;
    protected xEnd: number;
    protected yStart: number;
    protected yEnd: number;
    protected renderProperties: IRenderProperties;

    public getXStart(): number {
        return this.xStart;
    }

    public getXEnd(): number {
        return this.xEnd;
    }

    public getYStart(): number {
        return this.yStart;
    }

    public getYEnd(): number {
        return this.yEnd;
    }

    public getProperties(): IRenderProperties {
        return this.renderProperties;
    }

    public render(element: Element, context: CanvasRenderingContext2D, dimensions: Dimensions): void {};
}