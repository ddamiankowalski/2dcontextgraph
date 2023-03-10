import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartAPIController } from '../core';

@Component({
  standalone: true,
  selector: 'ngx-candlechart',
  templateUrl: './ngx-candlechart.component.html',
})
export class NgxCandlechartsComponent implements AfterViewInit {
  @ViewChild('ngxCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  private ngxChart?: Chart;
  private ngxChartApiController?: ChartAPIController;

  ngAfterViewInit(): void {
      this.ngxChart = new Chart(this.canvas.nativeElement);
      this.ngxChartApiController = this.ngxChart.getApiController();
      console.log(this.ngxChartApiController)
  }
}
