const request = require('request-promise');
const config = require('../configs/config');

class DataWeave2 {
    async process(project) {
        let {configs: {expression, variables}} = project;
        const payload = variables.find(variable => variable.type === 'payload') || {
            type: 'payload',
            mimeType: 'application/json',
            value: ''
        };
        const vars = variables
            .filter(variable => variable.type === 'vars')
            .map(variable => ({
                mimeType: variable.mimeType,
                name: `${variable.name}`,
                value: variable.value
            }));

        const attributes = variables
            .filter(variable => variable.type === 'attributes')
            .map(variable => ({
                mimeType: variable.mimeType,
                name: `attributes_${variable.name}`,
                value: variable.value
            }));
        expression = expression.replace(/attributes\./g, 'vars.attributes_');
        expression = expression.replace(/attributes\[\'(.*)\'\]/g, 'vars.\'attributes_$1\'');
        expression = expression.replace(/attributes\[(.*)\]/g, 'vars[(\'attributes_\' ++ $1)]');

        const p = variables
            .filter(variable => variable.type === 'p')
            .map(variable => ({
                mimeType: variable.mimeType,
                name: `p_${variable.name}`,
                value: variable.value
            }));
        expression = expression.replace(/p\(\'(.*)\'\)/g, 'vars.\'p_$1\'');
        expression = expression.replace(/p\((.*)\)/g, 'vars[(\'p_\' ++ $1)]');

        const evalOptions = {
            payload: {
                mimeType: payload.mimeType,
                value: payload.value
            },
            dw: expression,
            vars: vars.concat(attributes).concat(p)
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
                supportNestedNames: false,
                required: true,
                isFunction: false
            },
            {
                name: 'vars',
                supportNestedNames: true,
                required: false,
                isFunction: false
            },
            {
                name: 'attributes',
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
        return "DataWeave 2.0";
    }

    getExample() {
        return {
            "name": "Temp lab",
            "configs": {
                "evaluator": "dw-2",
                "expression": "%dw 2.0\nimport * from dw::core::Strings\noutput application/json\n--- \npayload",
                "variables": [
                    {
                        "type": "payload",
                        "name": "payload",
                        "mimeType": "application/json",
                        "value": "{ \"title\": \"DataWeave\" }"
                    },
                    {
                        "type": "vars",
                        "name": "name",
                        "mimeType": "application/java",
                        "value": "ninja 2"
                    }
                ]
            }
        }
    }
}

module.exports = new DataWeave2();