import { RenderElement } from "./renderelement";

export class Line extends RenderElement {
    constructor(
        xStart: number,
        xEnd: number,
        yStart: number,
        yEnd: number
    ) {
        super(xStart, xEnd, yStart, yEnd);
    }
}