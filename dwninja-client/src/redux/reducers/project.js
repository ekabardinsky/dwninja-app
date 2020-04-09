import {
    CHANGE_EXPRESSION,
    CHANGE_THEME,
    CHANGE_VALUE_CURRENT_VARIABLE, CLOSE_ALERT, CLOSE_RUNNING_SPLASH,
    CREATE_COLLECTION,
    CREATE_LAB,
    CREATE_VARIABLE,
    DELETE_COLLECTION,
    DELETE_LAB,
    EVALUATION_END,
    EVALUATION_STARTED,
    GET_EVALUATORS,
    LOAD_STATE, OPEN_ALERT, OPEN_RUNNING_SPLASH,
    REMOVE_VARIABLE,
    RENAME_COLLECTION,
    RENAME_LAB,
    SAVE_COLLECTION,
    SELECT_EVALUATOR,
    SELECT_INPUT_MIME_TYPE,
    SELECT_LAB,
    SELECT_VARIABLE,
    UPDATE_LAST_OUTPUT,
    UPDATE_SELECTED_PROJECT,
    UPDATE_VARIABLE
} from "../actionTypes";
import {post} from "../../utils/Api";

let variablesCounter = 0;

const initialState = {
    evaluators: [{
        name: "dw-1",
        variableTypes: [
            {
                name: "payload",
                supportNestedNames: false,
                required: true,
                isFunction: false
            },
            {
                name: "flowVars",
                supportNestedNames: true,
                required: false,
                isFunction: false
            }
        ],
        variableMimeTypes: [
            "application/json",
            "application/xml",
            "application/csv",
            "application/java"
        ],
        displayName: "DataWeave 1.0",
    }],
    selectedEvaluator: {
        name: "dw-1",
        variableTypes: [
            {
                name: "payload",
                supportNestedNames: false,
                required: true,
                isFunction: false
            },
            {
                name: "flowVars",
                supportNestedNames: true,
                required: false,
                isFunction: false
            }
        ],
        variableMimeTypes: [
            "application/json",
            "application/xml",
            "application/csv",
            "application/java"
        ],
        displayName: "DataWeave 1.0",
    },
    selectedProject: {
        name: 'Temp lab',
        configs: {
            evaluator: 'dw-1',
            expression: '%dw 1.0 \\n%output application/json \\n--- \\nflowVars.greeting',
            variables: [
                {
                    type: "payload",
                    name: "payload",
                    mimeType: "application/java",
                    value: "Welcome to DataWeave Ninja dear "
                },
                {
                    type: "flowVars",
                    name: "greeting",
                    mimeType: "application/json",
                    value: "{\"root\": \"value\"}"
                }
            ]
        }
    },
    selectedVariable: {
        type: "payload",
        name: "payload",
        mimeType: "application/java",
        value: "Welcome to DataWeave Ninja dear "
    },
    lastOutput: {result: '', mimeType: 'application/json'},
    isEvaluate: false,
    collections: [
        {
            name: "Temp collection",
            labs: [{
                name: 'Temp lab',
                configs: {
                    evaluator: 'dw-1',
                    expression: '%dw 1.0 \\n%output application/json \\n--- \\nflowVars.greeting',
                    variables: [
                        {
                            type: "payload",
                            name: "payload",
                            mimeType: "application/java",
                            value: "Welcome to DataWeave Ninja dear "
                        },
                        {
                            type: "flowVars",
                            name: "greeting",
                            mimeType: "application/json",
                            value: "{\"root\": \"value\"}"
                        }
                    ]
                }
            }]
        }
    ],
    selectedCollection: "Temp collection",
    selectedTheme: "eclipse",
    stateLoaded: false,
    alert: {open: false},
    running: false
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
            const newState = updateVariable(state, {
                payload: {
                    oldVariable: state.selectedVariable,
                    newVariable: state.selectedVariable
                }
            });
            return {
                ...newState,
                selectedVariable: action.payload
            }
        }
        case DELETE_COLLECTION: {
            const collections = state.collections.filter(collection => collection.name !== action.payload);
            return {
                ...state,
                collections: JSON.parse(JSON.stringify(collections)) // TODO: handle this fancy trick properly
            }
        }
        case DELETE_LAB: {
            const currentCollection = JSON.parse(
                JSON.stringify(
                    state.collections.find(collection => collection.name === action.payload.collectionName)
                )
            );// TODO: handle this fancy trick properly
            currentCollection.labs = currentCollection.labs.filter(lab => lab.name !== action.payload.name);

            const collections = state.collections.filter(collection => collection.name !== action.payload.collectionName);
            collections.push(currentCollection);

            return {
                ...state,
                collections
            }
        }
        case SAVE_COLLECTION: {
            const currentCollection = state.collections.find(collection => collection.name === state.selectedCollection);
            currentCollection.labs = currentCollection.labs.filter(lab => lab.name !== state.selectedProject.name);
            currentCollection.labs.push(state.selectedProject);

            return JSON.parse(JSON.stringify(state))
        }
        case SELECT_LAB: {
            const selectedCollection = action.payload.collectionName;
            const selectedProject = state.collections
                .find(collection => collection.name === selectedCollection)
                .labs
                .find(lab => lab.name === action.payload.name);
            const selectedEvaluator = state.evaluators.find(evaluator => evaluator.name === selectedProject.configs.evaluator);
            const selectedVariable = selectedProject.configs.variables[0];

            return {
                ...state,
                selectedCollection,
                selectedProject,
                selectedEvaluator,
                selectedVariable
            }
        }

        case CREATE_COLLECTION: {
            console.log(action.payload)
            const newCollection = {
                name: action.payload,
                labs: []
            };

            const collections = JSON.parse(JSON.stringify(state.collections));
            collections.push(newCollection);

            return {
                ...state,
                collections
            }
        }

        case CREATE_LAB: {
            const selectedCollection = state.collections
                .find(collection => collection.name === action.payload.collectionName);

            selectedCollection.labs.push({
                name: action.payload.name,
                configs: state.evaluators.find(evaluator => evaluator.name === action.payload.evaluatorName).example.configs
            });

            const collections = JSON.parse(JSON.stringify(state.collections));

            return {
                ...state,
                collections
            }
        }

        case RENAME_COLLECTION: {
            const selectedCollection = state.collections.find(collection => collection.name === action.payload.name);
            selectedCollection.name = action.payload.newName;

            const collections = JSON.parse(JSON.stringify(state.collections));

            return {
                ...state,
                collections,
                selectedCollection: state.selectedCollection === action.payload.name ? action.payload.newName : state.selectedCollection
            }
        }

        case RENAME_LAB: {
            const selectedCollection = state.collections.find(collection => collection.name === action.payload.collectionName);
            const selectedLab = selectedCollection.labs.find(lab => lab.name === action.payload.name);
            selectedLab.name = action.payload.newName;

            const collections = JSON.parse(JSON.stringify(state.collections));

            return {
                ...state,
                collections,
                selectedProject: state.selectedCollection === action.payload.collectionName && state.selectedProject.name === action.payload.name ? {
                    ...state.selectedProject,
                    name: action.payload.newName
                } : state.selectedProject
            }
        }

        case CHANGE_THEME: {
            return {
                ...state,
                selectedTheme: action.payload
            }
        }

        case LOAD_STATE: {
            if (action.payload.data) {
                return {
                    ...action.payload.data,
                    evaluators: state.evaluators,
                    stateLoaded: true
                }
            } else {
                return {
                    ...state,
                    stateLoaded: true
                };
            }
        }

        case OPEN_ALERT: {
            return {
                ...state,
                alert: {open: true, ...action.payload}
            }
        }

        case CLOSE_ALERT: {
            return {
                ...state,
                alert: {open: false}
            }
        }

        case OPEN_RUNNING_SPLASH: {
            return {
                ...state,
                running: true
            }
        }

        case CLOSE_RUNNING_SPLASH: {
            return {
                ...state,
                running: false
            }
        }

        default:
            return state;
    }
}