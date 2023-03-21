const { Client } = require('amocrm-js');
const config = require('./config');
const code = require('./code');

const client = new Client(config);
client.auth.setCode(code);

(async () => {
    const status = await client.connection.connect();

    console.log({ status });
})();