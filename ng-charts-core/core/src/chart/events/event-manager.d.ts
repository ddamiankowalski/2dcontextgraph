import { ChartEvent } from '../../interfaces/event';
import { Observable, Subject } from 'rxjs';
import { Candle } from '../elements/candle';
export declare class EventManager {
    private canvas;
    constructor(canvas: HTMLCanvasElement);
    static mouseDown: boolean;
    candleHover$: Subject<Candle>;
    listen(event: ChartEvent): void;
    getCandleHover$(): Observable<Candle>;
}
