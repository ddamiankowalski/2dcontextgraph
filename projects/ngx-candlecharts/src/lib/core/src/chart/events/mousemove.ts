import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    private view: View;
    private elementCollector: ElementCollector;
    private eventManager: EventManager;

    constructor(view: View, elementCollector: ElementCollector, eventManager: EventManager) {
        this.view = view;
        this.elementCollector = elementCollector;
        this.eventManager = eventManager;
    }

    public callback(event: MouseEvent): void {
        this.checkCandleHover(event);

        if(this.view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
        }
    }

    private checkCandleHover(event: MouseEvent): void {
        this.elementCollector.getCandles().forEach(candle => {
            if(
              event.offsetX > candle.getXStart() &&
              event.offsetX < candle.getXStart() + (candle.width ?? 0)
            ) {
                this.eventManager.candleHover$.next(candle);
            }
        })
    }
}
