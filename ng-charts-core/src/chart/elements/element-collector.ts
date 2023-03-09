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
    ) {
        this.dimensions = dimensions;
        this.view = view;
        this.candleData = candleData;
    }

    private renderingElementsSet: Set<Element[]> = new Set();

    private dimensions: Dimensions;
    private view: View;
    private candleData: CandlePayload[];
    private candles: Candle[] = [];
    private mainColumnLines: Line[] = [];
    private subColumnLines: Line[] = [];
    private text: Text[] = [];
    private horizontalLines: Line[] = [];

    public getElements(): Set<Element[]> {
        return this.renderingElementsSet;
    }

    public resetElements(): void {
        this.renderingElementsSet =  new Set();
        this.candles = [];
        this.mainColumnLines = [];
        this.subColumnLines = [];
        this.text = [];
        this.horizontalLines = [];
    }

    public getCandles(): Candle[] {
        return this.candles;
    }

    public setElements(): void {
        const canvasWidth = this.dimensions.getWidth();
        let currentColumn = 0;

        for(let xDrawingOffset = canvasWidth; xDrawingOffset + this.view.getViewOffset() > 0; xDrawingOffset = xDrawingOffset - this.view.getColInterval()) { 
            const xDrawingPosition = xDrawingOffset + this.view.getViewOffset() - this.dimensions.getHorizontalMargin();
            currentColumn++;          

            if(xDrawingPosition > 0 && xDrawingPosition < canvasWidth + this.view.getColInterval() * 2) {
                this.addCandlesInInterval(xDrawingPosition, this.candleData, currentColumn, canvasWidth);
                this.addTimeStamps(xDrawingPosition, currentColumn, this.candleData);
            }
        }
        this.addHorizontalLines();

        this.renderingElementsSet.add(this.text);
        this.renderingElementsSet.add(this.subColumnLines);
        this.renderingElementsSet.add(this.mainColumnLines);
        this.renderingElementsSet.add(this.horizontalLines);
        this.renderingElementsSet.add(this.candles);
    }

    private addCandlesInInterval(xMainColumnDrawingPosition: number, candlesData: CandlePayload[], currentColumn: number, graphWidth: number): void {
        const distanceBetweenCandles = this.getIntervalCandleDistance();
        const candlesInInterval = this.view.getIntervalCandles();

        for(let candle = 0; candle < candlesInInterval; candle++) {
            const currentCandleToRender = candlesData[candle + candlesInInterval * (currentColumn - 1)];
            this.addCandleIfInView(xMainColumnDrawingPosition, candle, distanceBetweenCandles, graphWidth, currentCandleToRender);
        }
    }

    private getIntervalCandleDistance(): number {
        return this.view.getColInterval() / this.view.getIntervalCandles();
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
            this.candles.push(new Candle({ xStart: candleXRenderPosition }, { width: this.view.getColInterval() / 100 }, currentCandleToRender));

            const mainColumnDivider = this.view.getDivider();
            const mainColumnLineInterval = this.view.getIntervalCandles() / mainColumnDivider;
            
            if(candleNumInInterval % this.view.getSubColRatio() === 0) {
                this.subColumnLines.push(new Line({ xStart: candleXRenderPosition, xEnd: candleXRenderPosition, yStart: 0, yEnd: this.dimensions.getHeight() - this.dimensions.getVerticalMargin() }, { width: .1 }));
            }

            if(candleNumInInterval % mainColumnLineInterval === 0) {
                this.mainColumnLines.push(new Line({ xStart: candleXRenderPosition, xEnd: candleXRenderPosition, yStart: 0, yEnd: this.dimensions.getHeight() - this.dimensions.getVerticalMargin() }, { width: .3 }));
            }
        }
    }

    private addTimeStamps(xStart: number, columnOffset: number, candlesData: CandlePayload[]): void {
            const yDrawingPosition = this.dimensions.getHeight() - this.dimensions.getVerticalMargin() + 23;
            const date = new Date(Date.parse(candlesData[0].time));
            date.setMinutes(date.getMinutes() - this.view.getIntervalCandles() * (columnOffset - 1));
            this.text.push(new Text({ xStart: xStart - 10, yStart: yDrawingPosition }, {}, `${date.getHours()}:${date.getMinutes()}`));

            const distanceBetweenCandle = this.view.getColInterval() / this.view.getIntervalCandles();
            let prevY = xStart

            for(let i = 0; i < this.view.getIntervalCandles(); i++) {
                const drawingX = xStart - 10 - (distanceBetweenCandle + distanceBetweenCandle * i);
                
                if(!prevY || prevY - drawingX > 40 && xStart - drawingX < this.view.getColInterval() - 10) {
                    const date = new Date(Date.parse(candlesData[0].time));
                    date.setMinutes(date.getMinutes() - this.view.getIntervalCandles() * (columnOffset - 1) - i - 1);
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
                    const interpolation = MathUtils.interpolate((height ?? 0) - this.dimensions.getVerticalMargin(), horizontalLineOffset, currentLow, currentMax);
                    const xEnd = this.dimensions.getWidth() - 60;
                    this.horizontalLines.push(new Line({ xStart: 0, xEnd, yStart: interpolation, yEnd: interpolation }, { width: .1 }));
                    this.text.push(new Text({ xStart: this.dimensions.getWidth() - 50, yStart: interpolation + 6 }, {}, `${horizontalLineOffset.toFixed(2)}`));
                }
            }
        }
    }
}