import { Dimensions } from '../dimensions';
import { View } from '../view';
import { CandlePayload } from '../../interfaces/candlestick';
import { Candle } from './candle';
import { Line } from './line';
import { Element } from './element';
import { Text } from './text';
import { MathUtils } from '../math-utils';

export class ElementCollector {
    constructor(
        dimensions: Dimensions,
        view: View,
        candleData: CandlePayload[],
        context: CanvasRenderingContext2D
    ) {
        this.dimensions = dimensions;
        this.view = view;
        this.candleData = candleData;
        this.context = context;
        this.setElements();
    }

    /**
     * a set of elements to render in the end
     */
    private renderingElementsSet: Set<Element[]> = new Set();

    private dimensions: Dimensions;
    private view: View;
    private candleData: CandlePayload[];
    
    private context: CanvasRenderingContext2D;

    private candles: Candle[] = [];
    private mainColumnLines: Line[] = [];
    private subColumnLines: Line[] = [];
    private text: Text[] = [];
    private horizontalLines: Line[] = [];

    public getElements(): Set<Element[]> {
        return this.renderingElementsSet;
    }

    private setElements(): void {
        const { width: canvasWidth, height: canvasHeight } = this.dimensions.getDimensions();
        let currentColumn = 0;

        for(let xDrawingOffset = canvasWidth; xDrawingOffset + this.view.getViewOffset() > 0; xDrawingOffset = xDrawingOffset - this.view.getColInterval()) { 
            const xDrawingPosition = xDrawingOffset + this.view.getViewOffset() - this.dimensions.getHorizontalMargin();
            const [ yStartDrawingPosition, yEndDrawingPosition ] = [ 0, canvasHeight - this.dimensions.getVerticalMargin() ];
            currentColumn++;          

            if(xDrawingPosition > 0 && xDrawingPosition < canvasWidth + this.view.getColInterval() * 2) {
                this.addCandlesInInterval(xDrawingPosition, this.candleData, currentColumn, canvasWidth);
                this.addMainColumnLine(xDrawingPosition, yStartDrawingPosition, yEndDrawingPosition);
                this.addTimeStamps(xDrawingPosition, currentColumn, this.candleData);
            }
        }

        this.addHorizontalLines();

        this.renderingElementsSet.add(this.subColumnLines);
        this.renderingElementsSet.add(this.mainColumnLines);
        this.renderingElementsSet.add(this.horizontalLines);
        this.renderingElementsSet.add(this.candles);
        this.renderingElementsSet.add(this.text);
    }

    private addMainColumnLine(xStart: number, yStart: number, yEnd: number): void {
        for(let x = 0; x < this.view.getColIntervalStep(); x++) {
            const renderXPosition = xStart - this.view.getMainColumnInterval() * x;
            this.mainColumnLines.push(new Line({ xStart: renderXPosition, xEnd: renderXPosition, yStart, yEnd }, { width: .4 }));
            this.addSubColumnLines(renderXPosition, yStart, yEnd);      
        }
    }

    private addCandlesInInterval(xMainColumnDrawingPosition: number, candlesData: CandlePayload[], currentColumn: number, graphWidth: number): void {
        const distanceBetweenCandles = this.getIntervalCandleDistance();

        for(let candle = 0; candle < 60; candle++) {
            const currentCandleToRender = candlesData[candle + 60 * (currentColumn - 1)];
            this.addCandleIfInView(xMainColumnDrawingPosition, candle, distanceBetweenCandles, graphWidth, currentCandleToRender);
        }
    }

    private getIntervalCandleDistance(): number {
        return this.view.getColInterval() / 60;
    }

    private addCandleIfInView(
        xMainColumnDrawingPosition: number, 
        candleNumInInterval: number, 
        distanceBetweenCandles: number, 
        graphWidth: number,
        currentCandleToRender: CandlePayload
    ): void {
        if(
            xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles > 0 && 
            xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles < graphWidth - this.dimensions.getHorizontalMargin() + 10
        ) {
            const candleXRenderPosition = xMainColumnDrawingPosition - candleNumInInterval * distanceBetweenCandles;
            this.candles.push(new Candle({ xStart: candleXRenderPosition }, { width: 1 }, currentCandleToRender, this.view.getZoom()))
        }
    }

    private addSubColumnLines(xStart: number, yStart: number, yEnd: number): void {

        const gap = this.view.getMainColumnInterval() / 15;

        for(let currentSubLine = 0; currentSubLine < 15; currentSubLine++) {
            const xRenderingStart = xStart - gap * currentSubLine;
            this.subColumnLines.push(new Line({ xStart: xRenderingStart, xEnd: xRenderingStart, yStart, yEnd }, { width: .1 }));
        }
    }

    private addTimeStamps(xStart: number, columnOffset: number, candlesData: CandlePayload[]): void {
            const yDrawingPosition = this.dimensions.getHeight() - this.dimensions.getVerticalMargin() + 23;
            const date = new Date(Date.parse(candlesData[0].time));
            date.setMinutes(date.getMinutes() - 60 * (columnOffset - 1));
            this.text.push(new Text({ xStart: xStart - 10, yStart: yDrawingPosition }, {}, `${date.getHours()}:${date.getMinutes()}`));

            let distanceBetweenCandle = this.view.getColInterval() / 60;
            let prevY = xStart

            for(let i = 0; i < 60; i++) {
                const drawingX = xStart - 10 - (distanceBetweenCandle + distanceBetweenCandle * i);
                
                if(!prevY || prevY - drawingX > 40 && xStart - drawingX < this.view.getColInterval() - 10) {
                    const date = new Date(Date.parse(candlesData[0].time));
                    date.setMinutes(date.getMinutes() - 60 * (columnOffset - 1) - i - 1);
                    this.text.push(new Text({ xStart: drawingX, yStart: yDrawingPosition }, {}, `${date.getHours()}:${date.getMinutes()}`));
                    prevY = drawingX;
                }
            }
    }

    private addHorizontalLines(): void {
        const { height } = this.dimensions.getDimensions();
        const [ currentMax, currentLow ] = Candle.getHighLow();

        let currentYZoom = 1;

        while((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom >= 10) {
            currentYZoom = currentYZoom * 2;
        }

        while((Math.floor(currentMax) - Math.floor(currentLow)) / currentYZoom <= 6) {
            currentYZoom = currentYZoom / 2;
        }

        for(let horizontalLineOffset = Math.floor(currentMax); horizontalLineOffset >= currentLow; horizontalLineOffset = horizontalLineOffset - .5) {
            if(horizontalLineOffset <= currentMax && horizontalLineOffset >= currentLow) {

                if(Number(horizontalLineOffset.toFixed(2)) % currentYZoom === 0) {
                    const interpolation = MathUtils.interpolate(height - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);
                    const xEnd = this.dimensions.getWidth() - this.dimensions.getHorizontalMargin();
                    this.horizontalLines.push(new Line({ xStart: 0, xEnd, yStart: interpolation, yEnd: interpolation }, { width: .1 }));
                    this.text.push(new Text({ xStart: this.dimensions.getWidth() - 55, yStart: interpolation + 6 }, {}, `${horizontalLineOffset.toFixed(2)}`));
                }
            }
        }
    }
}