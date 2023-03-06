import { Animation } from './animation';

export class AnimationsManager { 
    constructor() {}

    public static currentRenderBlock = false;
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

    public static startAnimation(type: string, msDuration: number, startValues: number[], endValues: number[], callback: (value: any) => void): void {
        this.checkDuplicates(type)
        this.animationStack.push(new Animation(type, msDuration, startValues, endValues, callback));        
    }

    private static checkDuplicates(type: string): void {
        const duplicates = this.animationStack.filter(animation => animation.type === type);

        // do something with the duplicates in the future;
    }

    public static update(): void {
        AnimationsManager.updateStack();
        this.animationStack.forEach(animation => {
            if(!this.currentRenderBlock) {
                animation.updateAnimationPositions();
            }
        });
        this.currentRenderBlock = false;
    }

    public static updateStack(): void {
        this.animationStack = this.animationStack.filter(animation => !animation.isFinished);
    }

    public static clearStack(): void {
        this.animationStack = [];
    }

    public static setBlock(): void {
        this.currentRenderBlock = true;
    }
}