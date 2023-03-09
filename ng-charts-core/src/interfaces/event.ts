import { Dimensions } from "../chart/dimensions";
import { View } from "../chart/view";

export interface ChartEvent<T = any> {
    eventName: string;
    callback: (event: T) => void;
}