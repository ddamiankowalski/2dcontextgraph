import { ChartEvent } from '../../interfaces/event';
import { EventManager } from './event-manager';

export class Mousedown implements ChartEvent {
    eventName: string = 'mousedown';

    public callback(event: Event): void {
        EventManager.mouseDown = true;
    }
}