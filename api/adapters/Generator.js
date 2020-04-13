const request = require('request-promise');
const config = require('../configs/config');

class Generator {
    async dw(body) {
        const {generators: {dw: {uri}}} = config;
        const {input, inputMimetype, output, outputMimetype, outputNamingStyle, dwVersion, variableName} = body;

        try {
            const result = await request({
                uri,
                method: 'POST',
                json: true,
                body: {input, inputMimetype, output, outputMimetype, outputNamingStyle}
            });

            return {
                success: result.code === '0',
                body: this.hackDwVersion(result.message, variableName, dwVersion)
            }
        } catch (e) {
            return {
                success: false,
                error: e.error.message
            }
        }
    }

    hackDwVersion(dw, variableName, version) {
        // change dw version
        dw = dw.replace(/%dw \d.0/g, `%dw ${version === 'dw-1' ? '1.0' : '2.0'}`);

        // change output mime type
        if (version === 'dw-1') {
            dw = dw.replace(/output\s(.*)/g, '%output $1');
        }

        // replace payload with selected variable
        if (variableName !== 'payload') {
            dw = dw.replace(/payload/g, `${variableName}`);
        }

        return dw;
    }
}

module.exports = new Generator();