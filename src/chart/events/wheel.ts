import { ChartEvent } from '../../interfaces/event';
import { AnimationsManager } from '../animations/animations-manager';
import { Dimensions } from '../dimensions';
import { View } from '../view';

export class Wheel implements ChartEvent {
    eventName: string = 'wheel';

    public callback(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, wheelEvent: any): void {
        const deltaYValue = (wheelEvent.deltaY > 0 && wheelEvent.deltaY !== 0 ? 1 : -1) / 5;

        const event = {
            offsetX: wheelEvent.offsetX,
            deltaY: deltaYValue
        }

        AnimationsManager.startAnimation(
            'wheel',
            400,
            [0],
            [event.deltaY],
            (easedValues) => {
                const [ wheelValue ] = easedValues; 
                Wheel.calculate(canvas, dimensions, view, event as WheelEvent, -wheelValue)
            }
        );
    }
    
    private static calculate(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: WheelEvent, wheelValue?: number) {
        const graphWidth = dimensions.getWidth();
        const scrollSpeed = wheelValue;
        const zoomOffsetSyncValue = this.calculateOffsetSync(graphWidth, dimensions, event, scrollSpeed, view);
        
        if(zoomOffsetSyncValue !== 0) {
            this.executeZoom(scrollSpeed, zoomOffsetSyncValue, view);
            this.updateOffsetOverflow(view);
        }
    }

    private static calculateOffsetSync(graphWidth: number, dimensions: Dimensions, event: WheelEvent, scrollSpeed: number, view: View): number {
        return (graphWidth + view.getViewOffset() - dimensions.getHorizontalMargin() - event.offsetX) / view.getColInterval() * scrollSpeed;
    }

    private static executeZoom(scrollSpeed: number, zoomOffsetSyncValue: number, view: View): void {
        view.addColInterval(scrollSpeed);
        view.addViewOffset(zoomOffsetSyncValue);
    }

    private static updateOffsetOverflow(view: View): void {
        if(view.getViewOffset() <= 0) {
            view.setViewOffset(0);
        }
    }
}