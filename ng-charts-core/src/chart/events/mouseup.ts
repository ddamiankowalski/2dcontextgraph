import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mouseup implements ChartEvent {
    eventName = 'mouseup';

    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
    }

    public callback(event: Event): void {
        EventManager.mouseDown = false;
    }
}