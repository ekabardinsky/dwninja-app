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
} from "../actionTypes";
import {post} from "../../utils/Api";

let variablesCounter = 0;

const initialState = {
    evaluators: [],
    selectedEvaluator: null,
    selectedProject: {
        name: 'test',
        configs: {
            evaluator: 'java',
            expression: '',
            variables: []
        }
    },
    selectedVariable: {type: 'payload', name: 'payload', mimeType: 'application/json', value: '{}'},
    lastOutput: {result: '', mimeType: 'application/json'},
    isEvaluate: false
};

function updateVariable(state, action) {
    const variables = state.selectedProject.configs.variables
        .filter(variable => variable.name !== action.payload.oldVariable.name || variable.type !== action.payload.oldVariable.type);
    variables.push(action.payload.newVariable);

    // project data
    const expression = state.selectedProject.configs.expression;
    const evaluator = state.selectedProject.configs.evaluator;
    const name = state.selectedProject.name;

    // new instance
    const newProjectInstance = {name, configs: {evaluator, expression, variables}};
    const selectedProject = JSON.parse(JSON.stringify(newProjectInstance)); // TODO: handle this fancy trick properly

    return {
        ...state,
        selectedProject,
        selectedVariable: action.payload.newVariable
    }
}

function updateSelectedProject(state, action) {
    const variables = state.selectedProject.configs.variables
        .filter(variable => variable.name !== state.selectedVariable.name || variable.type !== state.selectedVariable.type);
    variables.push(state.selectedVariable);

    // project data
    const expression = state.selectedProject.configs.expression;
    const evaluator = state.selectedProject.configs.evaluator;
    const name = state.selectedProject.name;

    // new instance
    const newProjectInstance = {name, configs: {evaluator, expression, variables}};
    const selectedProject = JSON.parse(JSON.stringify(newProjectInstance)); // TODO: handle this fancy trick properly

    return {
        ...state,
        selectedProject
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_EVALUATORS: {
            return {
                ...state,
                evaluators: action.payload.data,
                selectedEvaluator: action.payload.data[0],
                selectedProject: action.payload.data[0].example,
                selectedVariable: action.payload.data[0].example.configs.variables[0]
            }
        }
        case SELECT_EVALUATOR: {
            return {
                ...state,
                selectedEvaluator: action.payload,
                selectedProject: action.payload.example,
                selectedVariable: action.payload.example.configs.variables[0]
            }
        }
        case SELECT_INPUT_MIME_TYPE: {
            return {
                ...state,
                selectedVariable: {...state.selectedVariable, mimeType: action.payload}
            }
        }
        case CHANGE_VALUE_CURRENT_VARIABLE: {
            return {
                ...state,
                selectedVariable: {...state.selectedVariable, value: action.payload}
            }
        }
        case CHANGE_EXPRESSION: {
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    configs: {...state.selectedProject.configs, expression: action.payload}
                }
            }
        }
        case UPDATE_SELECTED_PROJECT: {
           return updateSelectedProject(state, action);
        }
        case UPDATE_LAST_OUTPUT: {
            return {
                ...state,
                lastOutput: action.payload.success ? action.payload.data : {
                    result: action.payload.error,
                    mimeType: 'application/json'
                }
            }
        }
        case EVALUATION_STARTED: {
            const updatedProject = updateSelectedProject(state, action);

            // call api
            // send project to evaluate
            post(`/public/api/evaluators/${updatedProject.selectedProject.configs.evaluator}/eval`, updatedProject.selectedProject, (result) => {
                action.payload.updateLastOutput(result);

                // set isEvaluate = false
                action.payload.evaluationEnd();
            });

            return {
                ...updatedProject,
                isEvaluate: true
            }
        }
        case EVALUATION_END: {
            return {
                ...state,
                isEvaluate: false
            }
        }
        case UPDATE_VARIABLE: {
            return updateVariable(state, action);
        }
        case REMOVE_VARIABLE: {
            const variables = state.selectedProject.configs.variables
                .filter(variable => variable.name !== action.payload.name || variable.type !== action.payload.type);

            // project data
            const expression = state.selectedProject.configs.expression;
            const evaluator = state.selectedProject.configs.evaluator;
            const name = state.selectedProject.name;

            // new instance
            const newProjectInstance = {name, configs: {evaluator, expression, variables}};
            const selectedProject = JSON.parse(JSON.stringify(newProjectInstance)); // TODO: handle this fancy trick properly

            return {
                ...state,
                selectedProject,
                selectedVariable: state.selectedProject.configs.variables[0]
            }
        }
        case CREATE_VARIABLE: {
            const newVariable = {
                type: state.selectedEvaluator.variableTypes.find(type => type.supportNestedNames).name,
                name: 'newVar' + variablesCounter++,
                mimeType: state.selectedEvaluator.variableMimeTypes[0],
                value: ''
            };

            const variables = state.selectedProject.configs.variables;
            variables.push(newVariable);

            // project data
            const expression = state.selectedProject.configs.expression;
            const evaluator = state.selectedProject.configs.evaluator;
            const name = state.selectedProject.name;

            // new instance
            const newProjectInstance = {name, configs: {evaluator, expression, variables}};
            const selectedProject = JSON.parse(JSON.stringify(newProjectInstance)); // TODO: handle this fancy trick properly

            return {
                ...state,
                selectedProject,
                selectedVariable: state.selectedProject.configs.variables[0]
            }
        }
        case SELECT_VARIABLE: {
            const newState = updateVariable(state, {payload: {oldVariable: state.selectedVariable, newVariable: state.selectedVariable}});
            return {
                ...newState,
                selectedVariable: action.payload
            }
        }
        default:
            return state;
    }
}
