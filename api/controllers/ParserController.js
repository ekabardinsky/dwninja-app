const parser = require('../adapters/Parser');

class ParserController {
    constructor(router) {
        router.post('/parse/property', this.property);
    }

    async property(req, res) {
        res.send(await parser.property(req.body.toString()));
    }
}

module.exports = (router) => new ParserController(router);