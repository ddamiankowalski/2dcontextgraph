import { ChartEvent } from '../../interfaces/event';
import { EventManager } from './event-manager';

export class Mouseout implements ChartEvent {
    constructor(eventManager: EventManager) {
      this.eventManager = eventManager;
    }

    private eventManager!: EventManager;

    eventName: string = 'mouseout';

    public callback(event: Event): void {
      EventManager.mouseDown = false;
      this.eventManager.candleHover$.next(null);
    }
}
