import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { NgxCandleChartTooltipService } from "../../../services/ngx-candlechart-tooltip.service";

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
  private toolboxElement?: HTMLElement;

  constructor(private tooltipService: NgxCandleChartTooltipService, element: ElementRef) {
    this.toolboxElement = element.nativeElement;
  }

  ngAfterViewInit(): void {
    this.tooltipService.hoveredCandle$?.subscribe(x => console.log(x));
    if(this.toolboxElement && this.toolboxElement.style) {
      this.toolboxElement.style.top = '0';
      this.toolboxElement.style.left = '0';
      this.toolboxElement.style.position = 'absolute';
    }
  }
}
