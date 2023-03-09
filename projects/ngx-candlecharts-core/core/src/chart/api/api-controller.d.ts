import { Observable } from "rxjs";
import { Candle } from "../elements/candle";
import { EventManager } from "../events/event-manager";
import { View } from "../view";
export declare class ChartAPIController {
    private view;
    private eventManager;
    constructor(view: View, eventManager: EventManager);
    resetViewOffset(msTime?: number): void;
    hoveredCandle$(): Observable<Candle>;
}
