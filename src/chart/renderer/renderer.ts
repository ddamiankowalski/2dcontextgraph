import { CanvasDimensions } from '../canvas-dimensions';
import { RenderElement } from '../../chart/drawelements/render-element'

export class Renderer {
    constructor(
        context: CanvasRenderingContext2D,
        dimensions: CanvasDimensions
    ) {
        this.context = context;
        this.dimensions = dimensions;
    }

    private context: CanvasRenderingContext2D;
    private dimensions: CanvasDimensions;

    public draw(elementSet: Set<RenderElement[]>): void {
        console.log(elementSet)
        elementSet.forEach(renderElement => {
            renderElement.forEach(el => {
                this.render(el);
            })
        })
    }

    private render(element: RenderElement): void {
        const xStart = element.getXStart();
        const xEnd = element.getXEnd();
        const yStart = element.getYStart();
        const yEnd = element.getYEnd();

        if(element.getXStart() <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            this.context.beginPath();
            this.context.moveTo(xStart, yStart);
            this.context.lineTo(xEnd, yEnd);
            this.context.strokeStyle = element.getProperties().color ?? '#A9A9A9';
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    }
}