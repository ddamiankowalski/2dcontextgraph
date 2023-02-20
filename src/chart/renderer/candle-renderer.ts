import { Candle } from '../elements/candle';
import { ChartDimensions } from '../chart-dimensions';
export class CandleRenderer {
    public draw(candle: Candle, dimensions: ChartDimensions, context: CanvasRenderingContext2D): void {
        const [ maxHighCandle, maxLowCandle ] = Candle.getHighLow(); 
        const graphHeight = dimensions.getHeight() - dimensions.getVerticalMargin();

        if(candle.getXStart() <= dimensions.getWidth() - dimensions.getHorizontalMargin() + 10) {
            const yDrawingHigh = this.interpolate(graphHeight, candle.yHigh, maxLowCandle, maxHighCandle, graphHeight, dimensions);
            const yDrawingLow = this.interpolate(graphHeight, candle.yLow, maxLowCandle, maxHighCandle, graphHeight, dimensions);
    
            context.beginPath();
            context.moveTo(candle.getXStart(), yDrawingLow);
            context.lineTo(candle.getXStart(), yDrawingHigh);
            context.strokeStyle = '#ffff00';
            context.lineWidth = 1;
            context.stroke();


            const yDrawingStart = this.interpolate(graphHeight, candle.getYStart(), maxLowCandle, maxHighCandle, graphHeight, dimensions);
            const yDrawingEnd = this.interpolate(graphHeight, candle.getYEnd(), maxLowCandle, maxHighCandle, graphHeight, dimensions);
    
            context.beginPath();
            context.moveTo(candle.getXStart(), yDrawingEnd);
            context.lineTo(candle.getXStart(), yDrawingStart);
            context.strokeStyle = '#00ff00';
            context.lineWidth = 1 * candle.zoom + 1;
            context.stroke();
        }
    }

    private interpolate(chartHeight: number, yToDraw: number, maxLowCandle: number, maxHighCandle: number, graphHeight: number, dimensions: ChartDimensions): number {
        const verticalMargin = dimensions.getVerticalMargin() / 2;
        const interpolation = ((chartHeight - verticalMargin) * (yToDraw - maxLowCandle)) / (maxHighCandle - maxLowCandle);
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