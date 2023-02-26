import { ChartEvent } from '../../interfaces/event';
import { AnimationsManager } from '../animations/animations-manager';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';

export class Wheel implements ChartEvent {
    eventName: string = 'wheel';
    
    private static calculate(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: WheelEvent, wheelValue?: number) {
        const graphWidth = dimensions.getWidth();
        const scrollSpeed = wheelValue ?? view.getScrollSpeed();
        const zoomOffsetSyncValue = (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * scrollSpeed;

        if(event.deltaY > 0) {
            view.addColInterval(scrollSpeed)
            view.addViewOffset(zoomOffsetSyncValue);

            view.addZoom(scrollSpeed / 100);
        } else if(event.deltaY < 0) {
            view.addColInterval(scrollSpeed);
            view.addViewOffset(zoomOffsetSyncValue);

            view.addZoom(scrollSpeed / 100);
        }

        if(view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    }

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, wheelEvent: any): void {
        const event = {
            offsetX: wheelEvent.offsetX,
            deltaY: wheelEvent.deltaY > 0 ? 1 : -1
        }

        AnimationsManager.startAnimation(
            'wheel',
            400,
            [0],
            [event.deltaY],
            (easedValues) => {
                const [ wheelValue ] = easedValues; 
                Wheel.calculate(canvas, dimensions, view, time, event as WheelEvent, -wheelValue)
            }
        );
    }
}