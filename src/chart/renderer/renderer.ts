import { ChartDimensions } from '../chart-dimensions';
import { Element } from '../elements/element'
export class Renderer {
    constructor(
        context: CanvasRenderingContext2D,
        dimensions: ChartDimensions
    ) {
        this.context = context;
        this.dimensions = dimensions;
    }

    private context: CanvasRenderingContext2D;
    private dimensions: ChartDimensions;

    public draw(elementSet: Set<Element[]>): void {
        console.log('NEXT RENDER ROUND');
        elementSet.forEach(renderElement => {
            renderElement.forEach(el => {
                this.render(el);
            })
        })
    }

    private render(element: Element): void {
        if(element.getXStart() <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            element.render(element, this.context, this.dimensions);
        }
    }
}