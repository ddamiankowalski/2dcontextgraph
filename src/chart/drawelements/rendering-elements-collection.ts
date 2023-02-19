import { ChartTime } from '../chart-time';
import { CanvasDimensions } from '../canvas-dimensions';
import { ChartPosition } from '../chart-position';
import { Candlestick } from '../../interfaces/candlestick';
import { Candle } from './candle';
import { Line } from './line';
import { RenderElement } from './render-element';
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
        this.setElements();
    }

    /**
     * a set of elements to render in the end
     */
    private renderingElementsSet: Set<RenderElement[]> = new Set();

    private time: ChartTime;
    private dimensions: CanvasDimensions;
    private position: ChartPosition;
    private candleData: Candlestick[];
    
    private context: CanvasRenderingContext2D;

    private candles: Candle[] = [];
    private mainColumnLines: Line[] = [];
    private subColumnLines: Line[] = [];

    public getCandles(): Candle[] {
        return this.candles;
    }

    public getElements(): Set<RenderElement[]> {
        return this.renderingElementsSet;
    }

    private setElements(): void {
        const { width: canvasWidth, height: canvasHeight } = this.dimensions.getDimensions();
        let currentColumn = 0;

        for(let xDrawingOffset = canvasWidth; xDrawingOffset + this.position.viewOffset > 0; xDrawingOffset = xDrawingOffset - this.position.colsDistance) { 
            const xDrawingPosition = xDrawingOffset + this.position.viewOffset - this.dimensions.getHorizontalMargin();
            const [ yStartDrawingPosition, yEndDrawingPosition ] = [ 0, canvasHeight - this.dimensions.getVerticalMargin() ];
            currentColumn++;          

            if(xDrawingPosition > 0 && xDrawingPosition < canvasWidth + this.position.colsDistance) {
                this.addCandlesInInterval(xDrawingPosition, this.candleData, currentColumn, canvasWidth);
                this.addMainColumnLine(xDrawingPosition, yStartDrawingPosition, yEndDrawingPosition);
                this.addSubColumnLines(xDrawingPosition, yStartDrawingPosition, yEndDrawingPosition);      
            }
            this.drawTimeStamps(xDrawingPosition, currentColumn, this.candleData);
        }

        this.renderingElementsSet.add(this.mainColumnLines);
        this.renderingElementsSet.add(this.subColumnLines);
        this.renderingElementsSet.add(this.candles);
    }

    private addMainColumnLine(xStart: number, yStart: number, yEnd: number): void {
        this.mainColumnLines.push(new Line({ xStart, xEnd: xStart, yStart, yEnd }, { color: '#ff0000' }));
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
            const candleXRenderPosition = xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles;
            this.candles.push(new Candle({ xStart: candleXRenderPosition }, {}, currentCandleToRender, this.position.zoom))
        }
    }

    private addSubColumnLines(xStart: number, yStart: number, yEnd: number): void {
        let drawingOffset = xStart;
        const columnQuantity = 10;
        const gap = this.position.colsDistance / columnQuantity;

        for(let currentSubLine = 0; currentSubLine < columnQuantity; currentSubLine++) {
            const xStart = drawingOffset - gap;
            this.subColumnLines.push(new Line({ xStart, xEnd: xStart, yStart, yEnd }, {}));
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