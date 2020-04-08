const formatter = require('../adapters/Formatter');

class FormatterController {
    constructor(router) {
        router.post('/formatt/json', this.json);
        router.post('/formatt/xml', this.xml);
    }

    async json(req, res) {
        res.send(await formatter.json(req.body.toString()));
    }

    async xml(req, res) {
        res.send(await formatter.xml(req.body.toString()));
    }
}

module.exports = (router) => new FormatterController(router);