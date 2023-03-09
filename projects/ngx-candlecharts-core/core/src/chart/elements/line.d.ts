import { Element } from "./element";
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from "../dimensions";
export declare class Line extends Element {
    constructor(coords: I2DCoords, properties: IRenderProperties);
    private static renderer;
    render(element: Line, context: CanvasRenderingContext2D, dimensions: Dimensions): void;
    private static initializeRenderer;
}
