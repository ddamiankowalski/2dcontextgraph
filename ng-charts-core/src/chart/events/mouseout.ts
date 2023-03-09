import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mouseout implements ChartEvent {
    eventName: string = 'mouseout';
    
    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
    }

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: Event): void {
        EventManager.mouseDown = false;
    }
}