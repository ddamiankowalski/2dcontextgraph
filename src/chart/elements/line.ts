import { RenderElement } from "./render-element";
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
import { LineRenderer } from '../renderer/line-renderer';
import { CanvasDimensions } from "../canvas-dimensions";

export class Line extends RenderElement {
    constructor(coords: I2DCoords, properties: IRenderProperties) {
        super(coords, properties);

        Line.initializeRenderer();
    }

    private static renderer: LineRenderer;

    public render(element: Line, context: CanvasRenderingContext2D, dimensions: CanvasDimensions): void {
        Line.renderer.draw(element, dimensions, context, this.getProperties());
    }

    private static initializeRenderer(): void {
        if(!Line.renderer) {
            Line.renderer = new LineRenderer();
        }
    }
}