import { Reducer } from "react";

export interface Options {
    state?: State;
    reducers?: Reducers;
    modules?: Module[];
    plugins?: any[];
    compareState?: Boolean;
};

export interface InternalOptions {
    defaultState: State;
    state: State;
    reducers: Reducers;
    compareState: Boolean;
}

export interface Module {
    namespace?: string;
    state?: State;
    reducers?: Reducers;
};

export interface State {
    [key: string]: any;
};

export interface Reducers {
    [key: string]: Reducer<State, any>;
};

export type Hook = "onReady" | "onSave" | "onRead" | "onReducerInvoke";
