const formatter = require('../adapters/Formatter');

class FormatterController {
    constructor(router) {
        router.post('/formatt/json', this.json);
        router.post('/formatt/xml', this.xml);
        router.post('/unescape/json', this.unescapeJson);
        router.post('/unescape/xml', this.unescapeXml);
        router.post('/escape/json', this.escapeJson);
        router.post('/escape/xml', this.escapeXml);
    }

    async json(req, res) {
        res.send(await formatter.json(req.body.toString()));
    }

    async xml(req, res) {
        res.send(await formatter.xml(req.body.toString()));
    }

    async unescapeJson(req, res) {
        res.send(await formatter.unescapeJson(req.body.toString()));
    }

    async unescapeXml(req, res) {
        res.send(await formatter.unescapeXml(req.body.toString()));
    }

    async escapeJson(req, res) {
        res.send(await formatter.escapeJson(req.body.toString()));
    }

    async escapeXml(req, res) {
        res.send(await formatter.escapeXml(req.body.toString()));
    }
}

module.exports = (router) => new FormatterController(router);