import { ChartEvent } from '../../interfaces/event';
import { EventManager } from './event-manager';

export class Mouseout implements ChartEvent {
    eventName: string = 'mouseout';

    public callback(event: Event): void {
        EventManager.mouseDown = false;
    }
}