import { Renderer } from '../interfaces/renderer';
import { CanvasDimensions } from './canvas-dimensions';
import { ChartPosition } from './chart-position';
import { Candle } from './candle'; 
import { ChartTime } from './chart-time';
import { Candlestick } from '../interfaces/candlestick';
export class ChartRenderer implements Renderer {
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.initializeCanvasAndContext(context, canvas);
        this.scrollSpeed = 20;

        this.canvas.style.backgroundColor = "#252525";
        this.addCanvasListeners();
    }

    private dimensions: CanvasDimensions;
    private position: ChartPosition;
    private candles: Candle[];
    private time: ChartTime;

    private initializeCanvasAndContext(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.context = context;
        this.canvas = canvas;
        this.dimensions = new CanvasDimensions(this.canvas);
        this.position = new ChartPosition(300, 300);
        this.time = new ChartTime();
    }


    private context: CanvasRenderingContext2D | undefined;
    private canvas: HTMLCanvasElement | undefined;

    private horizontalMargin: number = 70;
    private verticalMargin: number = 70;
    private zoom: number = 1;
    
    private mouseDown: boolean;

    private scrollSpeed: number;

    public draw(candlesData: Candlestick[]): void {
        this.clearView();
        this.drawGrid(candlesData);
        window.requestAnimationFrame(this.draw.bind(this, candlesData));
    }

    private clearView(): void {
        this.candles = [];
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    }

    drawGrid(candlesData: Candlestick[]): void {
        this.position.resetCandleMaxValues();
        this.drawMainColumns(candlesData);
        this.drawTimeline();
    }

    private drawMainColumns(candlesData: Candlestick[]): void {
        const { width, height } = this.dimensions.getDimensions();
        let currentColumn = 0;
        for(let drawingOffset = width; drawingOffset + this.position.viewOffset > 0; drawingOffset = drawingOffset - this.position.colsDistance) { 
            const xDrawingPosition = drawingOffset + this.position.viewOffset - this.horizontalMargin;
            const [ yStartDrawingPosition, yEndDrawingPosition ] = [0, height - this.verticalMargin];
            currentColumn++;          

            if(xDrawingPosition > 0 && xDrawingPosition < width + this.position.colsDistance) {
                this.addCandlesInInterval(xDrawingPosition, candlesData, currentColumn);
                this.drawLine(xDrawingPosition, yStartDrawingPosition, xDrawingPosition, yEndDrawingPosition);
                this.drawSubLines(xDrawingPosition);      
            }
            this.drawTimeStamps(xDrawingPosition, currentColumn);
        }

        console.log(this.position.getMaxAndLow())
    }

    private addCandlesInInterval(xMainColumnDrawingPosition: number, candlesData: Candlestick[], currentColumn: number): void {
        const intervalCols = this.position.colsDistance / this.time.candlesInInterval();
        for(let candle = 0; candle < this.time.candlesInInterval(); candle++) {
            const currentCandleToRender = candlesData[candle + this.time.candlesInInterval() * (currentColumn - 1)];
            this.position.setCandleMaxHigh(currentCandleToRender);
            this.position.setCandleMaxLow(currentCandleToRender);

            this.candles.push(new Candle(xMainColumnDrawingPosition - candle * intervalCols, currentCandleToRender, this.zoom, this.position.getMaxAndLow(), this.context))
        }
    }

    private drawTimeStamps(xDrawingPosition: number, columnOffset: number): void {
        const yDrawingPosition = this.dimensions.getHeight() - 50;

        this.context.font = "8px sans-serif";
        this.context.fillStyle = '#A9A9A9';

        // the time should technically start with the first candle from a set of candles from backend, and should be updated each time a candle arrives.
        const date = new Date();
        date.setMinutes(date.getMinutes() - this.time.candlesInInterval() * (columnOffset - 1));
        this.context.fillText(`${date.getHours()}:${date.getMinutes()}`, xDrawingPosition - 10, yDrawingPosition);
    }

    private drawSubLines(xStartPosition: number): void {
        let drawingOffset = xStartPosition;
        const columnQuantity = 10;
        const gap = this.position.colsDistance / columnQuantity;
        const graphHeight = this.dimensions.getHeight();

        for(let currentSubLine = 0; currentSubLine < columnQuantity; currentSubLine++) {
            const actualXStart = drawingOffset - gap;
            this.drawLine(actualXStart, 0, actualXStart, graphHeight - this.verticalMargin, .2);
            drawingOffset = drawingOffset - gap;
        }
    }

    private drawTimeline(): void {
        const { width, height } = this.dimensions.getDimensions();
        this.context.font = "14px sans-serif";
        this.context.fillStyle = '#A9A9A9';
        this.context.fillText('Current time span in min: ' + `${this.time.getCurrentTimeSpan() / 1000 / 60}`, width / 2 - 100, height - 20);
    }

    drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number, lineWidth: number = 1): void {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.strokeStyle = '#A9A9A9';
        this.context.lineWidth = lineWidth;
        this.context.stroke();
    }

    private addCanvasListeners(): void {
        const graphWidth = this.dimensions.getWidth();
        // wheel event
        this.canvas.addEventListener('wheel', (event: WheelEvent) => {
            const zoomOffsetSyncValue = (graphWidth + this.position.viewOffset - this.horizontalMargin - event.offsetX) / this.position.colsDistance * this.scrollSpeed;

            if(event.deltaY > 0 && (this.position.colsDistance - this.scrollSpeed > this.position.maxColsDistance || !this.time.checkIfMaxTimeSpan())) {
                this.position.colsDistance = this.position.colsDistance - this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset - zoomOffsetSyncValue;

                this.zoom = this.zoom - .15;
            } else if(event.deltaY < 0 && (!this.time.checkIfMinTimeSpan() || this.position.colsDistance + this.scrollSpeed !== this.position.maxColsDistance * 2)) {
                this.position.colsDistance = this.position.colsDistance + this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset + zoomOffsetSyncValue;

                this.zoom = this.zoom + .15;
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