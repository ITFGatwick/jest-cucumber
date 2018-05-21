import { ParsedScenario, ParsedStep, ParsedScenarioOutline } from "./models";
export declare const getStepKeyword: (steps: ParsedStep[], stepPosition: number) => string;
export declare const generateStepCode: (steps: ParsedStep[], stepPosition: number) => string;
export declare const generateScenarioCode: (scenario: ParsedScenario | ParsedScenarioOutline) => string;
