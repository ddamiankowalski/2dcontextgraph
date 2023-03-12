import { Component } from "@angular/core";
import { NgxCandleChartAPIService } from "../../../../services/ngx-candlechart-api.service";
import { NgxCandlechartMenuButtonComponent } from "../menu-button/ngx-candlechart-menu-button.component";

@Component({
  standalone: true,
  selector: 'ngx-candlechart-menu-container',
  templateUrl: './ngx-candlechart-menu-container.component.html',
  styleUrls: ['ngx-candlechart-menu-container.component.scss'],
  imports: [
    NgxCandlechartMenuButtonComponent
  ]
})
export class NgxCandlechartMenuContainerComponent {
  constructor(private chartAPI: NgxCandleChartAPIService) {}

  public buttonClicked(): void {
    this.chartAPI.resetOffset();
  }
}
