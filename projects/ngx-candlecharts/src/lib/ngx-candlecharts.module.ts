import { NgModule } from '@angular/core';
import { NgxCandlechartsComponent } from './components/chart/ngx-candlechart.component';
import { NgxCandlechartTooltipComponent } from './components/interface/tooltip/ngx-candlechart-tooltip.component';
@NgModule({
  imports: [
    NgxCandlechartsComponent,
    NgxCandlechartTooltipComponent
  ],
  exports: [
    NgxCandlechartsComponent
  ]
})
export class NgxCandlechartsModule { }
