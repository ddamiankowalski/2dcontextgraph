import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, switchMap } from 'rxjs/operators';
import { Chart } from "../core";
import { HttpClient } from '@angular/common/http';
import { CandlePayload } from "../core/src/interfaces/candlestick";
import { ChartManager } from "../core/src/chart/chart-manager";
import { Candle } from "../core/src/chart/elements/candle";

@Injectable()
export class NgxCandleChartAPIService {
  constructor(private ngZone: NgZone, private http: HttpClient) {}
  private ngxChart!: Chart;
  private ngxChartManager!: ChartManager;
  private ngxChartInitialized$ = new BehaviorSubject<boolean>(false);

  public initializeChart(canvas: HTMLCanvasElement, lineCanvas: HTMLCanvasElement): void {
    this.ngZone.runOutsideAngular(() => {
      this.ngxChart = new Chart(canvas, lineCanvas);
      this.ngxChartManager = this.ngxChart.getManager();

      this.getCandlesData().subscribe(candlesPayload => {
        this.ngxChart.loadCandles(candlesPayload, canvas);
        this.ngxChartInitialized$.next(true);
        this.ngxChartManager.startRendering();
      });
    });
  }

  public isChartInitialized$(): Observable<boolean> {
    return this.ngxChartInitialized$.asObservable();
  }

  public resetOffset(): void {
    console.log('reset')
    this.ngxChartManager.apiController.resetViewOffset();
  }

  public candleHover$(): Observable<Candle | null> {
    return this.ngxChartInitialized$.pipe(filter(initialized => initialized), switchMap(() => this.ngxChartManager.apiController.hoveredCandle$()))
  }

  public forceTooltipHide$(): Observable<boolean> {
    return this.ngxChartInitialized$.pipe(filter(initialized => initialized), switchMap(() => this.ngxChartManager.apiController.forceTooltipHide$()));
  }

  private getCandlesData(): Observable<CandlePayload[]> {
    return this.http.get<CandlePayload[]>('http://localhost:3000/candles');
  }
}
