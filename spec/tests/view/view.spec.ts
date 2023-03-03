import { View } from '../../../src/chart/view';

describe("View suite that checks functionality of view module", function() {
    let view: View;
    const minColInterval = 150;

    beforeEach(() => {
        view = new View(minColInterval);
    });
    
    it('creates a new instance of View checks colInterval equal to initial value', function() {
        expect(view.getColInterval()).toEqual(minColInterval);
    });


    it('adds value to colInterval and displays the right value', () => {
        view.addColInterval(50);
        expect(view.getColInterval()).toEqual(200);

        view.addColInterval(-200);
        expect(view.getColInterval()).toEqual(minColInterval);

        view.addColInterval(-Infinity);
        expect(view.getColInterval()).toEqual(minColInterval);

        view.addColInterval(21.5);
        expect(view.getColInterval()).toEqual(171.5);
    });

    it('should initialize all values correctly', () => {
        expect(view['minColInterval']).toEqual(minColInterval);
        expect(view['maxColInterval']).toEqual(minColInterval);
    });
});