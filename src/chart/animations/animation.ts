import { AnimationsManager } from './animations-manager';

export class Animation {
    constructor(duration: number, startValues: number[], callback: (...arg: any[]) => void) {
        this.animationStartTime = AnimationsManager.getCurrentTimeStamp();
        this.msDuration = duration;
        this.startValues = startValues;
        this.setValCallback = callback;
    }

    public isFinished = false;

    private animationStartTime: number;
    private msDuration: number;
    private startValues: number[];
    private setValCallback: (...arg: any[]) => void;
    private animationType?: string;

    public getAnimationType(): string {
        return this.animationType;
    }

    public updateAnimationPositions(): void {
        const currentTime = AnimationsManager.getCurrentTimeStamp();

        if(currentTime - this.animationStartTime <= this.msDuration) {
            const timeProgress = this.getTimeProgress(currentTime);
            const ease = this.easeInOutQuint(timeProgress);

            const resultValues = this.startValues.map(v => v * ease / 10);
            this.setValCallback(resultValues);
        } else {
            this.isFinished = true;
        }
    }

    private getTimeProgress(currentTime: number): number {
        return (currentTime - this.animationStartTime) / this.msDuration;
    }

    private easeInOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
}