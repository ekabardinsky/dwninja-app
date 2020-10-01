const request = require('request-promise');
const config = require('../configs/config');
const parser = require('fast-xml-parser');
const xmlFormat = require('xml-formatter');
const jsonUnescape = require('unscape-json-recursively');
const jsonEscape = require('jsesc');
const xmlEntities = require('entities');

class Formatter {
    async json(body) {
        let {formatters: {json: {uri}}} = config;
        const formData = {
            data: body,
            jsontemplate: 1,
            jsonspec: 4,
            jsonfix: 'on',
            autoprocess: '',
            version: 1
        }

        const result = await request({
            url: uri,
            method: 'POST',
            formData
        });

        const response = JSON.parse(result);

        return {
            success: !response.result.errors.length,
            body: response.result.data,
            errors: response.result.errors
        }
    }

    async xml(body) {
        const valid = parser.validate(body)
        const indentation = '  ';
        return {
            success: valid === true,
            body: valid === true ? xmlFormat(body, {
                indentation,
                collapseContent: true,
                lineSeparator: '\n'
            }) : null,
            errors: valid !== true ? [
                {
                    code: valid.err.code,
                    message: valid.err.msg,
                    element: valid.err.line
                }
            ] : null
        }
    }

    async unescapeJson(body) {
        return {success: true, body: jsonUnescape(body)};
    }

    async unescapeXml(body) {
        return {success: true, body: xmlEntities.decodeXML(body)}
    }

    async escapeJson(body) {
        return {
            success: true, body: jsonEscape(body, {wrap: true, quotes: 'double'})
        }
    }

    async escapeXml(body) {
        return {success: true, body: xmlEntities.encodeXML(body)}
    }
}

module.exports = new Formatter();