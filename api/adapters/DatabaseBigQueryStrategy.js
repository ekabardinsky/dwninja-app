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

    async getProjects(userId) {
        return await this.runQueryJob(`SELECT * FROM ${this.getTableName('projects')} WHERE userId='${userId}'`);
    }

    async deleteProjectByIds(ids) {
        return await this.runQueryJob(`DELETE FROM ${this.getTableName('projects')} WHERE id in (${ids.map(id => `'${id}'`).join(',')})`);
    }

    async upsertProject(email, name, configs) {
        const user = await this.getUser(email);
        const projects = await this.getProjects(user.id);
        const filtered = projects.filter(project => project.name === name);

        const data = [{
            id: this.getNextUuid(),
            userId: user.id,
            name,
            configs
        }];

        await this.loadData(data, 'projects');

        if (filtered.length > 0) {
            await this.deleteProjectByIds(
                filtered.map(project => project.id)
            );
        }

        return {success: true}
    }

    async deleteProject(email, name) {
        const user = await this.getUser(email);
        const projects = await this.getProjects(user.id);
        const filtered = projects.filter(project => project.name === name);

        if (filtered.length > 0) {
            await this.deleteProjectByIds(
                filtered.map(project => project.id)
            );
        }

        return {success: true};
    }

    async getAllProjects(email) {
        const user = await this.getUser(email);
        const data = await this.getProjects(user.id);
        return {success: true, data};
    }
}

module.exports = DatabaseBigQueryStrategy;