import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    private view: View;

    constructor(view: View, elementCollector: ElementCollector) {
        this.view = view;
    }

    public callback(event: MouseEvent): void {
        console.log(event);
        if(this.view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
        }
    }
}