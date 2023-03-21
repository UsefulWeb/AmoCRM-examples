const { Client } = require('amocrm-js');
const config = require('./config');

const client = new Client(config);

(async () => {
    const status = await client.connection.connect();
    console.log({ status });
})();