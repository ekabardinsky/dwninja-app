const request = require('request-promise');
const config = require('../configs/config');

class DataWeave1 {
    async process(project) {
        const {configs: {expression, variables}} = project;
        const payload = variables.find(variable => variable.type === 'payload') || 	{ type: 'payload', mimeType: 'application/json', value: ''};
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
        return {
            success: true,
            data: [
                {
                    name: 'payload',
                    supportNestedNames: false
                },
                {
                    name: 'flowVars',
                    supportNestedNames: true
                }
            ]
        }
    }

    supportedVariableMimeTypes() {
        return {
            success: true,
            data: [
                'application/json',
                'application/xml',
                'application/csv',
                'application/java'
            ]
        }
    }

}

module.exports = new DataWeave1();