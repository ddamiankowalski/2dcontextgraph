import { Dimensions } from '../dimensions';
import { View } from '../view';
import { ChartEvent } from '../../interfaces/event';

export class EventManager {
    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
    }

    public static mouseDown = false;

    public listen(event: ChartEvent): void {
        this.canvas.addEventListener(event.eventName, (canvasEvent: Event) => {
            event.callback(canvasEvent);
        });
    }
}