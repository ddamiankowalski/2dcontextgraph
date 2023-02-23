import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mouseup implements ChartEvent {
    eventName: string = 'mouseup';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: Event): void {
        EventManager.mouseDown = false;
    }
}