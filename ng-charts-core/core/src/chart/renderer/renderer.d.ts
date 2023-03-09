import { Dimensions } from '../dimensions';
import { Element } from '../elements/element';
export declare class Renderer {
    constructor(context: CanvasRenderingContext2D, dimensions: Dimensions);
    private context;
    private dimensions;
    draw(elementSet: Set<Element[]>): void;
    private clearView;
    private render;
}
