import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { debounceTime } from "rxjs/operators";
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
    this.chartAPI.candleHover$().pipe(debounceTime(100)).subscribe(candle => this.updatePosition(candle))
    this.chartAPI.forceTooltipHide$().subscribe(() => this.forceTooltipHide())
  }

  private updatePosition(candle: Candle | null): void {
    if(!candle && this.toolboxElement) {
      this.toolboxElement.style.opacity = '0';
      return;
    } else if (candle && this.toolboxElement) {
      this.candleData = candle;

      if(this.boundingClientRect) {
        this.toolboxElement.style.opacity = '1';
        this.toolboxElement.style.transform = `translate(${candle.getXStart() + 25}px, ${candle.yDrawingStart ?? 0 + 25}px)`;
      }

      this.cdRef.detectChanges();
    }
  }

  private forceTooltipHide(): void {
    const animations = this.toolboxElement?.getAnimations();
    animations?.forEach(animation => animation.cancel());
  }
}
