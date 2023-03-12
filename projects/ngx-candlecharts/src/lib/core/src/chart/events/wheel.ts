import { ChartEvent } from '../../interfaces/event';
import { AnimationsManager } from '../animations/animations-manager';
import { Dimensions } from '../dimensions';
import { ElementCollector } from '../elements/element-collector';
import { View } from '../view';
import { EventManager } from './event-manager';

export class Wheel implements ChartEvent {
    eventName = 'wheel';

    private canvas: HTMLCanvasElement;
    private dimensions: Dimensions;
    private view: View;
    private eventManager!: EventManager;

    constructor(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, eventManager: EventManager) {
        this.canvas = canvas;
        this.dimensions = dimensions;
        this.view = view;
        this.eventManager = eventManager;
    }

    public callback(wheelEvent: any): void {
        const deltaYValue = (wheelEvent.deltaY > 0 && wheelEvent.deltaY !== 0 ? 1 : -1) / 2 * this.view.getDivider();
        this.eventManager.candleHover$.next(null);
        EventManager.currentCandle = null;

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
                if(
                    (-event.deltaY && this.view.maxZoomIn(-event.deltaY)) || (-event.deltaY && this.view.maxZoomOut(-event.deltaY))
                ) {
                    return;
                }

                const [ wheelValue ] = easedValues;
                Wheel.calculate(this.canvas, this.dimensions, this.view, event as WheelEvent, -wheelValue)
            },
            false
        );
    }

    private static calculate(canvas: HTMLCanvasElement, dimensions: Dimensions, view: View, event: WheelEvent, wheelValue: number) {
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
