const path = require('path');
const fs = require('fs');

const { Client } = require('amocrm-js');
const config = require('./config');

const client = new Client(config);
const filePath = path.resolve(__dirname, './token.json');

const updateConnection = async () => {
    if (!client.connection.isTokenExpired()) {
        return;
    }
    await client.connection.update();
}

(async () => {
    let renewTimeout;

    client.token.on('change', () => {
        const token = client.token.getValue();
        fs.writeFileSync(filePath, JSON.stringify(token));

        // обновление токена по истечению
        const expiresIn = token.expires_in * 1000;

        clearTimeout(renewTimeout);
        renewTimeout = setTimeout(updateConnection, expiresIn);
    });

    if (fs.existsSync(filePath)) {
        try {
            const json = fs.readFileSync(filePath).toString();
            const currentToken = JSON.parse(json);
            client.token.setValue(currentToken);
        } catch (e) {
            // некорректный JSON-токен
        }
    }

    await client.connection.connect();
})();