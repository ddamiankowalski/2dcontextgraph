import { Dimensions } from '../dimensions';
import { View } from '../view';
import { ChartEvent } from '../../interfaces/event';

export class EventManager {
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public static mouseDown = false;

    public listen(event: ChartEvent): void {
        this.canvas.addEventListener(event.eventName, (canvasEvent: Event) => {
            event.callback(canvasEvent);
        });
    }
}