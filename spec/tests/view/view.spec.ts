import { View } from '../../../src/chart/view';
import { IViewConfig } from '../../../src/interfaces/view.interface';

describe("View suite that checks functionality of view module", function() {
    let view: View;
    
    const viewConfig: IViewConfig = {
        intervalName: 'M1',
        intervalCandles: 60,
        intervalStep: 0,
        intervalColInit: 150,
        intervalColRatios: [150, 300, 600, 1200],
        viewOffset: 0
    }

    beforeEach(() => {
        view = new View(viewConfig);
    });
    
    it('creates a new instance of View checks colInterval equal to initial value', function() {
        expect(view.getColInterval()).toEqual(viewConfig.intervalColInit);
    });


    it('adds value to colInterval and displays the right value', () => {
        view.addColInterval(50);
        expect(view.getColInterval()).toEqual(200);

        view.addColInterval(-200);
        expect(view.getColInterval()).toEqual(150);

        view.addColInterval(-Infinity);
        expect(view.getColInterval()).toEqual(150);

        view.addColInterval(21.5);
        expect(view.getColInterval()).toEqual(171.5);
    });

    it('should initialize with all values equal to IViewConfig', () => {
        expect(view['colInterval']).toEqual(viewConfig.intervalColInit);
        expect(view['viewOffset']).toEqual(viewConfig.viewOffset);
        expect(view['colIntervalRatios']).toEqual(viewConfig.intervalColRatios);
        expect(view['intervalStep']).toEqual(viewConfig.intervalStep);
        expect(view['intervalCandles']).toEqual(viewConfig.intervalCandles);
    });

    it('check the correct values for min/maxColInterval', () => {
        expect(view['getMinColInterval']()).toEqual(150);
        expect(view['getMaxColInterval']()).toEqual(600);
    });

    it('interval steps should be updated accordingly', () => {
        expect(view.getColInterval()).toEqual(150);

        view.addColInterval(150);
        expect(view.getColInterval()).toEqual(300);
        expect(view['intervalStep']).toEqual(1);
    });
});