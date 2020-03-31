const database = require('../adapters/Database');

class ProjectController {
    constructor(router) {
        router.post('/projects', this.upsert);
        router.get('/projects', this.getAll);
        router.delete('/projects/:name', this.delete);
    }

    async getAll(req, res) {
        res.send(await database.getAllProjects(req.user.email));
    }

    async upsert(req, res) {
        res.send(await database.upsertProject(req.user.email, req.body.name, req.body.configs));
    }

    async delete(req, res) {
        const {name} = req.params;
        res.send(await database.deleteProject(req.user.email, name));
    }
}

module.exports = (router) => new ProjectController(router);