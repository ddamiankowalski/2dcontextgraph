import { View } from '../../../src/chart/view';

describe("View suite that checks functionality of view module", function() {
    let view: View;
    beforeEach(() => {
        view = new View(150);
    });
    
    it("creates a new instance of View checks colInterval equal to initial value", function() {
        expect(View.getColInterval()).toEqual(150);
    });
});