import { CanvasDimensions } from '../canvas-dimensions';
import { RenderElement } from '../elements/render-element'
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
        elementSet.forEach(renderElement => {
            renderElement.forEach(el => {
                this.render(el);
            })
        })
    }

    private render(element: RenderElement): void {
        if(element.getXStart() <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            element.render(element, this.context, this.dimensions);
        }
    }
}