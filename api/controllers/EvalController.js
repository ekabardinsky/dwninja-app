const dataWeave1 = require('../adapters/DataWeave1');
const dataWeave2 = require('../adapters/DataWeave2');
const evaluators = {
    'dw-1': dataWeave1,
    'dw-2': dataWeave2
};

class EvalController {
    constructor(router) {
        router.post('/evaluators/:evaluatorName/eval', this.evalScript);
        router.get('/evaluators', this.all);
    }

    async evalScript(req, res) {
        const evaluator = evaluators[req.params.evaluatorName];
        const data = await evaluator.process(req.body);
        res.send({success: true, data});
    }

    async all(req, res) {
        const evaluatorsMetadata = Object
            .keys(evaluators)
            .map(evaluatorName =>({
                name: evaluatorName,
                variableTypes: evaluators[evaluatorName].supportedVariableTypes(),
                variableMimeTypes: evaluators[evaluatorName].supportedVariableMimeTypes(),
                displayName: evaluators[evaluatorName].getDisplayName(),
                example: evaluators[evaluatorName].getExample()
            }));
        res.send({success: true, data: evaluatorsMetadata});
    }
}

module.exports = (router) => new EvalController(router);