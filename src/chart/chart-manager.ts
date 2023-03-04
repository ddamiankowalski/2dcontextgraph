import { ElementCollector } from './elements/element-collector';
import { Dimensions } from './dimensions';
import { View } from './view';
import { Candle } from './elements/candle'; 
import { CandlePayload } from '../interfaces/candlestick';
import { Renderer } from './renderer/renderer';
import { Element } from './elements/element';
import { EventManager } from './events/event-manager';
import { Wheel } from './events/wheel';
import { Mouseout } from './events/mouseout';
import { Mousedown } from './events/mousedown';
import { Mouseup } from './events/mouseup';
import { Mousemove } from './events/mousemove';
import { AnimationsManager } from './animations/animations-manager';
import { IViewConfig } from '../interfaces/view.interface';

export class ChartManager {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private dimensions: Dimensions;
    private view: View;
    private renderer: Renderer;
    private eventManager: EventManager;
    private candles: CandlePayload[];
    private lastRender?: number;
    private animations: AnimationsManager;

    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, candles: CandlePayload[]) {
        this.context = context;
        this.canvas = canvas;

        this.setCanvasDimensions();
        this.setView();
        this.setRenderer();
        this.setCandles(candles);
        this.addCanvasListeners();
        this.canvas.style.backgroundColor = "#191f2c";

        this.frameLoop();
    }

    private setCanvasDimensions(): void {
        const [ horizontalMargin, verticalMargin ] = [ 75, 40 ];
        this.dimensions = new Dimensions(this.canvas, horizontalMargin, verticalMargin);
    }

    private setView(): void {
        const viewConfig: IViewConfig = {
            intervalName: 'M1',
            intervalCandles: 60,
            intervalStep: 0,
            intervalColInit: 150,
            intervalColRatios: [150, 300, 600],
            viewOffset: 0
        }
        this.view = new View(viewConfig);
    }

    private setRenderer(): void {
        this.renderer = new Renderer(this.context, this.dimensions);
    }

    private setCandles(candles: CandlePayload[]): void {
        Candle.findMaxLowInData(candles);
        this.candles = candles;
    }

    private addCanvasListeners(): void {
        this.eventManager = new EventManager(this.canvas, this.dimensions, this.view);
        this.eventManager.listen(new Wheel());
        this.eventManager.listen(new Mouseout());
        this.eventManager.listen(new Mousedown());
        this.eventManager.listen(new Mouseup());
        this.eventManager.listen(new Mousemove());
    }

    private frameLoop(time?: number): void {
        if(!this.lastRender || time - this.lastRender >= 16) {
            this.lastRender = time;
            Candle.resetHighLow();
            const elements = this.getRenderingElements();
            this.renderElements(elements);

            AnimationsManager.setCurrentTimeStamp(time);
        }
        window.requestAnimationFrame(this.frameLoop.bind(this));
    }

    private getRenderingElements(): Set<Element[]> {
        return new ElementCollector(this.dimensions, this.view, this.candles, this.context).getElements();
    }

    private renderElements(elements: Set<Element[]>): void {
        AnimationsManager.update();
        this.renderer.draw(elements);
    }
}