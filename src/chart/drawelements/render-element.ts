export class RenderElement {
    constructor(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.yStart = yStart;
        this.yEnd = yEnd;
    }

    protected xStart: number;
    protected xEnd: number;
    protected yStart: number;
    protected yEnd: number;
}