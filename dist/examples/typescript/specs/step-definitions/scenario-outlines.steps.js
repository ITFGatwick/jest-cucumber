"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../../src/");
var online_sales_1 = require("../../src/online-sales");
var feature = _1.loadFeature('./examples/typescript/specs/features/scenario-outlines.feature');
_1.defineFeature(feature, function (test) {
    var onlineSales;
    var salesPrice;
    beforeEach(function () {
        onlineSales = new online_sales_1.OnlineSales();
    });
    test('Selling an item', function (_a) {
        var given = _a.given, when = _a.when, then = _a.then, pending = _a.pending;
        given(/^I have a\(n\) (.*)$/, function (item) {
            onlineSales.listItem(item);
        });
        when(/^I sell the (.*)$/, function (item) {
            salesPrice = onlineSales.sellItem(item);
        });
        then(/^I should get \$(\d+)$/, function (expectedSalesPrice) {
            expect(salesPrice).toBe(parseInt(expectedSalesPrice));
        });
    });
});
//# sourceMappingURL=scenario-outlines.steps.js.map