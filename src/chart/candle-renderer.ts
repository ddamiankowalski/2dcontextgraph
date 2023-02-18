import { Candle } from './candle';

export class CandleRenderer {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    private context: CanvasRenderingContext2D;

    public draw(candles: Candle[]): void {
        const [ maxHighCandle, maxLowCandle ] = Candle.getHighLow(); // high oznacza maksymalna wartosc na gorze, czyli jak gdyby 0 px, low oznacza maksymalna wartosc na dole, czyli jak gdyby 680
        /**
         * high === 0
         * low === 680
         */
        const chartMaxHeight = 680;
        const chartMinHeight = 0;

        
        candles.forEach(candle => {
            const yDrawingStart = this.interpolate(680, candle.yStart, maxLowCandle, maxHighCandle);
            const yDrawingEnd = this.interpolate(680, candle.yEnd, maxLowCandle, maxHighCandle);

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