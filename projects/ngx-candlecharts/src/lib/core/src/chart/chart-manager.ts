import { ElementCollector } from './elements/element-collector';
import { Dimensions } from './dimensions';
import { View } from './view';
import { Candle } from './elements/candle';
import { CandlePayload } from '../interfaces/candlestick';
import { Renderer } from './renderer/renderer';
import { EventManager } from './events/event-manager';
import { Wheel } from './events/wheel';
import { Mouseout } from './events/mouseout';
import { Mousedown } from './events/mousedown';
import { Mouseup } from './events/mouseup';
import { Mousemove } from './events/mousemove';
import { AnimationsManager } from './animations/animations-manager';
import { IViewConfig } from '../interfaces/view.interface';
import { ChartAPIController } from './api/api-controller';
import { Click } from './events/click';
import { IElements } from '../interfaces/elements';

export class ChartManager {
    public apiController!: ChartAPIController;

    private context: CanvasRenderingContext2D;
    private lineContext: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private lineCanvas: HTMLCanvasElement;

    private dimensions!: Dimensions;
    private view!: View;
    private renderer!: Renderer;
    private eventManager!: EventManager;
    private candles!: CandlePayload[];
    private lastRender!: number;
    private animations!: AnimationsManager;
    private elementCollector!: ElementCollector

    constructor(context: CanvasRenderingContext2D, lineContext: CanvasRenderingContext2D, canvas: HTMLCanvasElement, lineCanvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;
        this.lineCanvas = lineCanvas;
        this.lineContext = lineContext;

        this.setCanvasDimensions();
        this.setView();
        this.setRenderer();
        this.canvas.style.backgroundColor = "#191f2c";
    }

    public setCandles(candles: CandlePayload[]): void {
      Candle.findMaxLowInData(candles);
      this.candles = candles;
      this.setElementCollector();
      this.addCanvasListeners();
      this.setApiController();
    }

    private setElementCollector(): void {
      this.elementCollector = new ElementCollector(this.dimensions, this.view, this.candles);
    }

    private setApiController(): void {
      this.apiController = new ChartAPIController(this.view, this.dimensions, this.eventManager);
    }

    public startRendering(): void {
      this.requestNextFrame(0);
    }

    private setCanvasDimensions(): void {
        const [ horizontalMargin, verticalMargin ] = [ 75, 40 ];
        this.dimensions = new Dimensions(this.canvas, this.lineCanvas, horizontalMargin, verticalMargin);
    }

    private setView(): void {
        const viewConfig: IViewConfig = {
            intervalName: 'M1',
            intervalCandles: 60,
            intervalStep: 0,
            intervalColInit: 150,
            intervalColRatios: [150, 300, 600, 1200],
            intervalSubColRatios: [10, 5, 1, 1],
            viewOffset: 0
        }
        this.view = new View(viewConfig);
    }

    private setRenderer(): void {
        this.renderer = new Renderer(this.context, this.dimensions);
    }

    private addCanvasListeners(): void {
        this.eventManager = new EventManager(this.canvas);
        this.eventManager.listen(new Wheel(this.canvas, this.dimensions, this.view, this.eventManager));
        this.eventManager.listen(new Mouseout(this.eventManager));
        this.eventManager.listen(new Mousedown(this.eventManager));
        this.eventManager.listen(new Mouseup());
        this.eventManager.listen(new Mousemove(this.view, this.eventManager, this.elementCollector));
        this.eventManager.listen(new Click(this.eventManager, this.elementCollector));
    }

    private requestNextFrame(time: number): void {
        AnimationsManager.setCurrentTimeStamp(time);

        if(!this.lastRender || time && time - this.lastRender >= 16) {
            if(!this.lastRender || AnimationsManager.isRunning()) {
              this.runAllElements(time);
            }
            this.lineContext.clearRect(0, 0, this.dimensions.getWidth(), this.dimensions.getHeight());
        }

        this.runHoverLine();
        window.requestAnimationFrame(this.requestNextFrame.bind(this));
    }

    private runHoverLine(): void {
      if(EventManager.currentCandle) {
        this.lineContext.beginPath();
        this.lineContext.moveTo(EventManager.currentCandle.getXStart(), 0);
        this.lineContext.setLineDash([15, 15]);
        this.lineContext.lineTo(EventManager.currentCandle.getXStart(), this.dimensions.getHeight() - this.dimensions.getVerticalMargin());
        this.lineContext.strokeStyle = '#3fc5ea';
        this.lineContext.lineWidth = .2;
        this.lineContext.stroke();
      }
    }

    private runAllElements(time: number): void {
      this.lastRender = time ?? 0;
      this.elementCollector.setElements();
      const elements = this.getRenderingElements();
      this.renderElements(elements);
    }

    private getRenderingElements(): IElements {
        return this.elementCollector.getElements();
    }

    private renderElements(elements: IElements): void {
        AnimationsManager.update();
        this.renderer.draw(elements);
    }
}
