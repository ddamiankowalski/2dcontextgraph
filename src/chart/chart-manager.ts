import { ElementCollector } from './elements/element-collector';
import { ChartDimensions } from './chart-dimensions';
import { ChartPosition } from './chart-position';
import { Candle } from './elements/candle'; 
import { ChartTime } from './chart-time';
import { Candlestick } from '../interfaces/candlestick';
import { Renderer } from './renderer/renderer';
import { Element } from './elements/element';

export class ChartManager {
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.initializeCanvasAndContext(context, canvas);
        this.addCanvasListeners();
        this.scrollSpeed = 10;
        this.canvas.style.backgroundColor = "#252525";
    }

    private dimensions: ChartDimensions;
    private position: ChartPosition;
    private time: ChartTime;
    private renderer: Renderer;

    private candleData: Candlestick[];

    private initializeCanvasAndContext(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.context = context;
        this.canvas = canvas;
        this.dimensions = new ChartDimensions(this.canvas, 70, 40);
        this.position = new ChartPosition(350, 300, 1);
        this.time = new ChartTime();
        this.renderer = new Renderer(this.context, this.dimensions);
    }

    private context: CanvasRenderingContext2D | undefined;
    private canvas: HTMLCanvasElement | undefined;
    
    private mouseDown: boolean;

    private candlesCalculated: boolean = false;

    private scrollSpeed: number;

    public draw(candlesData: Candlestick[]): void {
        if(!this.candlesCalculated) {
            Candle.findMaxLowInData(candlesData);
            this.candlesCalculated = true;
        }

        this.clearView();
        this.candleData = candlesData;
        const elements = this.getRenderingElements();
        this.renderElements(elements);
        this.drawValueLines();
        window.requestAnimationFrame(this.draw.bind(this, candlesData));
    }

    private clearView(): void {
        Candle.resetHighLow();
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    }

    private getRenderingElements(): Set<Element[]> {
        return new ElementCollector(this.time, this.dimensions, this.position, this.candleData, this.context).getElements();
    }

    private renderElements(elements: Set<Element[]>): void {
        this.renderer.draw(elements);
    }


    private static prevY: number | null;
    /**
     * MOVE THAT TO A RENDERING ELEMENT
     */
    private drawValueLines(): void {
        const { width, height } = this.dimensions.getDimensions();
        const [ maxHigh, maxLow ] = Candle.getMaxLowInData();
        const [ currentMax, currentLow ] = Candle.getHighLow();

        //console.log('current max low', currentMax, currentLow);
        //console.log('max low high', maxHigh, maxLow)

        const heightOfDrawingArea = height - this.dimensions.getVerticalMargin();
        const diffInValueViewArea = currentMax - currentLow;
        const diffInValueFullArea = maxHigh - maxLow;

        const graphStartArea = 0; // this should be mapped to currentMax

        ChartManager.prevY = null;

        for(let horizontalLineOffset = currentMax; horizontalLineOffset >= currentLow; horizontalLineOffset = horizontalLineOffset - 1) {
            if(horizontalLineOffset <= currentMax && horizontalLineOffset >= currentLow) {
                const interpolation = this.interpolate(height - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);

                if(ChartManager.prevY === undefined || interpolation - ChartManager.prevY > 30) {
                    this.context.beginPath();
                    this.context.moveTo(0, interpolation);
                    this.context.lineTo(this.dimensions.getWidth() - this.dimensions.getHorizontalMargin(), interpolation);
                    this.context.strokeStyle = '#A9A9A9';
                    this.context.lineWidth = .1;
                    this.context.stroke();
    
                    this.context.font = "10px sans-serif";
                    this.context.fillStyle = '#A9A9A9';
                    this.context.fillText(horizontalLineOffset.toString(), this.dimensions.getWidth() - 50, interpolation + 10);
    
                    ChartManager.prevY = interpolation;
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
            const zoomOffsetSyncValue = (graphWidth + this.position.viewOffset - this.dimensions.getHorizontalMargin() - event.offsetX) / this.position.colsDistance * this.scrollSpeed;

            if(event.deltaY > 0 && (this.position.colsDistance - this.scrollSpeed > this.position.maxColsDistance || !this.time.checkIfMaxTimeSpan())) {
                this.position.colsDistance = this.position.colsDistance - this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset - zoomOffsetSyncValue;

                this.position.zoom = this.position.zoom - .15;
            } else if(event.deltaY < 0 && (!this.time.checkIfMinTimeSpan() || this.position.colsDistance + this.scrollSpeed !== this.position.maxColsDistance * 2)) {
                this.position.colsDistance = this.position.colsDistance + this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset + zoomOffsetSyncValue;

                this.position.zoom = this.position.zoom + .15;
            }

            if(this.position.colsDistance <= this.position.maxColsDistance) {
                if(this.time.checkIfMaxTimeSpan()) {
                    return;
                }
                this.position.colsDistance = this.position.maxColsDistance * this.time.getPrevMaxDistanceRatio() - this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset - zoomOffsetSyncValue / this.time.getPrevMaxDistanceRatio();

                this.time.enlargeTimeSpan();

            } else if(this.position.colsDistance >= this.position.maxColsDistance * this.time.getCurrentMaxDistanceRatio()) {
                this.position.colsDistance = this.position.maxColsDistance + this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset + zoomOffsetSyncValue * this.time.getCurrentMaxDistanceRatio();

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
            if(this.position.viewOffset + event.movementX > 0 && this.mouseDown) {
                this.position.viewOffset = this.position.viewOffset + event.movementX;
            }
        })
    }

    private blockViewOffset(): void {
        if(this.position.viewOffset <= 0) {
            this.position.viewOffset = 0;
        }
    }
}