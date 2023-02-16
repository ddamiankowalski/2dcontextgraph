import { Renderer } from '../interfaces/renderer';
import { CanvasDimensions } from './canvas-dimensions';
import { ChartPosition } from './chart-position';
import { Candle } from './candle'; 
import { ChartTime } from './chart-time';
export class ChartRenderer implements Renderer {
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.initializeCanvasAndContext(context, canvas);
        this.scrollSpeed = 10;

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
    private currentTimeSpanMult: number = 1;

    private candlesInInterval: number = 60;

    private startTime: number = new Date().getTime();
    
    private mouseDown: boolean;

    private scrollSpeed: number;

    public draw(timePassed: number): void {
        this.clearView();
        this.drawGrid();
        window.requestAnimationFrame(this.draw.bind(this));
    }

    private clearView(): void {
        this.candles = [];
        this.context.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
    }

    drawGrid(): void {
        this.drawMainColumns();
        this.drawTimeline();
    }

    private drawMainColumns(): void {
        const { width, height } = this.dimensions.getDimensions();
        let currentColumn = 0;
        for(let drawingOffset = width; drawingOffset + this.position.viewOffset > 0; drawingOffset = drawingOffset - this.position.colsDistance) { 
            const xDrawingPosition = drawingOffset + this.position.viewOffset - this.horizontalMargin;
            const [ yStartDrawingPosition, yEndDrawingPosition ] = [0, height - this.verticalMargin];
            


            if(xDrawingPosition > 0 && xDrawingPosition < width + this.position.colsDistance) {
                this.addCandles(xDrawingPosition);
                this.drawLine(xDrawingPosition, yStartDrawingPosition, xDrawingPosition, yEndDrawingPosition);
                this.drawSubLines(xDrawingPosition);      
                currentColumn++;          
            }
            this.drawLineTime(currentColumn);
        }
    }

    private addCandles(xMainColumnDrawingPosition: number): void {
        const intervalCols = this.position.colsDistance / this.candlesInInterval;
        for(let candle = 0; candle < this.candlesInInterval; candle++) {
            this.candles.push(new Candle(xMainColumnDrawingPosition - candle * intervalCols, this.context))
        }
    }

    private drawLineTime(columnOffset: number): void {
        const yDrawingPosition = this.dimensions.getHeight() - 50;

        this.context.font = "8px sans-serif";
        this.context.fillStyle = '#A9A9A9';

        for(let currentLineTime = 0; currentLineTime < this.candles.length; currentLineTime++) {
            if(currentLineTime === 0 || currentLineTime % 60 === 0) {
                if(columnOffset) {
                    const dateToRender = this.time.getTime(columnOffset);
                    this.context.fillText(dateToRender, this.candles[currentLineTime].getXPosition() - 10, yDrawingPosition);
                }
            }
        }        
    }

    private drawSubLines(xStartPosition: number): void {
        let drawingOffset = xStartPosition;
        const columnQuantity = 3;
        const gap = this.position.colsDistance / columnQuantity;
        const graphHeight = this.dimensions.getHeight();

        for(let currentSubLine = 0; currentSubLine < columnQuantity; currentSubLine++) {
            const actualXStart = drawingOffset - gap;
            this.drawLine(actualXStart, 0, actualXStart, graphHeight - this.verticalMargin);
            drawingOffset = drawingOffset - gap;
        }
    }

    private updateColumns(columnNumber: number, xPosition: number): void {
        // here inside chart line we will probably mock a random candle and preview it
        //this.candles.push(new Candle(columnNumber, xPosition, this.context));
    }

    private drawTimeline(): void {
        const { width, height } = this.dimensions.getDimensions();
        this.context.font = "12px sans-serif";
        this.context.fillStyle = '#A9A9A9';
        this.context.fillText(this.startTime.toString(), width - 100, height - 20);
        this.context.fillText('Current time span in min: ' + (this.time.getCurrentTimeSpan() / 1000 / 60), width / 2 - 100, height - 20);
    }

    drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.strokeStyle = '#A9A9A9';
        this.context.lineWidth = 1;
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
            } else if(event.deltaY < 0 && (!this.time.checkIfMinTimeSpan() || this.position.colsDistance + this.scrollSpeed !== this.position.maxColsDistance * 2)) {
                this.position.colsDistance = this.position.colsDistance + this.scrollSpeed;
                this.position.viewOffset = this.position.viewOffset + zoomOffsetSyncValue;
            }

            if(this.position.colsDistance === this.position.maxColsDistance) {
                if(this.time.checkIfMaxTimeSpan()) {
                    return;
                }
                this.position.colsDistance = this.position.maxColsDistance * 2 - this.scrollSpeed;
                this.time.enlargeTimeSpan();
                this.position.viewOffset = this.position.viewOffset - zoomOffsetSyncValue / 2;
                this.currentTimeSpanMult = this.currentTimeSpanMult * 2;
                this.candlesInInterval = this.candlesInInterval * 2;

            } else if(this.position.colsDistance === this.position.maxColsDistance * 2) {
                // if(this.currentTimeSpan === 1800000) {
                //     return;
                // }
                this.position.colsDistance = this.position.maxColsDistance + this.scrollSpeed;
                this.time.reduceTimeSpan();
                this.position.viewOffset = this.position.viewOffset + zoomOffsetSyncValue * 2;
                this.currentTimeSpanMult = this.currentTimeSpanMult / 2;

                console.log('zoomed in, currentoffsetview: ', this.position.viewOffset)
                this.candlesInInterval = this.candlesInInterval / 2;
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