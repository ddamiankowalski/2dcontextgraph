import { IViewConfig } from '../interfaces/view.interface';

export class View {
    constructor(viewConfig: IViewConfig) {
        const { 
            intervalColInit, 
            intervalColRatios, 
            viewOffset, 
            intervalStep, 
            intervalCandles 
        } = viewConfig;

        this.colInterval = intervalColInit;
        this.viewOffset = viewOffset;
        this.colIntervalRatios = intervalColRatios;
        this.intervalStep = intervalStep;
        this.intervalCandles = intervalCandles;
    }

    private colInterval: number;
    private viewOffset: number;
    private colIntervalRatios: number[];
    private intervalStep: number;
    private intervalCandles: number;

    public addColInterval(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = this.getMinColInterval();
            return;
        }

        this.colInterval += x;
        this.updateIntervalStep();
    }

    private getMinColInterval(): number {
        return this.colIntervalRatios[0];
    }

    private getMaxColInterval(): number {
        return this.colIntervalRatios[this.colIntervalRatios.length - 1];
    }

    public maxZoomOut(x: number): boolean {
        return this.colInterval + x <= this.getMinColInterval() && x < 0;
    }

    private updateIntervalStep(): void {
        if(this.intervalStep !== (this.colIntervalRatios.length - 1) && this.colInterval >= this.colIntervalRatios[this.intervalStep + 1]) {
            this.intervalStep++;
        } 

        if(this.intervalStep !== 0 && this.colInterval <= this.colIntervalRatios[this.intervalStep]) {
            this.intervalStep--;
        }
    }

    public getColInterval(): number {
        return this.colInterval;
    }

    public getViewOffset(): number {
        return this.viewOffset;
    }

    public setViewOffset(x: number) {
        this.viewOffset = x;
    }

    public addViewOffset(x: number) {
        if(this.maxZoomOut(x)) {
            this.colInterval = 150;
            return;
        }

        this.viewOffset += x;
    }
}