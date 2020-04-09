const request = require('request-promise');
const config = require('../configs/config');
const parser = require('fast-xml-parser');
const beautifier = require('xml-beautifier')

class Formatter {
    async json(body) {
        let {formatters: {json: {uri}}} = config;

        const result = await request({
            uri,
            method: 'POST',
            formData: {
                jsondata: body,
                jsontemplate: 1,
                jsonspec: 4,
                jsonfix: 'on',
                autoprocess: ''
            }
        });

        const response = JSON.parse(result);

        return {
            success: !response.result.errors.length,
            body: response.result.jsoncopy,
            errors: response.result.errors
        }
    }

    async xml(body) {
        const valid = parser.validate(body)
        const indentation = '    ';
        return {
            success: valid === true,
            body: valid === true ? beautifier(body, indentation) : null,
            errors: valid !== true ? [
                {
                    code: valid.err.code,
                    message: valid.err.msg,
                    element: valid.err.line
                }
            ] : null
        }
    }
}

module.exports = new Formatter();