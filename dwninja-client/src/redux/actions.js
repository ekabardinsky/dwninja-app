import {
    CHANGE_EXPRESSION,
    CHANGE_VALUE_CURRENT_VARIABLE,
    CREATE_VARIABLE,
    EVALUATION_END,
    EVALUATION_STARTED,
    GET_EVALUATORS,
    REMOVE_VARIABLE,
    SELECT_EVALUATOR,
    SELECT_INPUT_MIME_TYPE,
    SELECT_VARIABLE,
    UPDATE_LAST_OUTPUT,
    UPDATE_SELECTED_PROJECT,
    UPDATE_VARIABLE
} from "./actionTypes";

export const getEvaluators = payload => ({
    type: GET_EVALUATORS,
    payload
});

export const selectEvaluator = payload => ({
    type: SELECT_EVALUATOR,
    payload
});

export const selectInputMimeType = payload => ({
    type: SELECT_INPUT_MIME_TYPE,
    payload
});

export const changeValueCurrentVariable = payload => ({
    type: CHANGE_VALUE_CURRENT_VARIABLE,
    payload
});

export const changeExpression = payload => ({
    type: CHANGE_EXPRESSION,
    payload
});

export const updateSelectedProject = payload => ({
    type: UPDATE_SELECTED_PROJECT,
    payload
});

export const updateLastOutput = payload => ({
    type: UPDATE_LAST_OUTPUT,
    payload
});

export const evaluationStarted = payload => ({
    type: EVALUATION_STARTED,
    payload
});

export const evaluationEnd = payload => ({
    type: EVALUATION_END,
    payload
});

export const updateVariable = payload => ({
    type: UPDATE_VARIABLE,
    payload
});

export const removeVariable = payload => ({
    type: REMOVE_VARIABLE,
    payload
});

export const createVariable = payload => ({
    type: CREATE_VARIABLE,
    payload
});

export const selectVariable = payload => ({
    type: SELECT_VARIABLE,
    payload
});