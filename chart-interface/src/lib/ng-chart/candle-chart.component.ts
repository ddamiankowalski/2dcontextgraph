import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from '@kowalskiddamian/chart-core';
import { NgCandleChartInterfaceComponent } from '../ng-chart-interface/chart-interface.component';
import { NgCandleChartAPIService } from './services/candle-chart-api.service';

@Component({
  selector: 'ng-candlechart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgCandleChartInterfaceComponent
  ],
  templateUrl: './candle-chart.component.html',
  styleUrls: ['./candle-chart.component.scss'],
})
export class NgCandleChartComponent implements AfterViewInit {
  private static chartNum = 0;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartEngine?: Chart;
  private chartId: number;

  constructor(
    public chartAPI: NgCandleChartAPIService,
    private ngZone: NgZone
  ) {
    this.chartId = NgCandleChartComponent.chartNum++;
  }

  public ngAfterViewInit(): void {
    this.chartCanvas.nativeElement.classList.add(`ng-chart-id-${this.chartId}`);
    this.ngZone.runOutsideAngular(() => {
      this.chartEngine = new Chart(this.chartCanvas.nativeElement);
      
      this.chartEngine.observeCandles$().subscribe(() => {
        if(this.chartEngine) {
          this.chartAPI.bindController(this.chartEngine);
        }
      })
    });
  }
}
