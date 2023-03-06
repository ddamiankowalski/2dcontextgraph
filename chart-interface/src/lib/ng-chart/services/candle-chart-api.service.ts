import { Injectable } from "@angular/core";
import { Chart } from "chart-engine/src";
import { ChartAPIController } from "chart-engine/src/lib/chart/api/api-controller";

@Injectable({
    providedIn: 'root'
})
export class NgCandleChartAPIService {
    private apiController!: ChartAPIController;

    public bindController(chartEngine: Chart): void {
        this.apiController = chartEngine.getApiController();
    }

    public resetViewOffset(msTime = 400): void {
        this.apiController.resetViewOffset(msTime);
    }
}