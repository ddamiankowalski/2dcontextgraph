import { Injectable } from "@angular/core";
import { Chart } from "@angular-charts/chart-core";
import { ChartAPIController } from "@angular-charts/chart-core";

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