import { ChartManager } from './chart-manager';
import { CandlePayload } from '../interfaces/candlestick';
import { ChartAPIController } from './api/api-controller';

export class Chart {
    constructor(canvas: HTMLCanvasElement, lineCanvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.lineCanvas = lineCanvas;
      this.context = this.getRenderingContext();
      this.lineContext = this.getLineRenderingContext();

      if(this.context && this.lineContext) {
        this.chartManager = new ChartManager(this.context, this.lineContext, canvas, lineCanvas)
      }
    }

    private canvas!: HTMLCanvasElement;
    private lineCanvas!: HTMLCanvasElement;
    private chartManager!: ChartManager;
    private context!: CanvasRenderingContext2D | null;
    private lineContext!: CanvasRenderingContext2D | null;

    public loadCandles(candles: CandlePayload[], canvas: HTMLCanvasElement): void {
        if(!candles.length) {
          throw new Error('Candles length equals to 0');
        }
        this.chartManager.setCandles(candles.reverse());
    }

    private getRenderingContext(): CanvasRenderingContext2D | null {
        if(window.HTMLCanvasElement) {
            return this.canvas.getContext('2d');
        }
        throw new Error('Canvas is not supported');
    }

    private getLineRenderingContext(): CanvasRenderingContext2D | null {
      if(window.HTMLCanvasElement) {
        return this.lineCanvas.getContext('2d');
      }
      throw new Error('Canvas is not supported');
    }

    public getManager(): ChartManager {
      return this.chartManager;
    }
}
