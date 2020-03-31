module.exports = {
    authorization: {
        secret: process.env.SECRET
    },
    bigQuery: {
        project: 'dwninja',
        dataset: 'user_data',
        tmpDir: process.env.TMP_DIR
    },
    dw1: {
        uri: 'http://dwninja.ekabardinsky.net/api/executors/dw'
    },
    dw2: {
        uri: 'http://dwninja2.ekabardinsky.net/api/executors/dw'
    }
};