import { IElements } from '../../interfaces/elements';
import { Dimensions } from '../dimensions';
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

    public draw(elements: IElements): void {
        this.clearView();

        const elementArray = elements.elementsMap;

        elementArray.forEach(renderElement => {
            renderElement.forEach(el => {
                this.render(el);
            })
        })
    }

    private clearView(): void {
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    }

    private render(element: Element): void {
        if(element.getXStart() <= this.dimensions.getWidth()) {
            element.render(element, this.context, this.dimensions);
        }
    }
}
