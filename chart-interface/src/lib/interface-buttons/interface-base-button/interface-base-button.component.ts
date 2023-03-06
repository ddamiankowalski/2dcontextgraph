import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgCandleChartAPIService } from "../../ng-chart/services/candle-chart-api.service";

@Component({
    selector: 'ng-candlechart-base-button',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      CommonModule,
    ],
    templateUrl: './interface-base-button.component.html',
    styleUrls: ['./interface-base-button.component.scss'],
})
export class NgChartInterfaceBaseButtonComponent {
    constructor(public chartAPI: NgCandleChartAPIService) {}

    buttonClick(): void {
        this.chartAPI.resetViewOffset(1500);
    }
}