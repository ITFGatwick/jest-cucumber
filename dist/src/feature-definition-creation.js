"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scenario_validation_1 = require("./validation/scenario-validation");
var step_definition_validation_1 = require("./validation/step-definition-validation");
var checkForPendingSteps = function (scenarioFromStepDefinitions) {
    var scenarioPending = false;
    scenarioFromStepDefinitions.steps.forEach(function (step) {
        try {
            if (step.stepFunction.toString().indexOf('pending()') !== -1) {
                var pendingTest = new Function("\n                    let isPending = false;\n\n                    const pending = function () {\n                        isPending = true;\n                    };\n\n                    (" + step.stepFunction + ")();\n\n                    return isPending;\n                ");
                scenarioPending = pendingTest();
            }
            else {
            }
        }
        catch (err) {
            //Ignore
        }
    });
    return scenarioPending;
};
var defineScenario = function (scenarioFromStepDefinitions, parsedScenario) {
    test(parsedScenario.title, function () {
        return scenarioFromStepDefinitions.steps.reduce(function (promiseChain, nextStep, index) {
            var stepArgument = parsedScenario.steps[index].stepArgument;
            var matches = step_definition_validation_1.matchSteps(parsedScenario.steps[index].stepText, scenarioFromStepDefinitions.steps[index].stepMatcher);
            var matchArgs = [];
            if (matches && matches.length) {
                matchArgs = matches.slice(1);
            }
            var args = matchArgs.concat([stepArgument]);
            return promiseChain.then(function () { return nextStep.stepFunction.apply(nextStep, args); });
        }, Promise.resolve());
    });
};
var createDefineScenarioFunction = function (featureFromStepDefinitions, parsedFeature) {
    return function (scenarioTitle, stepsDefinitionFunctionCallback) {
        var scenarioFromStepDefinitions = {
            title: scenarioTitle,
            steps: []
        };
        featureFromStepDefinitions.scenarios.push(scenarioFromStepDefinitions);
        stepsDefinitionFunctionCallback({
            defineStep: createDefineStepFunction(scenarioFromStepDefinitions),
            given: createDefineStepFunction(scenarioFromStepDefinitions),
            when: createDefineStepFunction(scenarioFromStepDefinitions),
            then: createDefineStepFunction(scenarioFromStepDefinitions),
            pending: function () { }
        });
        var parsedScenario = parsedFeature.scenarios.filter(function (s) { return s.title === scenarioTitle; })[0];
        var parsedScenarioOutline = parsedFeature.scenarioOutlines.filter(function (s) { return s.title === scenarioTitle; })[0];
        var options = parsedFeature.options;
        step_definition_validation_1.ensureFeatureFileAndStepDefinitionScenarioHaveSameSteps(options, parsedScenario || parsedScenarioOutline, scenarioFromStepDefinitions);
        if (checkForPendingSteps(scenarioFromStepDefinitions)) {
            xtest(scenarioTitle);
        }
        else if (parsedScenario) {
            defineScenario(scenarioFromStepDefinitions, parsedScenario);
        }
        else if (parsedScenarioOutline) {
            parsedScenarioOutline.scenarios.forEach(function (scenario) {
                defineScenario(scenarioFromStepDefinitions, scenario);
            });
        }
    };
};
var createDefineStepFunction = function (scenarioFromStepDefinitions) {
    return function (stepMatcher, stepFunction) {
        var stepDefinition = {
            stepMatcher: stepMatcher,
            stepFunction: stepFunction
        };
        scenarioFromStepDefinitions.steps.push(stepDefinition);
    };
};
function defineFeature(featureFromFile, scenariosDefinitionCallback) {
    var featureFromDefinedSteps = {
        title: featureFromFile.title,
        scenarios: []
    };
    scenariosDefinitionCallback(createDefineScenarioFunction(featureFromDefinedSteps, featureFromFile));
    scenario_validation_1.checkThatFeatureFileAndStepDefinitionsHaveSameScenarios(featureFromFile, featureFromDefinedSteps);
}
exports.defineFeature = defineFeature;
//# sourceMappingURL=feature-definition-creation.js.map