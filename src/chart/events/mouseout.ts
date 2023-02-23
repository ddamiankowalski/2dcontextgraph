import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mouseout implements ChartEvent {
    eventName: string = 'mouseout';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: Event): void {
        EventManager.mouseDown = false;
    }
}