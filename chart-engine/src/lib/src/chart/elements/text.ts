import { I2DCoords } from '../../interfaces/renderelement';
import { IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';
import { TextRenderer } from '../renderer/text-renderer';
import { Element } from './element';

export class Text extends Element {
    constructor(coords: I2DCoords, properties: IRenderProperties, value: string) {
        super(coords, properties);
        this.value = value;

        Text.initializeRenderer();
    }

    private static renderer: TextRenderer;
    private value: string;

    public render(element: Text, context: CanvasRenderingContext2D, dimensions: Dimensions): void {
        Text.renderer.draw(element, dimensions, context, this.getProperties());
    }

    public getValue(): string {
        return this.value;
    }

    private static initializeRenderer(): void {
        if(!Text.renderer) {
            Text.renderer = new TextRenderer();
        }
    }
}