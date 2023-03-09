import { IRenderProperties } from "../../interfaces/renderelement";
import { Dimensions } from "../dimensions";
import { Text } from "../elements/text";
export declare class TextRenderer {
    draw(text: Text, dimensions: Dimensions, context: CanvasRenderingContext2D, properties: IRenderProperties): void;
}
