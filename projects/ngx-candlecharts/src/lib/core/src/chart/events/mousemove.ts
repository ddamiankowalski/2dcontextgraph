import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Mousemove implements ChartEvent {
    eventName = 'mousemove';

    private view: View;
    private eventManager!: EventManager;
    private elementCollector!: ElementCollector;

    constructor(view: View, eventManager: EventManager, elementCollector: ElementCollector) {
        this.view = view;
        this.eventManager = eventManager;
        this.elementCollector = elementCollector;
    }

    public callback(event: MouseEvent): void {
        EventManager.mousePosition = event;

        if(this.view.getViewOffset() + event.movementX > 0 && EventManager.mouseDown) {
            this.eventManager.forceTooltipHide$.next(true);
            this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
        }

        this.checkCandleClicked(event);
    }

    private checkCandleClicked(event: MouseEvent): void {
      let foundCandle = false;
      this.elementCollector.getCandles().forEach(candle => {
          if(
            event.offsetX > candle.getXStart() - (candle.width ?? 0) &&
            event.offsetX < candle.getXStart() + (candle.width ?? 0)
          ) {
              foundCandle = true;
              this.eventManager.candleHover$.next(candle);
          }
      });

      if(!foundCandle) {
        this.eventManager.candleHover$.next(null);
      }
  }
}
