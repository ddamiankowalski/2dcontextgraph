import { InjectionToken } from "@angular/core";
import { ChartAPIController } from "../core";

export const NGX_CHART_API = new InjectionToken<ChartAPIController>('ngxChartAPI');
