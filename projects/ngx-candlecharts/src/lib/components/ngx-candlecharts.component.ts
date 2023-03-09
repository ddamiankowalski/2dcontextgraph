import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from '../core';

@Component({
  standalone: true,
  selector: 'ngx-candlechart',
  templateUrl: './ngx-candlechart.component.html',
})
export class NgxCandlechartsComponent implements AfterViewInit {
  @ViewChild('ngxCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  private ngxChart?: Chart;

  ngAfterViewInit(): void {
      this.ngxChart = new Chart(this.canvas.nativeElement);
      console.log(this.ngxChart)
  }
}
