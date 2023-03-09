import { I2DCoords } from '../../interfaces/renderelement';
import { IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';
import { Element } from './element';
export declare class Text extends Element {
    constructor(coords: I2DCoords, properties: IRenderProperties, value: string);
    private static renderer;
    private value;
    render(element: Text, context: CanvasRenderingContext2D, dimensions: Dimensions): void;
    getValue(): string;
    private static initializeRenderer;
}
