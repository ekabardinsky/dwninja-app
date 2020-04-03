const {BigQuery} = require('@google-cloud/bigquery');
const md5 = require('js-md5');
const bigqueryClient = new BigQuery();
const configs = require('../configs/config');
const project = configs.bigQuery.project;
const dataset = configs.bigQuery.dataset;
const fs = require("fs").promises;
const path = require('path');

class DatabaseBigQueryStrategy {
    getTableName(name) {
        return `\`${project}.${dataset}.${name}\``;
    }

    getNextUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async runQueryJob(query) {
        const options = {
            configuration: {
                query: {
                    query,
                    useLegacySql: false,
                },
            },
        };

        // Make API request.
        const response = await bigqueryClient.createJob(options);
        const job = response[0];

        // Wait for the query to finish
        const [rows] = await job.getQueryResults(job);
        return rows;
    }

    async loadData(data, table) {
        const filename = `${configs.bigQuery.tmpDir}${path.sep}${table}_${this.getNextUuid()}.json`;
        await fs.writeFile(filename, data.map(row => JSON.stringify(row)).join("\n"));

        try {
            const [job] = await bigqueryClient
                .dataset(dataset)
                .table(table)
                .load(filename);

            // Check the job's status for errors
            const errors = job.status.errors;
            if (errors && errors.length > 0) {
                throw errors;
            }
        } catch (e) {
            throw e;
        }
    }

    async getUser(email) {
        const users = await this.runQueryJob(`SELECT * FROM ${this.getTableName('users')} WHERE email='${email}'`);
        return users[0];
    }

    async createUser(email, password) {
        const user = await this.getUser(email);

        if (user) {
            throw new Error("User already registered");
        }


        return await this.loadData([{id: this.getNextUuid(), email, password: md5(password)}], 'users');
    }

    async deleteStateByIds(ids) {
        return await this.runQueryJob(`DELETE FROM ${this.getTableName('states')} WHERE id in (${ids.map(id => `'${id}'`).join(',')})`);
    }

    async upsertState(email, newState) {
        const users = await this.runQueryJob(`
            SELECT users.*, states.id as stateId FROM ${this.getTableName('users')} as users
            LEFT OUTER JOIN ${this.getTableName('states')} as states on states.userId = users.id
            where users.email = '${email}'
        `);

        if (!users.length) return {success: false};

        const user = users[0];
        const data = [{
            id: this.getNextUuid(),
            userId: user.id,
            state: JSON.stringify(newState)
        }];

        await this.loadData(data, 'states');

        const ids = users.map(user => user.stateId).filter(stateId => stateId != null);
        if (ids.length) {
            await this.deleteStateByIds(ids);
        }

        return {success: true}
    }

    async getStateByEmail(email) {
        const data = await this.runQueryJob(`
            SELECT states.* FROM ${this.getTableName('states')} as states
            JOIN ${this.getTableName('users')} as users on states.userId = users.id
            where users.email = '${email}'
        `);

        return {
            success: true,
            data: data.length ? JSON.parse(data[0].state) : null
        };
    }
}

module.exports = DatabaseBigQueryStrategy;