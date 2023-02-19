import { IRenderProperties } from '../../interfaces/renderelement';
import { CanvasDimensions } from '../canvas-dimensions';
import { Line } from '../elements/line';

export class LineRenderer {
    public draw(line: Line, dimensions: CanvasDimensions, context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        context.beginPath();
        context.moveTo(line.getXStart(), line.getYStart());
        context.lineTo(line.getXEnd(), line.getYEnd());
        context.strokeStyle = '#A9A9A9';
        context.lineWidth = properties.width ?? 1;
        context.stroke();
    }
}