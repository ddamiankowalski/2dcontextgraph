import { Element } from "./element";
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { LineRenderer } from '../renderer/line-renderer';
import { Dimensions } from "../dimensions";

export class Line extends Element {
    constructor(coords: I2DCoords, properties: IRenderProperties) {
        super(coords, properties);

        Line.initializeRenderer();
    }

    private static renderer: LineRenderer;

    public override render(element: Line, context: CanvasRenderingContext2D, dimensions: Dimensions): void {
        Line.renderer.draw(element, dimensions, context, this.getProperties());
    }

    private static initializeRenderer(): void {
        if(!Line.renderer) {
            Line.renderer = new LineRenderer();
        }
    }
}