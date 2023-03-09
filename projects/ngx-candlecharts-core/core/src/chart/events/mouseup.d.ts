import { ChartEvent } from '../../interfaces/event';
export declare class Mouseup implements ChartEvent {
    eventName: string;
    callback(event: Event): void;
}
