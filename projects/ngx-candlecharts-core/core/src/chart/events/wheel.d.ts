import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
export declare class Wheel implements ChartEvent {
    eventName: string;
    private canvas;
    private dimensions;
    private view;
    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View);
    callback(wheelEvent: any): void;
    private static calculate;
    private static calculateOffsetSync;
    private static executeZoom;
    private static updateOffsetOverflow;
}
