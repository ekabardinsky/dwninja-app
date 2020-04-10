const {parse, parseLines, stringify} = require('dot-properties')

class Parser {
    async property(body) {
        const properties = parse(body);
        const keys = Object.keys(properties);
        // run over properties and replace injected values
        keys.forEach(key => {
            const injectableKeyPattern = `\$\{${key}\}`;
            const injectableValue = properties[key];

            // run over other properties and replace by pattern
            keys.forEach(key => {
                properties[key] = properties[key].replace(injectableKeyPattern, injectableValue);
            });
        });

        // map properties to variables
        const variables = keys.map(key => ({type: 'p', name: key, mimeType: 'application/java', value: properties[key]}));
        return {
            success: true,
            body: variables
        }
    }
}

module.exports = new Parser();