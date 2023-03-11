import { ChartEvent } from '../../interfaces/event';
import { Observable, Subject } from 'rxjs';
import { Candle } from '../elements/candle';

export class EventManager {
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public static mouseDown = false;
    public candleHover$ = new Subject<Candle | null>();
    public forceTooltipHide$ = new Subject<boolean>();

    public listen(event: ChartEvent): void {
        this.canvas.addEventListener(event.eventName, (canvasEvent: Event) => {
            event.callback(canvasEvent);
        });
    }
}
