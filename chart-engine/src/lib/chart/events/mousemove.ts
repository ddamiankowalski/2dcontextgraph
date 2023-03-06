import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: MouseEvent): void {
        if(view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            view.setViewOffset(view.getViewOffset() + event.movementX);
        }
    }
}