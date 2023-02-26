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

        // if(view.getColInterval() <= view.getMaxColInterval()) {
        //     if(time.checkIfMaxTimeSpan()) {
        //         return;
        //     }
        //     view.setColInterval(view.getMaxColInterval() * time.getPrevMaxDistanceRatio() - scrollSpeed);
        //     view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue / time.getPrevMaxDistanceRatio());

        //     time.enlargeTimeSpan();
        // } else if(view.getColInterval() >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
        //     view.setColInterval(view.getMaxColInterval() + scrollSpeed);
        //     view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio());

        //     time.reduceTimeSpan();
        // }

        if(event.deltaY > 0 && (view.getColInterval() - scrollSpeed >= view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {
            view.addColInterval(scrollSpeed)
            view.addViewOffset(zoomOffsetSyncValue);

            view.addZoom(scrollSpeed * .02);
        } else if(event.deltaY < 0 && (!time.checkIfMinTimeSpan() || view.getColInterval() + scrollSpeed <= view.getMaxColInterval() * 2)) {
            view.addColInterval(scrollSpeed);
            view.addViewOffset(zoomOffsetSyncValue);

            view.addZoom(scrollSpeed * .02);
        }

        if(view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    }

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, wheelEvent: any): void {
        const event = {
            offsetX: wheelEvent.offsetX,
            deltaY: wheelEvent.deltaY > 0 ? 3 : -3
        }

        AnimationsManager.startAnimation(
            'wheel',
            350,
            [0],
            [event.deltaY],
            (easedValues) => {

                console.log(easedValues)
                const [ wheelValue ] = easedValues; 
                Wheel.calculate(canvas, dimensions, view, time, event as WheelEvent, -wheelValue)
            }
        );
    }
}