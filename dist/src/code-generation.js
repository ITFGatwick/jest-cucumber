"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scenarioTemplate = function (scenarioTitle, steps) {
    return "test('" + scenarioTitle + "', ({ given, when, then, pending }) => {\n    " + steps + "\n});";
};
var stepTemplate = function (stepKeyword, stepMatcher, stepArgumentVariables) {
    return stepKeyword + "(" + stepMatcher + ", (" + stepArgumentVariables.join(', ') + ") => {\n        pending();\n    });";
};
var stepTextArgumentRegex = /([-+]?[0-9]*\.?[0-9]+|\"(.+)\"|\"?\<(.*)\>\"?)/g;
var escapeRegexCharacters = function (text) {
    return text
        .replace(/\$/g, '\\$')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
};
var convertStepTextToRegex = function (step) {
    var stepText = escapeRegexCharacters(step.stepText);
    var match;
    while (match = stepTextArgumentRegex.exec(stepText)) {
        stepText = stepText.replace(new RegExp(match[1], 'g'), '(.*)');
    }
    return "/^" + stepText + "$/";
};
var getStepArguments = function (step) {
    var stepArgumentVariables = [];
    var match;
    var index = 0;
    while (match = stepTextArgumentRegex.exec(step.stepText)) {
        stepArgumentVariables.push("arg" + index);
        index++;
    }
    if (step.stepArgument) {
        if (typeof step.stepArgument === 'string') {
            stepArgumentVariables.push('docString');
        }
        else {
            stepArgumentVariables.push('table');
        }
    }
    return stepArgumentVariables;
};
var getStepMatcher = function (step) {
    var stepMatcher = '';
    if (step.stepText.match(stepTextArgumentRegex)) {
        stepMatcher = convertStepTextToRegex(step);
    }
    else {
        stepMatcher = "'" + step.stepText + "'";
    }
    return stepMatcher;
};
exports.getStepKeyword = function (steps, stepPosition) {
    var currentStep = steps[stepPosition];
    var containsConjunction = function (keyword) { return ['but', 'and'].indexOf(keyword) !== -1; };
    return steps
        .slice(0, stepPosition)
        .map(function (step) { return step.keyword; })
        .reverse()
        .reduce(function (previousKeyword, nextKeyword) {
        if (!containsConjunction(previousKeyword)) {
            return previousKeyword;
        }
        else {
            return nextKeyword;
        }
    }, currentStep.keyword);
};
exports.generateStepCode = function (steps, stepPosition) {
    var step = steps[stepPosition];
    return stepTemplate(exports.getStepKeyword(steps, stepPosition), getStepMatcher(step), getStepArguments(step));
};
exports.generateScenarioCode = function (scenario) {
    var stepsCode;
    stepsCode = scenario.steps.map(function (step, index) { return exports.generateStepCode(scenario.steps, index); });
    return scenarioTemplate(scenario.title, stepsCode.join('\n\n\t'));
};
//# sourceMappingURL=code-generation.js.map