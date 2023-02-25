import { Animation } from './animation';

export class AnimationsManager { 
    constructor() {}

    public static test = true;

    private static currentTimeStamp: number;
    private static animationStack: Animation[] = [];

    public static setCurrentTimeStamp(time: number): void { 
        this.currentTimeStamp = time;
    }

    public static getCurrentTimeStamp(): number {
        return this.currentTimeStamp;
    }

    public static getAnimationStack(): Animation[] {
        return this.animationStack;
    }

    public static startAnimation(msDuration: number, startValues: number[], callback: (value: any) => void): void {
        this.animationStack.push(new Animation(msDuration, startValues, callback));
    }

    public static update(): void {
        AnimationsManager.updateStack();
        this.animationStack.forEach(animation => {
            animation.updateAnimationPositions();
        });
    }

    public static updateStack(): void {
        this.animationStack = this.animationStack.filter(animation => !animation.isFinished);
    }

    public static clearAll(): void {
        this.animationStack = [];
    }
}