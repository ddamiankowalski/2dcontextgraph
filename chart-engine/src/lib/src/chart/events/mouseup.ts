import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mouseup implements ChartEvent {
    eventName: string = 'mouseup';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: Event): void {
        EventManager.mouseDown = false;
    }
}