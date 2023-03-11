import { ChartEvent } from '../../interfaces/event';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    private view: View;
    private eventManager!: EventManager;

    constructor(view: View, eventManager: EventManager) {
        this.view = view;
        this.eventManager = eventManager;
    }

    public callback(event: MouseEvent): void {
        if(this.view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            this.eventManager.forceTooltipHide$.next(true);
            this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
        }
    }
}
