export class ChartTime {
    constructor() {
        this.initializeTimeMap();
    }

    private timeMap: Map<string, number> = new Map();
    private currentTimeSpan: number;
    private intervalCandlesConfig: Array<number> = [60, 30, 15, 5, 1];
    private maxColsDistToTimeRatioConfig: Array<number> = [2, 2, 3];
    private currentIntervalStep: number = 0;

    private initializeTimeMap(): void {
        this.timeMap.set('M60', 3600000); // this is an hour
        this.currentTimeSpan = this.timeMap.get('M60'); // get initial time span between main two columns (initially it is 60 minutes, then changed according to the interval step configs)
    }

    public getCurrentTimeSpan(): number {
        return this.currentTimeSpan;
    }

    public candlesInInterval(): number {
        return this.intervalCandlesConfig[this.currentIntervalStep];
    }

    public getCurrentMaxDistanceRatio(): number {
        return this.maxColsDistToTimeRatioConfig[this.currentIntervalStep];
    }

    public getPrevMaxDistanceRatio(): number {
        return this.maxColsDistToTimeRatioConfig[this.currentIntervalStep - 1];
    }

    public checkIfMaxTimeSpan(): boolean {
        return this.currentIntervalStep === 0;
    }

    public checkIfMinTimeSpan(): boolean {
        return !this.maxColsDistToTimeRatioConfig[this.currentIntervalStep];
    }

    public enlargeTimeSpan(): void {
            console.log(this.currentTimeSpan, this.getPrevMaxDistanceRatio(), 'zoom out')

            this.currentTimeSpan = this.currentTimeSpan * this.getPrevMaxDistanceRatio();
            this.currentIntervalStep--;

    }

    public reduceTimeSpan(): void {
        if(this.getCurrentMaxDistanceRatio()) {
            console.log(this.currentTimeSpan, this.getCurrentMaxDistanceRatio(), 'zoom in')
            this.currentTimeSpan = this.currentTimeSpan / this.getCurrentMaxDistanceRatio();
            this.currentIntervalStep++;
        }
    }

    public getTime(columnOffset: number): string {
        const startDate = new Date();
        startDate.setMilliseconds(startDate.getMilliseconds() - this.currentTimeSpan * (columnOffset - 1));
        return `${startDate.getHours()}:${startDate.getMinutes()}`;
    }
}