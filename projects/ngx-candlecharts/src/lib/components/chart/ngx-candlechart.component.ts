import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChartAPIController } from '../../core';
import { NgxCandleChartAPIService } from '../../services/ngx-candlechart-api.service';
import { NgxCandlechartMenuContainerComponent } from '../interface/menu/menu-container/ngx-candlechart-menu-container.component';
import { NgxCandlechartTooltipComponent } from '../interface/tooltip/ngx-candlechart-tooltip.component';

@Component({
  standalone: true,
  selector: 'ngx-candlechart',
  templateUrl: './ngx-candlechart.component.html',
  styleUrls: ['ngx-candlechart.component.scss'],
  imports: [
    NgxCandlechartTooltipComponent,
    NgxCandlechartMenuContainerComponent,
    HttpClientModule,
  ],
  providers: [
    NgxCandleChartAPIService
  ]
})
export class NgxCandlechartsComponent implements AfterViewInit {
  @ViewChild('ngxCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ngxLineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private chartAPI: NgxCandleChartAPIService) {
    this.chartAPI
  }

  private ngxChartApiController?: ChartAPIController;
  private chartResizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.chartAPI.initializeChart(this.canvas.nativeElement, this.lineCanvas.nativeElement);
  }

  private initializeApiController(apiController: ChartAPIController): void {
    this.ngxChartApiController = apiController;

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
