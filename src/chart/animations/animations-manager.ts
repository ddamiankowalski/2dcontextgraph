export class AnimationsManager { 
    constructor() {}

    private static currentTimeStamp: number;

    private startTimeStamp: number;
    private endTimeStamp: number;

    public static setCurrentTimeStamp(time: number): void { 
        this.currentTimeStamp = time;
    }

    public static getCurrentTimeStamp(): number {
        return this.currentTimeStamp;
    }

    public startAnimation(timeStamp: number, msDuration: number, startVal: number, endVal: number): void {
        if(!this.startTimeStamp) {
            this.startTimeStamp = timeStamp;
            this.endTimeStamp = timeStamp + msDuration;
        }

        if(timeStamp - this.startTimeStamp <= 300) {
            const progress = (timeStamp - this.startTimeStamp) / msDuration;

            const val = this.easeInOutQuint(progress);

            console.log(startVal + (endVal - startVal) * val);
        }
    }

    private easeInOutQuint(x: number): number {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
}