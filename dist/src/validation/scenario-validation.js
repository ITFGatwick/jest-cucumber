"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var code_generation_1 = require("../code-generation");
var findScenarioFromParsedFeature = function (errors, parsedScenarios, scenarioTitle) {
    var matchingScenarios = [];
    if (parsedScenarios) {
        matchingScenarios = parsedScenarios
            .filter(function (parsedScenario) { return parsedScenario.title.toLowerCase() === scenarioTitle.toLowerCase(); });
    }
    if (matchingScenarios.length === 0) {
        errors.push("No scenarios found in feature file that match scenario title \"" + scenarioTitle + ".\"");
        return null;
    }
    else if (matchingScenarios.length > 1) {
        errors.push("More than one scenario found in feature file that match scenario title \"" + scenarioTitle + "\"");
        return null;
    }
    return matchingScenarios[0];
};
var findScenarioFromStepDefinitions = function (errors, scenariosFromStepDefinitions, scenario) {
    var scenarioTitle = scenario.title;
    var matchingScenarios = scenariosFromStepDefinitions
        .filter(function (scenarioFromStepDefinitions) { return scenarioFromStepDefinitions.title.toLocaleLowerCase() === scenarioTitle.toLocaleLowerCase(); });
    if (matchingScenarios.length === 0) {
        errors.push("Feature file has a scenario titled \"" + scenarioTitle + "\", but no match found in step definitions. Try adding the following code:\n\n" + code_generation_1.generateScenarioCode(scenario));
        return null;
    }
    else if (matchingScenarios.length > 1) {
        errors.push("More than one scenario found in step definitions matching scenario title \"" + scenarioTitle + "\"");
        return null;
    }
    return matchingScenarios[0];
};
var filterParsedScenariosByTags = function (tagNames, parsedScenarios) {
    return parsedScenarios.filter(function (parsedScenario) {
        var tagMatches = parsedScenario.tags
            .map(function (tag) { return tag.toLowerCase(); })
            .filter(function (scenarioTagNames) {
            return tagNames.filter(function (tagName) { return scenarioTagNames.indexOf(tagName.toLowerCase()) !== -1; }).length > 0;
        });
        return tagMatches.length > 0;
    });
};
exports.checkThatFeatureFileAndStepDefinitionsHaveSameScenarios = function (parsedFeature, featureFromStepDefinitions) {
    var errors = [];
    var parsedScenarios = [];
    if (parsedFeature && parsedFeature.scenarios && parsedFeature.scenarios.length) {
        parsedScenarios = parsedScenarios.concat(parsedFeature.scenarios);
    }
    if (parsedFeature && parsedFeature.scenarioOutlines && parsedFeature.scenarioOutlines.length) {
        parsedScenarios = parsedScenarios.concat(parsedFeature.scenarioOutlines);
    }
    if (parsedFeature.options && parsedFeature.options.tagFilter) {
        parsedScenarios = filterParsedScenariosByTags(parsedFeature.options.tagFilter, parsedScenarios);
    }
    if (parsedFeature.options && parsedFeature.options.errorOnMissingScenariosAndSteps === false) {
        return;
    }
    if (featureFromStepDefinitions && featureFromStepDefinitions.scenarios && featureFromStepDefinitions.scenarios.length) {
        featureFromStepDefinitions.scenarios.forEach(function (scenarioFromStepDefinitions) {
            findScenarioFromParsedFeature(errors, parsedScenarios, scenarioFromStepDefinitions.title);
        });
    }
    if (parsedScenarios && parsedScenarios.length) {
        parsedScenarios.forEach(function (parsedScenario) {
            findScenarioFromStepDefinitions(errors, featureFromStepDefinitions && featureFromStepDefinitions.scenarios, parsedScenario);
        });
    }
    if (errors.length) {
        throw new Error(errors.join('\n\n'));
    }
};
//# sourceMappingURL=scenario-validation.js.map