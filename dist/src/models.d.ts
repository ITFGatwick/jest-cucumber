export declare type StepFromStepDefinitions = {
    stepMatcher: string | RegExp;
    stepFunction(stepArguments?: any): void | PromiseLike<any>;
};
export declare type ScenarioFromStepDefinitions = {
    title: string;
    steps: StepFromStepDefinitions[];
};
export declare type FeatureFromStepDefinitions = {
    title: string;
    scenarios: ScenarioFromStepDefinitions[];
};
export declare type ParsedStep = {
    keyword: string;
    stepText: string;
    stepArgument: string | {};
};
export declare type ParsedScenario = {
    title: string;
    steps: ParsedStep[];
    tags: string[];
};
export declare type ParsedScenarioOutline = {
    title: string;
    tags: string[];
    scenarios: ParsedScenario[];
    steps: ParsedStep[];
};
export declare type ParsedFeature = {
    title: string;
    scenarios: ParsedScenario[];
    scenarioOutlines: ParsedScenarioOutline[];
    options: Options;
};
export declare type Options = {
    tagFilter?: string[];
    errorOnMissingScenariosAndSteps?: boolean;
};
