"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../../src/");
var bank_account_1 = require("../../src/bank-account");
var feature = _1.loadFeature('./examples/typescript/specs/features/using-dynamic-values.feature');
_1.defineFeature(feature, function (test) {
    var myAccount;
    beforeEach(function () {
        myAccount = new bank_account_1.BankAccount();
    });
    test('Depositing a paycheck', function (_a) {
        var given = _a.given, when = _a.when, then = _a.then, pending = _a.pending;
        given(/^my account balance is \$(\d+)$/, function (balance) {
            myAccount.deposit(parseInt(balance));
        });
        when(/^I get paid \$(\d+) for writing some awesome code$/, function (paycheck) {
            myAccount.deposit(parseInt(paycheck));
        });
        then(/^my account balance should be \$(\d+)$/, function (expectedBalance) {
            expect(myAccount.balance).toBe(parseInt(expectedBalance));
        });
    });
});
//# sourceMappingURL=using-dynamic-values.steps.js.map