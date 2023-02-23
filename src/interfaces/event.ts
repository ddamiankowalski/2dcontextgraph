import { Dimensions } from "../chart/dimensions";
import { Time } from "../chart/time";
import { View } from "../chart/view";

export interface ChartEvent<T = Event> {
    eventName: string;
    callback: (canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: T) => void;
}