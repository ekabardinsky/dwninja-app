module.exports = {
    authorization: {
        secret: process.env.SECRET
    },
    bigQuery: {
        project: 'dwninja',
        dataset: 'user_data',
        tmpDir: process.env.TMP_DIR | './tmp'
    },
    dw1: {
        uri: 'http://dwninja.ekabardinsky.net/api/executors/dw'
    },
    dw2: {
        uri: 'http://84.201.168.27:8081/api/transform'
    },
    formatters: {
        json: {
            uri: 'https://jsonformatter.curiousconcept.com/process'
        },
        xml: {
            uri: 'https://www.liquid-technologies.com/api/Formatter'
        }
    },
    generators: {
        dw: {
            uri: 'http://84.201.168.27:9000/api/generate'
        }
    }
};