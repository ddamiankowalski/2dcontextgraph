import { ChartEvent } from '../../interfaces/event';
import { ElementCollector } from '../elements/element-collector';
import { EventManager } from './event-manager';

export class Click implements ChartEvent {
    constructor(eventManager: EventManager, elementCollector: ElementCollector) {
      this.elementCollector = elementCollector;
      this.eventManager = eventManager;
    }

    eventName: string = 'click';

    private elementCollector!: ElementCollector;
    private eventManager!: EventManager;

    public callback(event: MouseEvent): void {
        this.checkCandleClicked(event);
    }

    private checkCandleClicked(event: MouseEvent): void {
      let foundCandle = false;
      this.elementCollector.getCandles().forEach(candle => {
          if(
            event.offsetX > candle.getXStart() - (candle.width ?? 0) &&
            event.offsetX < candle.getXStart() + (candle.width ?? 0) &&
            event.offsetY > (candle.yDrawingStart ?? 0) &&
            event.offsetY < (candle.yDrawingEnd ?? 0)
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
