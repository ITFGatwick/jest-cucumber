import { ParsedFeature } from './models';
export declare type StepsDefinitionCallbackOptions = {
    defineStep: DefineStepFunction;
    given: DefineStepFunction;
    when: DefineStepFunction;
    then: DefineStepFunction;
    pending: () => void;
};
export declare type ScenariosDefinitionCallbackFunction = (defineScenario: DefineScenarioFunction) => void;
export declare type DefineScenarioFunction = (scenarioTitle: string, stepsDefinitionCallback: StepsDefinitionCallbackFunction) => void;
export declare type StepsDefinitionCallbackFunction = (options: StepsDefinitionCallbackOptions) => void;
export declare type DefineStepFunction = (stepMatcher: string | RegExp, stepDefinitionCallback: (...args: any[]) => any) => any;
export declare function defineFeature(featureFromFile: ParsedFeature, scenariosDefinitionCallback: ScenariosDefinitionCallbackFunction): void;
