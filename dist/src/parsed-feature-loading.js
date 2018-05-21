"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var Gherkin = require('gherkin');
var parseDataTableRow = function (astDataTableRow) {
    return astDataTableRow.cells.map(function (col) { return col.value; });
};
var parseDataTable = function (astDataTable, astDataTableHeader) {
    var headerRow;
    var bodyRows;
    if (astDataTableHeader) {
        headerRow = parseDataTableRow(astDataTableHeader);
        bodyRows = astDataTable;
    }
    else {
        headerRow = parseDataTableRow(astDataTable.rows[0]);
        bodyRows = astDataTable && astDataTable.rows && astDataTable.rows.length && astDataTable.rows.slice(1);
    }
    if (bodyRows && bodyRows.length > 0) {
        return bodyRows.map(function (nextRow) {
            var parsedRow = parseDataTableRow(nextRow);
            return parsedRow.reduce(function (rowObj, nextCol, index) {
                return __assign({}, rowObj, (_a = {}, _a[headerRow[index]] = nextCol, _a));
                var _a;
            }, {});
        });
    }
    else {
        return [];
    }
};
var parseStepArgument = function (astStepArgument) {
    if (astStepArgument) {
        switch (astStepArgument.type) {
            case 'DataTable':
                return parseDataTable(astStepArgument);
            case 'DocString':
                return astStepArgument.content;
            default:
                return null;
        }
    }
    else {
        return null;
    }
};
var parseStep = function (astStep) {
    return {
        stepText: astStep.text,
        keyword: (astStep.keyword).trim().toLowerCase(),
        stepArgument: parseStepArgument(astStep.argument)
    };
};
var parseSteps = function (astScenario) {
    return astScenario.steps.map(function (astStep) { return parseStep(astStep); });
};
var parseScenarioTags = function (astScenario) {
    if (!astScenario.tags) {
        return [];
    }
    else {
        return astScenario.tags.map(function (tag) { return tag.name.toLowerCase(); });
    }
};
var parseScenario = function (astScenario) {
    return {
        title: astScenario.name,
        steps: parseSteps(astScenario),
        tags: parseScenarioTags(astScenario)
    };
};
var parseScenarioOutlineExampleSteps = function (exampleTableRow, scenarioSteps) {
    return scenarioSteps.map(function (scenarioStep) {
        var stepText = Object.keys(exampleTableRow).reduce(function (processedStepText, nextTableColumn) {
            return processedStepText.replace("<" + nextTableColumn + ">", exampleTableRow[nextTableColumn]);
        }, scenarioStep.stepText);
        var stepArgument;
        if (scenarioStep.stepArgument) {
            stepArgument = scenarioStep.stepArgument.map(function (stepArgumentRow) {
                var modifiedStepAgrumentRow = __assign({}, stepArgumentRow);
                Object.keys(exampleTableRow).forEach(function (nextTableColumn) {
                    for (var prop in modifiedStepAgrumentRow) {
                        modifiedStepAgrumentRow[prop] = modifiedStepAgrumentRow[prop].replace("<" + nextTableColumn + ">", exampleTableRow[nextTableColumn]);
                    }
                });
                return modifiedStepAgrumentRow;
            });
        }
        return __assign({}, scenarioStep, { stepText: stepText,
            stepArgument: stepArgument });
    });
};
var parseScenarioOutlineExample = function (exampleTableRow, outlineScenario) {
    return {
        title: outlineScenario.title,
        steps: parseScenarioOutlineExampleSteps(exampleTableRow, outlineScenario.steps),
        tags: outlineScenario.tags
    };
};
var parseScenarioOutlineExampleSet = function (astExampleSet, outlineScenario) {
    var exampleTable = parseDataTable(astExampleSet.tableBody, astExampleSet.tableHeader);
    return exampleTable.map(function (tableRow) { return parseScenarioOutlineExample(tableRow, outlineScenario); });
};
var parseScenarioOutlineExampleSets = function (astExampleSets, outlineScenario) {
    var exampleSets = astExampleSets.map(function (astExampleSet) { return parseScenarioOutlineExampleSet(astExampleSet, outlineScenario); });
    return exampleSets.reduce(function (scenarios, nextExampleSet) {
        return scenarios.concat(nextExampleSet);
    }, []);
};
var parseScenarioOutline = function (astScenarioOutline) {
    var outlineScenario = parseScenario(astScenarioOutline);
    return {
        title: outlineScenario.title,
        scenarios: parseScenarioOutlineExampleSets(astScenarioOutline.examples, outlineScenario),
        tags: outlineScenario.tags,
        steps: outlineScenario.steps
    };
};
var parseScenarios = function (astFeature) {
    return astFeature.children
        .filter(function (child) { return child.type === 'Scenario'; })
        .map(function (astScenario) { return parseScenario(astScenario); });
};
var parseScenarioOutlines = function (astFeature) {
    return astFeature.children
        .filter(function (child) { return child.type === 'ScenarioOutline'; })
        .map(function (astScenarioOutline) { return parseScenarioOutline(astScenarioOutline); });
};
var parseFeature = function (ast, options) {
    var astFeature = ast.feature;
    return {
        title: astFeature.name,
        scenarios: parseScenarios(astFeature),
        scenarioOutlines: parseScenarioOutlines(astFeature),
        options: options
    };
};
exports.loadFeature = function (featureFilePath, options) {
    if (!fs_1.existsSync(featureFilePath)) {
        throw new Error("Feature file not found (" + path_1.resolve(featureFilePath) + ")");
    }
    var featureText = fs_1.readFileSync(featureFilePath, 'utf8');
    var ast = new Gherkin.Parser().parse(featureText);
    return parseFeature(ast, options);
};
//# sourceMappingURL=parsed-feature-loading.js.map