const request = require('request-promise');
const config = require('../configs/config');

class DataWeave1 {
    async process(project) {
        let {configs: {expression, variables}} = project;
        const payload = variables.find(variable => variable.type === 'payload') || {
            type: 'payload',
            mimeType: 'application/json',
            value: ''
        };
        const flowVars = variables
            .filter(variable => variable.type === 'flowVars')
            .map(variable => ({
                type: variable.mimeType,
                name: `flowVars.${variable.name}`,
                value: variable.value
            }));

        const sessionVars = variables
            .filter(variable => variable.type === 'sessionVars')
            .map(variable => ({
                type: variable.mimeType,
                name: `flowVars.sessionVars_${variable.name}`,
                value: variable.value
            }));
        expression = expression.replace(/sessionVars\./g, 'flowVars.sessionVars_');
        expression = expression.replace(/sessionVars\[\'(.*)\'\]/g, 'flowVars[\'sessionVars_$1\']');
        expression = expression.replace(/sessionVars\[(.*)\]/g, 'flowVars[(\'sessionVars_\' ++ $1)]');

        const inboundProperties = variables
            .filter(variable => variable.type === 'inboundProperties')
            .map(variable => ({
                type: variable.mimeType,
                name: `flowVars.inboundProperties_${variable.name}`,
                value: variable.value
            }));
        expression = expression.replace(/inboundProperties\./g, 'flowVars.inboundProperties_');
        expression = expression.replace(/inboundProperties\[\'(.*)\'\]/g, 'flowVars[\'inboundProperties_$1\']');
        expression = expression.replace(/inboundProperties\[(.*)\]/g, 'flowVars[(\'inboundProperties_\' ++ $1)]');

        const p = variables
            .filter(variable => variable.type === 'p')
            .map(variable => ({
                type: variable.mimeType,
                name: `flowVars.p_${variable.name}`,
                value: variable.value
            }));
        expression = expression.replace(/p\(\'(.*)\'\)/g, 'flowVars[\'p_$1\']');
        expression = expression.replace(/p\((.*)\)/g, 'flowVars[(\'p_\' ++ $1)]');

        const evalOptions = {
            payload: {
                name: 'payload',
                type: payload.mimeType,
                value: payload.value
            },
            expression,
            flowVars: flowVars.concat(sessionVars).concat(inboundProperties).concat(p)
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
                required: true,
                isFunction: false
            },
            {
                name: 'flowVars',
                supportNestedNames: true,
                required: false,
                isFunction: false
            },
            {
                name: 'sessionVars',
                supportNestedNames: true,
                required: false,
                isFunction: false
            },
            {
                name: 'inboundProperties',
                supportNestedNames: true,
                required: false,
                isFunction: false
            },
            {
                name: 'p',
                supportNestedNames: true,
                required: false,
                isFunction: true
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