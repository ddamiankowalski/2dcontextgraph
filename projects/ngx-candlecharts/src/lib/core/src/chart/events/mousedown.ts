import { ChartEvent } from '../../interfaces/event';
import { EventManager } from './event-manager';

export class Mousedown implements ChartEvent {
    constructor(eventManager: EventManager) {
      this.eventManager = eventManager;
    }

    eventName: string = 'mousedown';

    private eventManager!: EventManager;

    public callback(event: Event): void {
        EventManager.mouseDown = true;
        EventManager.currentCandle = null;
        this.eventManager.candleHover$.next(null);
    }
}
