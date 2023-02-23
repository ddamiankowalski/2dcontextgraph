import { Candle } from '../elements/candle';
import { Dimensions } from '../dimensions';
export class CandleRenderer {
    public draw(candle: Candle, dimensions: Dimensions, context: CanvasRenderingContext2D): void {
        const [ maxHighCandle, maxLowCandle ] = Candle.getHighLow(); 
        const graphHeight = dimensions.getHeight() - dimensions.getVerticalMargin();

        if(candle.getXStart() <= dimensions.getWidth() - dimensions.getHorizontalMargin() + 10) {
            const yDrawingHigh = this.interpolate(graphHeight, candle.yHigh, maxLowCandle, maxHighCandle);
            const yDrawingLow = this.interpolate(graphHeight, candle.yLow, maxLowCandle, maxHighCandle);
    
            context.beginPath();
            context.moveTo(candle.getXStart(), yDrawingLow);
            context.lineTo(candle.getXStart(), yDrawingHigh);
            context.strokeStyle = candle.getColor();
            context.lineWidth = 1;
            context.stroke();


            const yDrawingStart = this.interpolate(graphHeight, candle.getYStart(), maxLowCandle, maxHighCandle);
            const yDrawingEnd = this.interpolate(graphHeight, candle.getYEnd(), maxLowCandle, maxHighCandle);
    
            context.beginPath();
            context.roundRect(candle.getXStart() - (1 * candle.zoom + 1) / 2, yDrawingEnd, 1 * candle.zoom + 1, yDrawingStart - yDrawingEnd, 1)
            context.fillStyle = candle.getColor();
            context.stroke();
            context.fill();
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
}