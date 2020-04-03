import {
    CHANGE_EXPRESSION, CHANGE_THEME,
    CHANGE_VALUE_CURRENT_VARIABLE, CREATE_COLLECTION, CREATE_LAB,
    CREATE_VARIABLE, DELETE_COLLECTION, DELETE_LAB,
    EVALUATION_END,
    EVALUATION_STARTED,
    GET_EVALUATORS, LOAD_STATE,
    REMOVE_VARIABLE, RENAME_COLLECTION, RENAME_LAB, SAVE_COLLECTION,
    SELECT_EVALUATOR,
    SELECT_INPUT_MIME_TYPE, SELECT_LAB,
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

export const deleteCollection = payload => ({
    type: DELETE_COLLECTION,
    payload
});

export const deleteLab = payload => ({
    type: DELETE_LAB,
    payload
});

export const saveCollection = payload => ({
    type: SAVE_COLLECTION,
    payload
});

export const selectLab = payload => ({
    type: SELECT_LAB,
    payload
});

export const createCollection = payload => ({
    type: CREATE_COLLECTION,
    payload
});

export const createLab = payload => ({
    type: CREATE_LAB,
    payload
});

export const renameCollection = payload => ({
    type: RENAME_COLLECTION,
    payload
});

export const renameLab = payload => ({
    type: RENAME_LAB,
    payload
});

export const changeTheme = payload => ({
    type: CHANGE_THEME,
    payload
});

export const loadState = payload => ({
    type: LOAD_STATE,
    payload
});