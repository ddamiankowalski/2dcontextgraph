import { ChartEvent } from '../../interfaces/event';
export declare class Mousedown implements ChartEvent {
    eventName: string;
    callback(event: Event): void;
}
