"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSteps = function (stepFromFeatureFile, stepMatcher) {
    if (typeof stepMatcher === 'string') {
        return stepFromFeatureFile.toLocaleLowerCase() === stepMatcher.toLocaleLowerCase();
    }
    else if (stepMatcher instanceof RegExp) {
        return stepFromFeatureFile.match(stepMatcher);
    }
    else {
        return false;
    }
};
exports.ensureFeatureFileAndStepDefinitionScenarioHaveSameSteps = function (options, parsedScenario, scenarioFromStepDefinitions) {
    if (options && options.errorOnMissingScenariosAndSteps === false) {
        return;
    }
    if (!parsedScenario) {
        return;
    }
    var errors = [];
    var parsedScenarioSteps = [];
    if (parsedScenario.scenarios) {
        var parsedScenarioOutlineScenarios = parsedScenario.scenarios;
        if (parsedScenarioOutlineScenarios && parsedScenarioOutlineScenarios.length) {
            parsedScenarioSteps = parsedScenarioOutlineScenarios[0].steps;
        }
        else {
            parsedScenarioSteps = [];
        }
    }
    else if (parsedScenario.steps) {
        parsedScenarioSteps = parsedScenario.steps;
    }
    var parsedStepCount = parsedScenarioSteps.length;
    var stepDefinitionCount = scenarioFromStepDefinitions.steps.length;
    if (parsedStepCount !== stepDefinitionCount) {
        errors.push("Scenario \"" + parsedScenario.title + "\" has " + parsedStepCount + " step(s) in the feature file, but " + stepDefinitionCount + " step definition(s) defined.");
    }
    parsedScenarioSteps.forEach(function (parsedStep, index) {
        var stepFromStepDefinitions = scenarioFromStepDefinitions.steps[index];
        if (!stepFromStepDefinitions || !exports.matchSteps(parsedStep.stepText, stepFromStepDefinitions.stepMatcher)) {
            errors.push("Expected step #" + (index + 1) + " in scenario \"" + parsedScenario.title + "\" to match \"" + parsedStep.stepText + "\"");
        }
    });
    scenarioFromStepDefinitions.steps.forEach(function (stepFromStepDefinitions) {
        var matches = parsedScenarioSteps.filter(function (parsedStep) { return exports.matchSteps(parsedStep.stepText, stepFromStepDefinitions.stepMatcher); });
        if (matches.length > 1) {
            errors.push("\"" + stepFromStepDefinitions.stepMatcher.toString() + "\" matches " + matches.length + " steps in the feature file scenario, \"" + parsedScenario.title + "\"");
        }
    });
    if (errors.length) {
        throw new Error(errors.join('\r\r'));
    }
};
//# sourceMappingURL=step-definition-validation.js.map