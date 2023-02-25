import { ChartEvent } from '../../interfaces/event';
import { Dimensions } from '../dimensions';
import { Time } from '../time';
import { View } from '../view';
import { AnimationsManager } from '../animations/animations-manager';

export class Wheel implements ChartEvent {
    eventName: string = 'wheel';
    
    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, time: Time, event: WheelEvent) {
        const graphWidth = dimensions.getWidth();

        const zoomOffsetSyncValue = (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * view.getScrollSpeed();
        const scrollSpeed = view.getScrollSpeed();

        if(event.deltaY > 0 && (view.getColInterval() - scrollSpeed > view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {
            // view.setColInterval(view.getColInterval() - scrollSpeed)
            // view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue);

            // view.setZoom(view.getZoom() - scrollSpeed * .02);

            AnimationsManager.startAnimation(
                300, 
                [scrollSpeed, zoomOffsetSyncValue, scrollSpeed], 
                (...arg: any[]) => {
                    const [ values ] = arg;
                    const [ colInterval, viewOffset, scrollSpeed ] = values;
                    console.log(colInterval, viewOffset);
                    view.setColInterval(view.getColInterval() - colInterval);
                    view.setViewOffset(view.getViewOffset() - viewOffset);
                    view.setZoom(view.getZoom() - scrollSpeed * .02);
                }, 
            );
        } else if(event.deltaY < 0 && (!time.checkIfMinTimeSpan() || view.getColInterval() + scrollSpeed < view.getMaxColInterval() * 2)) {
            AnimationsManager.startAnimation(
                300, 
                [scrollSpeed, zoomOffsetSyncValue, scrollSpeed], 
                (...arg: any[]) => {
                    const [ values ] = arg;
                    const [ colInterval, viewOffset, scrollSpeed ] = values;
                    console.log(colInterval, viewOffset);
                    view.setColInterval(view.getColInterval() + colInterval);
                    view.setViewOffset(view.getViewOffset() + viewOffset);
                    view.setZoom(view.getZoom() + scrollSpeed * .02);
                }, 
            );
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