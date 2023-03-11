import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { Candle } from "../../../core/src/chart/elements/candle";
import { NgxCandleChartAPIService } from "../../../services/ngx-candlechart-api.service";

@Component({
  standalone: true,
  selector: 'ngx-candlechart-tooltip',
  templateUrl: './ngx-candlechart-tooltip.component.html',
  styleUrls: ['ngx-candlechart-tooltip.component.scss'],
  imports: [
    CommonModule
  ]
})
export class NgxCandlechartTooltipComponent implements AfterViewInit {
  @Input() canvas?: HTMLCanvasElement;
  public candleData!: Candle;

  private boundingClientRect?: DOMRect;
  private toolboxElement?: HTMLElement;

  constructor(private chartAPI: NgxCandleChartAPIService, element: ElementRef, private cdRef: ChangeDetectorRef) {
    this.toolboxElement = element.nativeElement;
  }

  ngAfterViewInit(): void {
    this.boundingClientRect = this.canvas?.getBoundingClientRect();
    console.log(this.toolboxElement)
    this.chartAPI.candleHover$().subscribe(candle => this.updatePosition(candle))
  }

  private updatePosition(candle: Candle): void {
    this.candleData = candle;
    this.cdRef.detectChanges();

    if(this.toolboxElement && this.boundingClientRect) {
      this.toolboxElement.style.left = `${candle.getXStart()}px`;
      this.toolboxElement.style.top = `${candle.yDrawingStart}px`;
    }
  }
}
