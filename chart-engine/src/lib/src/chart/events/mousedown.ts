import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousedown implements ChartEvent {
    eventName: string = 'mousedown';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: Event): void {
        EventManager.mouseDown = true;
    }
}