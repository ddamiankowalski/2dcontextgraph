import { View } from '../../../src/chart/view';

describe("View suite that checks functionality of view module", function() {
    let view: View;
    beforeEach(() => {
        view = new View(150);
    });
    
    it("creates a new instance of View checks colInterval equal to initial value", function() {
        expect(view.getColInterval()).toEqual(150);
    });


    it("adds value to colInterval and displays the right value", () => {
        view.addColInterval(50);
        expect(view.getColInterval()).toEqual(200);

        view.addColInterval(-10);
        expect(view.getColInterval()).toEqual(190);

        view.addColInterval(-190);
        view.addColInterval(0);
        expect(view.getColInterval()).toEqual(0);
    });
});