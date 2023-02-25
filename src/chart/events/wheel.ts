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

        if(event.deltaY > 0) {
            AnimationsManager.startAnimation(
                300, 
                [scrollSpeed, zoomOffsetSyncValue, scrollSpeed], 
                (...arg: any[]) => {
                    if((view.getColInterval() - scrollSpeed > view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {
                        const [ values ] = arg;
                        const [ colInterval, viewOffset, scrollSpeed ] = values;

                        view.setColInterval(view.getColInterval() - colInterval);
                        view.setViewOffset(view.getViewOffset() - viewOffset);
                        view.setZoom(view.getZoom() - scrollSpeed * .02);
                    }

                    if(view.getColInterval() <= view.getMaxColInterval()) {
                        if(time.checkIfMaxTimeSpan()) {
                            return;
                        }
                        
                        view.setColInterval(view.getMaxColInterval() * time.getPrevMaxDistanceRatio() - view.getScrollSpeed());
                        view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue / time.getPrevMaxDistanceRatio());
            
                        time.enlargeTimeSpan();
                    }
            
                    if(view.getViewOffset() <= 0) {
                        view.setViewOffset(0);
                    }
                }, 
            );
        } else if(event.deltaY < 0) {
            if(!AnimationsManager.test) {
                return;
            }

            AnimationsManager.startAnimation(
                300, 
                [scrollSpeed, zoomOffsetSyncValue, scrollSpeed], 
                (...arg: any[]) => {
                    if((!time.checkIfMinTimeSpan() || view.getColInterval() + scrollSpeed < view.getMaxColInterval() * 2)) {
                        const [ values ] = arg;
                        const [ colInterval, viewOffset, scrollSpeed ] = values;

                        if(view.getColInterval() + colInterval >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
                            view.setColInterval(view.getMaxColInterval() + view.getScrollSpeed());
                            view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio());
                            time.reduceTimeSpan();

                            AnimationsManager.test = false;
                        } 
                        
                        if(!AnimationsManager.test) {
                            // console.log('oopsie')
                            // view.setColInterval(view.getColInterval() + colInterval);
                            // view.setZoom(view.getZoom() + scrollSpeed * .02);
                        } else {
                            view.setColInterval(view.getColInterval() + colInterval);
                            view.setViewOffset(view.getViewOffset() + viewOffset);
                            view.setZoom(view.getZoom() + scrollSpeed * .02);
                        }
                    }
            
                    if(view.getViewOffset() <= 0) {
                        view.setViewOffset(0);
                    }
                }, 
            );

            if(view.getColInterval() >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
                view.setColInterval(view.getMaxColInterval() + view.getScrollSpeed());
                view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio());
                time.reduceTimeSpan();
            }
        }
    }
}