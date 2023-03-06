import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgChartInterfaceBaseButtonComponent } from "../interface-buttons";

@Component({
    selector: 'ng-candlechart-interface',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      CommonModule,
      NgChartInterfaceBaseButtonComponent
    ],
    templateUrl: './chart-interface.component.html',
    styleUrls: ['./chart-interface.component.scss'],
})
export class NgCandleChartInterfaceComponent {
    constructor() {}
}