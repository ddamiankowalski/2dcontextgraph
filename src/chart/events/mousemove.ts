import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent<MouseEvent> {
    eventName: string = 'mousemove';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: MouseEvent): void {
        if(view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            view.setViewOffset(view.getViewOffset() + event.movementX);
        }
    }
}