import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';
export declare class Element {
    constructor({ xStart, xEnd, yStart, yEnd }: I2DCoords, properties: IRenderProperties);
    protected xStart: number;
    protected xEnd: number;
    protected yStart: number;
    protected yEnd: number;
    protected renderProperties: IRenderProperties;
    getXStart(): number;
    getXEnd(): number;
    getYStart(): number;
    getYEnd(): number;
    getProperties(): IRenderProperties;
    render(element: Element, context: CanvasRenderingContext2D, dimensions: Dimensions): void;
}
