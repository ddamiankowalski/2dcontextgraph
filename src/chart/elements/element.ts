import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { ChartDimensions } from '../chart-dimensions';

export class Element {
    constructor(
        { xStart, xEnd, yStart, yEnd }: I2DCoords, 
        properties: IRenderProperties,
    ) {
        this.xStart = xStart;
        this.xEnd = xEnd ?? xStart;
        this.yStart = yStart;
        this.yEnd = yEnd ?? yStart;
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

    public render(element: Element, context: CanvasRenderingContext2D, dimensions: ChartDimensions): void {};
}