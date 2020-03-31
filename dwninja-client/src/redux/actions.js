import {
    GET_EVALUATORS,
    SELECT_EVALUATOR,
    SELECT_INPUT_MIME_TYPE
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