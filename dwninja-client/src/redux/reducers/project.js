import {GET_EVALUATORS, SELECT_EVALUATOR, SELECT_INPUT_MIME_TYPE} from "../actionTypes";

const initialState = {
    evaluators: [],
    selectedEvaluator: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_EVALUATORS: {
            return {
                ...state,
                evaluators: action.payload.data,
                selectedEvaluator: action.payload.data[0],
                selectedInputMimeType: action.payload.data[0].variableMimeTypes[0]
            }
        }
        case SELECT_EVALUATOR: {
            return {
                ...state,
                selectedEvaluator: action.payload
            }
        }
        case SELECT_INPUT_MIME_TYPE: {
            return {
                ...state,
                selectedInputMimeType: action.payload
            }
        }
        default:
            return state;
    }
}
