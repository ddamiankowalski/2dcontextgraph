import { AnimationsManager } from "../animations/animations-manager";
import { View } from "../view";

export class ChartAPIController {
    constructor(
        private view: View
    ) {}

    public resetViewOffset(msTime = 400): void {
        AnimationsManager.startAnimation(
            'resetViewOffset',
            msTime,
            [this.view.getViewOffset()],
            [0],
            (easedValues: number[]) => {
                const [ viewOffset ] = easedValues; 
                this.view.setViewOffset(viewOffset);
            },
            true
        );
    }
}