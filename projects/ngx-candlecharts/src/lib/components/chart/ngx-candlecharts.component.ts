import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Chart, ChartAPIController } from '../../core';
import { NgxCandleChartTooltipService } from '../../services/ngx-candlechart-tooltip.service';
import { NgxCandlechartTooltipComponent } from '../interface/tooltip/ngx-candlechart-tooltip.component';

@Component({
  standalone: true,
  selector: 'ngx-candlechart',
  templateUrl: './ngx-candlechart.component.html',
  styleUrls: ['ngx-candlechart.component.scss'],
  imports: [
    NgxCandlechartTooltipComponent
  ],
  providers: [
    NgxCandleChartTooltipService
  ]
})
export class NgxCandlechartsComponent implements AfterViewInit {
  @ViewChild('ngxCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private ngZone: NgZone, private tooltipService: NgxCandleChartTooltipService) {
    this.tooltipService
  }

  private ngxChart?: Chart;
  private ngxChartApiController?: ChartAPIController;
  private chartResizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
      this.ngZone.runOutsideAngular(() => {
        this.ngxChart = new Chart(this.canvas.nativeElement);
        this.ngxChart.chartInitialized$.pipe(take(1)).subscribe(apiController => this.initializeApiController(apiController));
      });
  }

  private initializeApiController(apiController: ChartAPIController): void {
    this.ngxChartApiController = apiController;
    this.tooltipService.hoveredCandle$ = apiController.hoveredCandle$().pipe(distinctUntilChanged());

    this.chartResizeObserver = new ResizeObserver((resize) => this.resizeChart(resize));
    this.chartResizeObserver?.observe(this.canvas.nativeElement);
  }

  private resizeChart(resize: ResizeObserverEntry[]): void {
    const [ canvasEntry ] = resize;
    if(this.ngxChartApiController) {
      this.ngxChartApiController.resizeCanvas(canvasEntry);
    }
  }
}
