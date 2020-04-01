const request = require('request-promise');
const config = require('../configs/config');

class DataWeave1 {
    async process(project) {
        const {configs: {expression, variables}} = project;
        const payload = variables.find(variable => variable.type === 'payload') || {
            type: 'payload',
            mimeType: 'application/json',
            value: ''
        };
        const flowVars = variables
            .filter(variable => variable.type !== 'payload')
            .map(variable => ({
                type: variable.mimeType,
                name: `${variable.type}.${variable.name}`,
                value: variable.value
            }));

        const evalOptions = {
            payload: {
                name: 'payload',
                type: payload.mimeType,
                value: payload.value
            },
            expression,
            flowVars
        };

        const result = await request({
            uri: config.dw1.uri,
            method: 'POST',
            json: true,
            body: evalOptions
        });

        const expressionMimeType = expression.match(/%output\s(.*)/)[1].trim();

        return {
            result: expressionMimeType.includes("json") ? JSON.stringify(result, 2, 2) : result,
            mimeType: expressionMimeType
        }
    }

    supportedVariableTypes() {
        return [
            {
                name: 'payload',
                supportNestedNames: false,
                required: true
            },
            {
                name: 'flowVars',
                supportNestedNames: true,
                required: false
            }
        ];
    }

    supportedVariableMimeTypes() {
        return [
            'application/json',
            'application/xml',
            'application/csv',
            'application/java'
        ];
    }

    getDisplayName() {
        return "DataWeave 1.0";
    }

    getExample() {
        return {
            "name": "test",
            "configs": {
                "evaluator": "dw-1",
                "expression": "%dw 1.0 \n%output application/json \n--- \nflowVars.greeting",
                "variables": [
                    {
                        "type": "payload",
                        "name": "payload",
                        "mimeType": "application/java",
                        "value": "Welcome to DataWeave Ninja dear "
                    },
                    {
                        "type": "flowVars",
                        "name": "greeting",
                        "mimeType": "application/json",
                        "value": "{\"root\": \"value\"}"
                    }
                ]
            }
        }
    }
}

module.exports = new DataWeave1();