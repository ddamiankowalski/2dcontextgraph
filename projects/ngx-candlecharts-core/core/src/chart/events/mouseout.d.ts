import { ChartEvent } from '../../interfaces/event';
export declare class Mouseout implements ChartEvent {
    eventName: string;
    callback(event: Event): void;
}
