// init express
const appPort = process.env.PORT | 8080;
const logger = require("./utils/logger");
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const apiRoute = express.Router();
const public = express.Router();
const passport = require('passport');
require("./passport/passport");
require("express-async-await")(apiRoute); // async support
require("express-async-await")(public); // async support
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.raw({ type: 'text/plain' })); // parse text/plain
app.use(bodyParser.raw({ type: 'application/xml' })); // parse application/xml

require("./controllers/AuthController")(public);
new require("./controllers/StateController")(apiRoute);
new require("./controllers/EvalController")(public);
new require("./controllers/FormatterController")(public);

// start to listening for calls
app.use('/public/api/', public);
app.use('/api', passport.authenticate('jwt', {session: false}), apiRoute);

// start jobs
require("./jobs");

app.use((err, req, res, next) => {
    if (err) {
        res.send({
            success: false,
            error: err.message
        });
    }
});

app.listen(appPort, function () {
    logger.info(`Api started at ${appPort}`);
});
