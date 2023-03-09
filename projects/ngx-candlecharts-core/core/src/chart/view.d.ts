import { IViewConfig } from '../interfaces/view.interface';
export declare class View {
    constructor(viewConfig: IViewConfig);
    private colInterval;
    private viewOffset;
    private colIntervalRatios;
    private subColIntervalRatios;
    private intervalStep;
    private intervalCandles;
    getIntervalCandles(): number;
    getDivider(): number;
    getSubColRatio(): number;
    addColInterval(x: number): void;
    private getMinColInterval;
    getIntervalStep(): number;
    private getMaxColInterval;
    maxZoomOut(x?: number): boolean;
    maxZoomIn(x?: number): boolean;
    private updateIntervalStep;
    private checkIfNextStep;
    private checkIfPrevStep;
    getColInterval(): number;
    getViewOffset(): number;
    setViewOffset(x: number): void;
    addViewOffset(x: number): void;
}
