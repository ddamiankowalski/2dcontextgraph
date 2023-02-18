import { Candle } from './candle';
import { CanvasDimensions } from './canvas-dimensions';
export class CandleRenderer {
    constructor(context: CanvasRenderingContext2D, dimensions: CanvasDimensions) {
        this.context = context;
        this.dimensions = dimensions;
    }

    private context: CanvasRenderingContext2D;
    private dimensions: CanvasDimensions;

    public draw(candles: Candle[], graphHeight: number): void {
        const [ maxHighCandle, maxLowCandle ] = Candle.getHighLow(); 

        candles.forEach(candle => {
            if(candle.xPosition <= this.dimensions.getWidth() - this.dimensions.getHorizontalMargin() + 10) {
                const yDrawingHigh = this.interpolate(graphHeight, candle.yHigh, maxLowCandle, maxHighCandle, graphHeight);
                const yDrawingLow = this.interpolate(graphHeight, candle.yLow, maxLowCandle, maxHighCandle, graphHeight);
    
                this.context.beginPath();
                this.context.moveTo(candle.xPosition, yDrawingLow);
                this.context.lineTo(candle.xPosition, yDrawingHigh);
                this.context.strokeStyle = '#ffff00';
                this.context.lineWidth = 1;
                this.context.stroke();
    
                const yDrawingStart = this.interpolate(graphHeight, candle.yStart, maxLowCandle, maxHighCandle, graphHeight);
                const yDrawingEnd = this.interpolate(graphHeight, candle.yEnd, maxLowCandle, maxHighCandle, graphHeight);
    
                this.context.beginPath();
                this.context.moveTo(candle.xPosition, yDrawingEnd);
                this.context.lineTo(candle.xPosition, yDrawingStart);
                this.context.strokeStyle = '#00ff00';
                this.context.lineWidth = 1 * candle.zoom + 1;
                this.context.stroke();
            }
        })
    }

    private interpolate(chartHeight: number, yToDraw: number, maxLowCandle: number, maxHighCandle: number, graphHeight: number): number {
        const interpolation = ((chartHeight) * (yToDraw - maxLowCandle)) / (maxHighCandle - maxLowCandle);
        // reflection, #TODO think about more optimized option
        if(interpolation > graphHeight / 2) {
            let diff = Math.abs(interpolation - graphHeight / 2);
            return graphHeight / 2 - diff;
        } else if (interpolation < graphHeight / 2) {
            let diff = Math.abs(interpolation - graphHeight / 2);
            return graphHeight / 2 + diff;
        } else {
            return interpolation;
        }
    }
}