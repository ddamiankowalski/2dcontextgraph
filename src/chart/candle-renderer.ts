import { Candle } from './candle';

export class CandleRenderer {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    private context: CanvasRenderingContext2D;

    public draw(candles: Candle[], graphHeight: number): void {
        const [ maxHighCandle, maxLowCandle ] = Candle.getHighLow(); 

        candles.forEach(candle => {
            // 680 is the current height of the graph

            const yDrawingHigh = this.interpolate(graphHeight, candle.yHigh, maxLowCandle, maxHighCandle);
            const yDrawingLow = this.interpolate(graphHeight, candle.yLow, maxLowCandle, maxHighCandle);

            this.context.beginPath();
            this.context.moveTo(candle.xPosition, yDrawingHigh);
            this.context.lineTo(candle.xPosition, yDrawingLow);
            this.context.strokeStyle = '#ffff00';
            this.context.lineWidth = 1;
            this.context.stroke();

            const yDrawingStart = this.interpolate(graphHeight, candle.yStart, maxLowCandle, maxHighCandle);
            const yDrawingEnd = this.interpolate(graphHeight, candle.yEnd, maxLowCandle, maxHighCandle);

            this.context.beginPath();
            this.context.moveTo(candle.xPosition, yDrawingStart);
            this.context.lineTo(candle.xPosition, yDrawingEnd);
            this.context.strokeStyle = '#00ff00';
            this.context.lineWidth = 1 * candle.zoom + 1;
            this.context.stroke();
        })
    }

    private interpolate(chartHeight: number, yToDraw: number, maxLowCandle: number, maxHighCandle: number): number {
        return ((chartHeight) * (yToDraw - maxLowCandle)) / (maxHighCandle - maxLowCandle);
    }
}