import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { View } from '../view';
import { EventManager } from './event-manager';
export declare class Mousemove implements ChartEvent {
    eventName: string;
    private view;
    private elementCollector;
    private eventManager;
    constructor(view: View, elementCollector: ElementCollector, eventManager: EventManager);
    callback(event: MouseEvent): void;
    private checkCandleHover;
}
