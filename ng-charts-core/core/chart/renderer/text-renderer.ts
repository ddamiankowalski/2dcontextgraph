import { IRenderProperties } from "../../interfaces/renderelement";
import { Dimensions } from "../dimensions";
import { Text } from "../elements/text";

export class TextRenderer {
    public draw(text: Text, dimensions: Dimensions, context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        context.font = "9px Barlow";
        context.fillStyle = '#A9A9A9';
        context.fillText(text.getValue(), text.getXStart(), text.getYStart());
    }
}