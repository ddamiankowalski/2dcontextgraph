import { Dimensions } from '../dimensions';
import { View } from '../view';
import { Time } from '../time';
import { ChartEvent } from '../../interfaces/event';

export class EventManager {
    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;
    private time: Time;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
        this.time = time;
    }

    public static mouseDown: boolean = false;

    public listen(event: ChartEvent): void {
        this.canvas.addEventListener(event.eventName, (canvasEvent: Event) => {
            event.callback.call(this, this.canvas, this.dimensions, this.view, this.time, canvasEvent);
        });
    }
}