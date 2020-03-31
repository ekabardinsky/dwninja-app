const request = require('request-promise');
const config = require('../configs/config');

class DataWeave2 {
    async process(project) {
        const {configs: {expression, variables}} = project;
        const payload = variables.find(variable => variable.type === 'payload') || {
            type: 'payload',
            mimeType: 'application/json',
            value: ''
        };
        const vars = variables
            .filter(variable => variable.type !== 'payload')
            .map(variable => ({
                mimetype: variable.mimeType,
                name: `${variable.type}.${variable.name}`,
                value: variable.value
            }));

        const evalOptions = {
            payload: {
                name: 'payload',
                mimetype: payload.mimeType,
                value: payload.value
            },
            expression,
            vars
        };

        const result = await request({
            uri: config.dw2.uri,
            method: 'POST',
            json: true,
            body: evalOptions
        });

        const expressionMimeType = expression.match(/output\s(.*)/)[1].trim();

        return {
            result: expressionMimeType.includes("json") ? JSON.stringify(result, 2, 2) : result,
            mimeType: expressionMimeType
        }
    }

    supportedVariableTypes() {
        return [
            {
                name: 'payload',
                supportNestedNames: false
            },
            {
                name: 'vars',
                supportNestedNames: true
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
        return "DataWeave 2.0";
    }
}

module.exports = new DataWeave2();