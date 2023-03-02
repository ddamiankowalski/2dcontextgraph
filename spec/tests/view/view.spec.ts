import { View } from '../../../src/chart/view';

describe("View suite that checks functionality of view module", function() {
    let view: View;
    beforeEach(() => {
        view = new View(150);
    });
    
    it("creates a new instance of View checks colInterval equal to initial value", function() {
        expect(View.getColInterval()).toEqual(150);
    });


    it("adds value to colInterval and displays the right value", () => {
        View.addColInterval(50);
        expect(View.getColInterval()).toEqual(200);

        View.addColInterval(-10);
        expect(View.getColInterval()).toEqual(190);

        View.addColInterval(-190);
        View.addColInterval(0);
        expect(View.getColInterval()).toEqual(0);
    });
});