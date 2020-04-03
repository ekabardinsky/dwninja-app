const database = require('../adapters/Database');

class StateController {
    constructor(router) {
        router.post('/state', this.upsert);
        router.get('/state', this.getAll);
    }

    async getAll(req, res) {
        res.send(await database.getStateByEmail(req.user.email));
    }

    async upsert(req, res) {
        res.send(await database.upsertState(req.user.email, req.body));
    }
}

module.exports = (router) => new StateController(router);