import { ElementCollector } from './elements/element-collector';
import { Dimensions } from './dimensions';
import { View } from './view';
import { Candle } from './elements/candle'; 
import { Time } from './time';
import { CandlePayload } from '../interfaces/candlestick';
import { Renderer } from './renderer/renderer';
import { Element } from './elements/element';
import { EventManager } from './events/event-manager';
import { Wheel } from './events/wheel';
import { Mouseout } from './events/mouseout';
import { Mousedown } from './events/mousedown';
import { Mouseup } from './events/mouseup';
import { Mousemove } from './events/mousemove';
import { MathUtils } from './math-utils';
import { AnimationsManager } from './animations/animations-manager';

export class ChartManager {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private dimensions: Dimensions;
    private view: View;
    private time: Time;
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
        this.setTime();
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
        const maxColInterval = 150;
        this.view = new View(maxColInterval);
    }

    private setTime(): void {
        this.time = new Time();
    }

    private setRenderer(): void {
        this.renderer = new Renderer(this.context, this.dimensions);
    }

    private setCandles(candles: CandlePayload[]): void {
        Candle.findMaxLowInData(candles);
        this.candles = candles;
    }

    private addCanvasListeners(): void {
        this.eventManager = new EventManager(this.canvas, this.dimensions, this.view, this.time);
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
            this.drawValueLines();

            AnimationsManager.setCurrentTimeStamp(time);
        }
        window.requestAnimationFrame(this.frameLoop.bind(this));
    }

    private getRenderingElements(): Set<Element[]> {
        return new ElementCollector(this.time, this.dimensions, this.view, this.candles, this.context).getElements();
    }

    private renderElements(elements: Set<Element[]>): void {
        AnimationsManager.update();
        this.renderer.draw(elements);
    }


    /**
     * MOVE THAT TO A RENDERING ELEMENT
     */
    private drawValueLines(): void {
        const { height } = this.dimensions.getDimensions();
        const [ currentMax, currentLow ] = Candle.getHighLow();

        let currentYZoom = 1;

        while((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom >= 10) {
            currentYZoom = currentYZoom * 2;
        }

        while((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom <= 6) {
            currentYZoom = currentYZoom / 2;
        }

        currentYZoom = Math.round(currentYZoom);

        for(let horizontalLineOffset = Math.floor(currentMax); horizontalLineOffset >= currentLow; horizontalLineOffset = horizontalLineOffset - .5) {
            if(horizontalLineOffset <= currentMax && horizontalLineOffset >= currentLow) {

                if(Number(horizontalLineOffset.toFixed(2)) % currentYZoom === 0) {

                    const interpolation = MathUtils.interpolate(height - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);

                    this.context.beginPath();
                    this.context.moveTo(0, interpolation);
                    this.context.lineTo(this.dimensions.getWidth() - this.dimensions.getHorizontalMargin(), interpolation);
                    this.context.strokeStyle = '#A9A9A9';
                    this.context.lineWidth = .1;
                    this.context.stroke();
    
                    this.context.font = "10px Barlow";
                    this.context.fillStyle = '#A9A9A9';
                    this.context.fillText(horizontalLineOffset.toFixed(2), this.dimensions.getWidth() - 55, interpolation + 6);
                }
            }
        }
    }
}