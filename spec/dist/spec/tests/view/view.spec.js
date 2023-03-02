"use strict";
exports.__esModule = true;
var view_1 = require("../../../src/chart/view");
describe("View suite that checks functionality of view module", function () {
    var view;
    beforeEach(function () {
        view = new view_1.View(150);
    });
    it("creates a new instance of View checks colInterval equal to initial value", function () {
        expect(view_1.View.getColInterval()).toEqual(150);
    });
    it("adds value to colInterval and displays the right value", function () {
        view_1.View.addColInterval(50);
        expect(view_1.View.getColInterval()).toEqual(200);
        view_1.View.addColInterval(-10);
        expect(view_1.View.getColInterval()).toEqual(190);
        view_1.View.addColInterval(-190);
        view_1.View.addColInterval(0);
        expect(view_1.View.getColInterval()).toEqual(0);
    });
});
//# sourceMappingURL=view.spec.js.map