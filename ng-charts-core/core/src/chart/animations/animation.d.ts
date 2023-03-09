export declare class Animation {
    constructor(type: string, duration: number, startValues: number[], endValues: number[], callback: (...arg: any[]) => void, easeType: boolean);
    isFinished: boolean;
    type: string;
    private easeType;
    private animationStartTime;
    private msDuration;
    private startValues;
    private endValues;
    private setValCallback;
    updateAnimationPositions(): void;
    private getEaseFunction;
    private getTimeProgress;
    private easeInOutQuint;
    private easeInOutSine;
    setStartValues(values: number[]): void;
    setEndValues(values: number[]): void;
    getValues(): any;
}
