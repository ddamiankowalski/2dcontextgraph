export class ChartTime {
    constructor() {
        this.initializeTimeMap();
    }

    private timeMap: Map<string, number> = new Map();
    private currentTimeSpan: number;

    private initializeTimeMap(): void {
        this.timeMap.set('M60', 3600000);
        this.currentTimeSpan = this.timeMap.get('M60');
    }

    public getCurrentTimeSpan(): number {
        return this.currentTimeSpan;
    }

    public checkIfMaxTimeSpan(): boolean {
        console.log(this.currentTimeSpan, this.currentTimeSpan === 3600000);
        return this.currentTimeSpan === 3600000;
    }

    public checkIfMinTimeSpan(): boolean {
        return this.currentTimeSpan === 900000;
    }

    public enlargeTimeSpan(): void {
        this.currentTimeSpan = this.currentTimeSpan * 2;
    }

    public reduceTimeSpan(): void {
        this.currentTimeSpan = this.currentTimeSpan / 2;
    }

    public getTime(columnOffset: number): string {
        const startDate = new Date();
        startDate.setMilliseconds(startDate.getMilliseconds() - this.currentTimeSpan * (columnOffset - 1));
        return `${startDate.getHours()}:${startDate.getMinutes()}`;
    }
}