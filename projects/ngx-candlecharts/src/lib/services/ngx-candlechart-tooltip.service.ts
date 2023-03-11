import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Candle } from "../core/src/chart/elements/candle";

@Injectable()
export class NgxCandleChartTooltipService {
  hoveredCandle$?: Observable<Candle>;
}
