import { ChartEvent } from '../../interfaces/event';
import { EventManager } from './event-manager';

export class Mouseup implements ChartEvent {
    eventName = 'mouseup';

    public callback(event: Event): void {
        EventManager.mouseDown = false;
    }
}