import { Injectable } from "@angular/core";
import { Chart } from "@kowalskiddamian/chart-core";
import { ChartAPIController } from "@kowalskiddamian/chart-core";

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