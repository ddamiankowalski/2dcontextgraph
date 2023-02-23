import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';

export class Wheel implements ChartEvent {
    eventName: string = 'wheel';
    
    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: WheelEvent) {
        const graphWidth = dimensions.getWidth();

        const zoomOffsetSyncValue = (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * view.getScrollSpeed();

        if(event.deltaY > 0 && (view.getColInterval() - view.getScrollSpeed() > view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {
            view.setColInterval(view.getColInterval() - view.getScrollSpeed())
            view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue);

            view.setZoom(view.getZoom() - view.getScrollSpeed() * .02);
        } else if(event.deltaY < 0 && (!time.checkIfMinTimeSpan() || view.getColInterval() + view.getScrollSpeed() < view.getMaxColInterval() * 2)) {
            view.setColInterval(view.getColInterval() + view.getScrollSpeed());
            view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue);

            view.setZoom(view.getZoom() + view.getScrollSpeed() * .02);
        }

        if(view.getColInterval() <= view.getMaxColInterval()) {
            if(time.checkIfMaxTimeSpan()) {
                return;
            }
            view.setColInterval(view.getMaxColInterval() * time.getPrevMaxDistanceRatio() - view.getScrollSpeed());
            view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue / time.getPrevMaxDistanceRatio());

            time.enlargeTimeSpan();

        } else if(view.getColInterval() >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
            view.setColInterval(view.getMaxColInterval() + view.getScrollSpeed());
            view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio());

            time.reduceTimeSpan();

        }

        if(view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    }
}