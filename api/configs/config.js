module.exports = {
    authorization: {
        secret: process.env.SECRET
    },
    bigQuery: {
        project: 'dwninja',
        dataset: 'user_data',
        tmpDir: process.env.TMP_DIR
    }
};