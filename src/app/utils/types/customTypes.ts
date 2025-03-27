import { ListOption } from "./formTypes";

// Define the valid keys for optionsMap
export type OptionKeys = 'provider' | 'electrician' | 'planner' | 'convertor' | 'panel' | 'facillity';

// Define the structure of optionsMap
export type OptionsMap = Record<OptionKeys, string[] | ListOption[]>;
