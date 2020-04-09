const request = require('request-promise');
const config = require('../configs/config');

class Generator {
    async dw(body) {
        const {generators: {dw: {uri}}} = config;
        const {input, inputMimetype, output, outputMimetype, outputNamingStyle} = body;

        const result = await request({
            uri,
            method: 'POST',
            json: true,
            body: {input, inputMimetype, output, outputMimetype, outputNamingStyle}
        });

        return {
            success: result.code === '0',
            body: result.message
        }
    }
}

module.exports = new Generator();