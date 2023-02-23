import { Dimensions } from '../dimensions';
import { Candle } from '../elements/candle';
import { Element } from '../elements/element'
export class Renderer {
    constructor(
        context: CanvasRenderingContext2D,
        dimensions: Dimensions
    ) {
        this.context = context;
        this.dimensions = dimensions;
    }

    private context: CanvasRenderingContext2D;
    private dimensions: Dimensions;

    public draw(elementSet: Set<Element[]>): void {
        this.clearView();

        elementSet.forEach(renderElement => {
            renderElement.forEach(el => {
                this.render(el);
            })
        })
    }

    private clearView(): void {
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    }

    private render(element: Element): void {
        if(element.getXStart() <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            element.render(element, this.context, this.dimensions);
        }
    }
}