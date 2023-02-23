import { ElementCollector } from './elements/element-collector';
import { Dimensions } from './dimensions';
import { View } from './view';
import { Candle } from './elements/candle'; 
import { Time } from './time';
import { CandlePayload } from '../interfaces/candlestick';
import { Renderer } from './renderer/renderer';
import { Element } from './elements/element';

export class ChartManager {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private dimensions: Dimensions;
    private view: View;
    private time: Time;
    private renderer: Renderer;
    private candles: CandlePayload[];
    private lastRender?: number;

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
    
    private mouseDown: boolean;

    private frameLoop(time?: number): void {
        if(!this.lastRender || time - this.lastRender >= 16) {
            this.lastRender = time;
            Candle.resetHighLow();
            const elements = this.getRenderingElements();
            this.renderElements(elements);
            this.drawValueLines();
        }
        window.requestAnimationFrame(this.frameLoop.bind(this));
    }

    private getRenderingElements(): Set<Element[]> {
        return new ElementCollector(this.time, this.dimensions, this.view, this.candles, this.context).getElements();
    }

    private renderElements(elements: Set<Element[]>): void {
        this.renderer.draw(elements);
    }


    /**
     * MOVE THAT TO A RENDERING ELEMENT
     */
    private drawValueLines(): void {
        const { height } = this.dimensions.getDimensions();
        const [ currentMax, currentLow ] = Candle.getHighLow();

        let currentYZoom = 2;

        while((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom >= 10) {
            currentYZoom = currentYZoom * 2;
        }

        for(let horizontalLineOffset = Math.floor(currentMax); horizontalLineOffset >= currentLow; horizontalLineOffset = horizontalLineOffset - .5) {
            if(horizontalLineOffset <= currentMax && horizontalLineOffset >= currentLow) {

                if(Number(horizontalLineOffset.toFixed(2)) % currentYZoom === 0) {

                    const interpolation = this.interpolate(height - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);

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



    private interpolate(chartHeight: number, yToDraw: number, maxLowCandle: number, maxHighCandle: number): number {
        const interpolation = ((chartHeight) * (yToDraw - maxLowCandle)) / (maxHighCandle - maxLowCandle);
        if(interpolation > chartHeight / 2) {
            let diff = Math.abs(interpolation - chartHeight / 2);
            return chartHeight / 2 - diff;
        } else if (interpolation < chartHeight / 2) {
            let diff = Math.abs(interpolation - chartHeight / 2);
            return chartHeight / 2 + diff;
        } else {
            return interpolation;
        }
    }






















    private addCanvasListeners(): void {
        const graphWidth = this.dimensions.getWidth();
        // wheel event
        this.canvas.addEventListener('wheel', (event: WheelEvent) => {
            const zoomOffsetSyncValue = (graphWidth + this.view.getViewOffset() - this.dimensions.getHorizontalMargin() - event.offsetX) / this.view.getColInterval() * this.view.getScrollSpeed();

            if(event.deltaY > 0 && (this.view.getColInterval() - this.view.getScrollSpeed() > this.view.getMaxColInterval() || !this.time.checkIfMaxTimeSpan())) {
                this.view.setColInterval(this.view.getColInterval() - this.view.getScrollSpeed())
                this.view.setViewOffset(this.view.getViewOffset() - zoomOffsetSyncValue);

                this.view.setZoom(this.view.getZoom() - this.view.getScrollSpeed() * .02);
            } else if(event.deltaY < 0 && (!this.time.checkIfMinTimeSpan() || this.view.getColInterval() + this.view.getScrollSpeed() < this.view.getMaxColInterval() * 2)) {
                this.view.setColInterval(this.view.getColInterval() + this.view.getScrollSpeed());
                this.view.setViewOffset(this.view.getViewOffset() + zoomOffsetSyncValue);

                this.view.setZoom(this.view.getZoom() + this.view.getScrollSpeed() * .02);
            }

            if(this.view.getColInterval() <= this.view.getMaxColInterval()) {
                if(this.time.checkIfMaxTimeSpan()) {
                    return;
                }
                this.view.setColInterval(this.view.getMaxColInterval() * this.time.getPrevMaxDistanceRatio() - this.view.getScrollSpeed());
                this.view.setViewOffset(this.view.getViewOffset() - zoomOffsetSyncValue / this.time.getPrevMaxDistanceRatio());

                this.time.enlargeTimeSpan();

            } else if(this.view.getColInterval() >= this.view.getMaxColInterval() * this.time.getCurrentMaxDistanceRatio()) {
                this.view.setColInterval(this.view.getMaxColInterval() + this.view.getScrollSpeed());
                this.view.setViewOffset(this.view.getViewOffset() + zoomOffsetSyncValue * this.time.getCurrentMaxDistanceRatio());

                this.time.reduceTimeSpan();

            }

            this.blockViewOffset();
        })

        this.canvas.addEventListener('mouseout', (event: MouseEvent) => {
            this.mouseDown = false;
        });

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            this.mouseDown = true;
        })

        this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            this.mouseDown = false;
        })

        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if(this.view.getViewOffset() + event.movementX > 0 && this.mouseDown) {
                this.view.setViewOffset(this.view.getViewOffset() + event.movementX);
            }
        })
    }

    private blockViewOffset(): void {
        if(this.view.getViewOffset() <= 0) {
            this.view.setViewOffset(0);
        }
    }
}