import { ChartTime } from '../chart-time';
import { CanvasDimensions } from '../canvas-dimensions';
import { ChartPosition } from '../chart-position';
import { Candlestick } from '../../interfaces/candlestick';
import { Candle } from '../candle';

export class RenderingElementsCollection {
    constructor(
        time: ChartTime,
        dimensions: CanvasDimensions,
        position: ChartPosition,
        candleData: Candlestick[],


        context: CanvasRenderingContext2D
    ) {
        this.time = time;
        this.dimensions = dimensions;
        this.position = position;
        this.candleData = candleData;

        this.context = context;

        this.createVerticalLines();
    }

    private renderingElements: Map<any, any> = new Map();
    private time: ChartTime;
    private dimensions: CanvasDimensions;
    private position: ChartPosition;
    private candleData: Candlestick[];
    
    private context: CanvasRenderingContext2D;

    private candles: Candle[] = [];

    public getCandles(): Candle[] {
        return this.candles;
    }

    /**
     * THIS SECTION SHOULD PROBABLY BE IN A SEPERATE CLASS
     */
    private createVerticalLines(): void {
        const { width: canvasWidth, height: canvasHeight } = this.dimensions.getDimensions();
        let currentColumn = 0;

        for(let xDrawingOffset = canvasWidth; xDrawingOffset + this.position.viewOffset > 0; xDrawingOffset = xDrawingOffset - this.position.colsDistance) { 
            const xDrawingPosition = xDrawingOffset + this.position.viewOffset - this.dimensions.getHorizontalMargin();
            const [ yStartDrawingPosition, yEndDrawingPosition ] = [ 0, canvasHeight - this.dimensions.getVerticalMargin() ];
            currentColumn++;          

            if(xDrawingPosition > 0 && xDrawingPosition < canvasWidth + this.position.colsDistance) {
                this.addCandlesInInterval(xDrawingPosition, this.candleData, currentColumn, canvasWidth);
                this.drawLine(xDrawingPosition, yStartDrawingPosition, xDrawingPosition, yEndDrawingPosition);
                this.drawSubLines(xDrawingPosition);      
            }
            this.drawTimeStamps(xDrawingPosition, currentColumn, this.candleData);
        }
    }

    private addCandlesInInterval(xMainColumnDrawingPosition: number, candlesData: Candlestick[], currentColumn: number, graphWidth: number): void {
        const distanceBetweenCandles = this.getIntervalCandleDistance();

        for(let candle = 0; candle < this.time.candlesInInterval(); candle++) {
            const currentCandleToRender = candlesData[candle + this.time.candlesInInterval() * (currentColumn - 1)];
            this.addCandleIfInView(xMainColumnDrawingPosition, candle, distanceBetweenCandles, graphWidth, currentCandleToRender);
        }
    }

    private getIntervalCandleDistance(): number {
        return this.position.colsDistance / this.time.candlesInInterval();
    }

    private addCandleIfInView(
        xMainColumnDrawingPosition: number, 
        candleNumInInterval: number, 
        distanceBetweenCandles: number, 
        graphWidth: number,
        currentCandleToRender: Candlestick
    ): void {
        if(
            xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles > 0 && 
            xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles < graphWidth - this.dimensions.getHorizontalMargin() + 10
        ) {
            this.candles.push(new Candle(xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles, currentCandleToRender, this.position.zoom))
        }
    }

    private drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number, lineWidth: number = 1): void {
        if(xStart <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            this.context.beginPath();
            this.context.moveTo(xStart, yStart);
            this.context.lineTo(xEnd, yEnd);
            this.context.strokeStyle = '#A9A9A9';
            this.context.lineWidth = lineWidth;
            this.context.stroke();
        }
    }

    private drawSubLines(xStartPosition: number): void {
        let drawingOffset = xStartPosition;
        const columnQuantity = 10;
        const gap = this.position.colsDistance / columnQuantity;
        const graphHeight = this.dimensions.getHeight();
        const verticalMargin = this.dimensions.getVerticalMargin();

        for(let currentSubLine = 0; currentSubLine < columnQuantity; currentSubLine++) {
            const actualXStart = drawingOffset - gap;
            this.drawLine(actualXStart, 0, actualXStart, graphHeight - verticalMargin, .2);
            drawingOffset = drawingOffset - gap;
        }
    }

    private drawTimeStamps(xDrawingPosition: number, columnOffset: number, candlesData: Candlestick[]): void {
        if(xDrawingPosition <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
            const yDrawingPosition = this.dimensions.getHeight() - this.dimensions.getVerticalMargin() + 16;
            this.context.font = "8px sans-serif";
            this.context.fillStyle = '#A9A9A9';
    
            // the time should technically start with the first candle from a set of candles from backend, and should be updated each time a candle arrives.
            const date = new Date(Date.parse(candlesData[0].time));
            date.setMinutes(date.getMinutes() - this.time.candlesInInterval() * (columnOffset - 1));
            this.context.fillText(`${date.getHours()}:${date.getMinutes()}`, xDrawingPosition - 10, yDrawingPosition);
        }
    }
}