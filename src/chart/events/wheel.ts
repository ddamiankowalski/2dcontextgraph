import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';

export class Wheel implements ChartEvent {
    eventName: string = 'wheel';
    
    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: WheelEvent, speed?: number) {
        const graphWidth = dimensions.getWidth();

        const scrollSpeed = speed ?? view.getScrollSpeed();
        const zoomOffsetSyncValue = (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * scrollSpeed;

        if(event.deltaY > 0 && (view.getColInterval() - scrollSpeed > view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {
            view.setColInterval(view.getColInterval() - scrollSpeed)
            view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue);

            view.setZoom(view.getZoom() - scrollSpeed * .02);
        } else if(event.deltaY < 0 && (!time.checkIfMinTimeSpan() || view.getColInterval() + scrollSpeed < view.getMaxColInterval() * 2)) {
            view.setColInterval(view.getColInterval() + scrollSpeed);
            view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue);

            view.setZoom(view.getZoom() + scrollSpeed * .02);
        }

        if(view.getColInterval() <= view.getMaxColInterval()) {
            if(time.checkIfMaxTimeSpan()) {
                return;
            }
            view.setColInterval(view.getMaxColInterval() * time.getPrevMaxDistanceRatio() - scrollSpeed);
            view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue / time.getPrevMaxDistanceRatio());

            time.enlargeTimeSpan();

        } else if(view.getColInterval() >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
            view.setColInterval(view.getMaxColInterval() + scrollSpeed);
            view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio());

            time.reduceTimeSpan();

        }

        if(view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    }

    public call(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time): void {
        const event = {
            offsetX: 666,
            deltaY: -1
        }

        this.callback(canvas, dimensions, view, time, event as WheelEvent, .5);
    }
}