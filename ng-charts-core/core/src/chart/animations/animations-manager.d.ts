import { Animation } from './animation';
export declare class AnimationsManager {
    constructor();
    static currentRenderBlock: boolean;
    private static currentTimeStamp;
    private static animationStack;
    static setCurrentTimeStamp(time: number): void;
    static getCurrentTimeStamp(): number;
    static getAnimationStack(): Animation[];
    static startAnimation(type: string, msDuration: number, startValues: number[], endValues: number[], callback: (value: any) => void, easeType: boolean): void;
    private static checkDuplicates;
    static update(): void;
    static updateStack(): void;
    static clearStack(): void;
    static setBlock(): void;
}
