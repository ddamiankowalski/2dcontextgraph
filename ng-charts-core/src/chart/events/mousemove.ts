import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
    }

    public callback(event: MouseEvent): void {
        console.log(event);
        if(this.view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
        }
    }
}