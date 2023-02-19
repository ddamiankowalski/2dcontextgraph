import { RenderElement } from "./render-element";
import { I2DCoords, IRenderProperties } from '../../interfaces/renderelement';
export class Line extends RenderElement {
    constructor(coords: I2DCoords, properties: IRenderProperties) {
        super(coords, properties);
    }
}