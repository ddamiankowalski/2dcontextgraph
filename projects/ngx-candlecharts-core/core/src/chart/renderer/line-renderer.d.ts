import { IRenderProperties } from '../../interfaces/renderelement';
import { Dimensions } from '../dimensions';
import { Line } from '../elements/line';
export declare class LineRenderer {
    draw(line: Line, dimensions: Dimensions, context: CanvasRenderingContext2D, properties: IRenderProperties): void;
}
