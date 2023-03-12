import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { EventManager } from './event-manager';

export class Click implements ChartEvent {
    constructor(eventManager: EventManager, elementCollector: ElementCollector) {
      this.elementCollector = elementCollector;
      this.eventManager = eventManager;
    }

    eventName: string = 'click';

    private elementCollector!: ElementCollector;
    private eventManager!: EventManager;

    public callback(event: MouseEvent): void {
    }
}
