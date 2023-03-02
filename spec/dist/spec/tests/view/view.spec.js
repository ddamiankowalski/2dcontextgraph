"use strict";
exports.__esModule = true;
var view_1 = require("../../../src/chart/view");
describe("View suite that checks functionality of view module", function () {
    var view;
    beforeEach(function () {
        view = new view_1.View(150);
    });
    it("creates a new instance of View checks colInterval equal to initial value", function () {
        expect(view.getColInterval()).toEqual(150);
    });
});
//# sourceMappingURL=view.spec.js.map