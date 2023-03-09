import { Observable } from "rxjs";
import { AnimationsManager } from "../animations/animations-manager";
import { Candle } from "../elements/candle";
import { EventManager } from "../events/event-manager";
import { View } from "../view";

export class ChartAPIController {
    constructor(
        private view: View,
        private eventManager: EventManager
    ) {}

    public resetViewOffset(msTime = 400): void {
        AnimationsManager.startAnimation(
            'resetViewOffset',
            msTime,
            [this.view.getViewOffset()],
            [0],
            (easedValues: number[]) => {
                const [ viewOffset ] = easedValues; 
                this.view.setViewOffset(viewOffset);
            },
            true
        );
    }

    public hoveredCandle$(): Observable<Candle> {
        return this.eventManager.getCandleHover$();
    }
}