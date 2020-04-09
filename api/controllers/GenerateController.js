const generator = require('../adapters/Generator');

class GenerateController {
    constructor(router) {
        router.post('/generate/dw', this.dw);
    }

    async dw(req, res) {
        res.send(await generator.dw(req.body));
    }
}

module.exports = (router) => new GenerateController(router);