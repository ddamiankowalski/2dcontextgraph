import { Dimensions } from "../chart/dimensions";
import { View } from "../chart/view";

export interface ChartEvent<T = any> {
    eventName: string;
    callback: (canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: T) => void;
}