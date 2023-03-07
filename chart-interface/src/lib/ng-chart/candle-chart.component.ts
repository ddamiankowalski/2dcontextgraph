import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Chart } from '@kowalskiddamian/chart-core';
import { NgCandleChartInterfaceComponent } from '../ng-chart-interface/chart-interface.component';
import { NgCandleChartAPIService } from './services/candle-chart-api.service';

@Component({
  selector: 'ng-candlechart',
  standalone: true,
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
  private document?: Document;
  private chartId: number;

  constructor(
    @Inject(DOCUMENT) document: Document,
    public chartAPI: NgCandleChartAPIService
  ) {
    this.document = document;
    this.chartId = NgCandleChartComponent.chartNum++;
  }

  public ngAfterViewInit(): void {
    this.chartCanvas.nativeElement.classList.add(`ng-chart-id-${this.chartId}`);

    if(this.document) {
      this.chartEngine = new Chart(this.chartCanvas.nativeElement);
      setTimeout(() => {
        if(this.chartEngine) {
          this.chartAPI.bindController(this.chartEngine);
        }
      }, 200);
    } else {
      throw new Error('Chart engine could not be initialized');
    }
  }
}
