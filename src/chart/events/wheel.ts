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
        const scrollSpeeds = view.getScrollSpeed();

        if(event.deltaY > 0) {
            AnimationsManager.startAnimation(
                300, 
                [scrollSpeeds, zoomOffsetSyncValue, scrollSpeeds], 
                (...arg: any[]) => {
                    const [ values ] = arg;
                    const [ colInterval, viewOffset, scrollSpeed ] = values;

                    if((view.getColInterval() - scrollSpeed > view.getMaxColInterval() || !time.checkIfMaxTimeSpan())) {

                        if(view.getColInterval() + colInterval <= view.getMaxColInterval()) {
                            if(time.checkIfMaxTimeSpan()) {
                                return;
                            }
                            view.setColInterval(view.getMaxColInterval() * time.getPrevMaxDistanceRatio() - view.getScrollSpeed());
                            view.setViewOffset(view.getViewOffset() - zoomOffsetSyncValue / time.getPrevMaxDistanceRatio() * scrollSpeed);
                            time.enlargeTimeSpan();
                            //AnimationsManager.clearStack();
                        } else {
                            view.setColInterval(view.getColInterval() - colInterval);
                            view.setViewOffset(view.getViewOffset() - viewOffset);
                            view.setZoom(view.getZoom() - scrollSpeed * .02);
                        }
                    }
            
                    if(view.getViewOffset() <= 0) {
                        view.setViewOffset(0);
                    }
                }, 
            );
        } else if(event.deltaY < 0) {
            AnimationsManager.startAnimation(
                300, 
                [scrollSpeeds, zoomOffsetSyncValue, scrollSpeeds], 
                (...arg: any[]) => {
                    const [ values ] = arg;
                    const [ colIntervalStep, viewOffsetStep, scrollSpeedStep ] = values;

                    if(view.getColInterval() + colIntervalStep >= view.getMaxColInterval() * time.getCurrentMaxDistanceRatio()) {
                        view.setColInterval(view.getMaxColInterval() + view.getScrollSpeed());
                        view.setViewOffset(view.getViewOffset() + zoomOffsetSyncValue * time.getCurrentMaxDistanceRatio() + scrollSpeedStep);
                        time.reduceTimeSpan();
                        //AnimationsManager.clearStack();
                    } 
                        if((!time.checkIfMinTimeSpan() || view.getColInterval() + scrollSpeedStep < view.getMaxColInterval() * 2)) {
                            view.setViewOffset(view.getViewOffset() + viewOffsetStep);
                            view.setColInterval(view.getColInterval() + colIntervalStep);
                            view.setZoom(view.getZoom() + scrollSpeedStep * .02);
                        }
                
                        if(view.getViewOffset() <= 0) {
                            view.setViewOffset(0);
                        }
                    
                }, 
            );
        }
    }
}