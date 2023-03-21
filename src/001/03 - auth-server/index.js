const ngrok = require('ngrok');
const { Client } = require('amocrm-js');
const config = require('./config');

const client = new Client(config);

(async () => {
    console.log('Включаю ngrok...');
    const url = await ngrok.connect(config.auth.server.port);
    console.log('Укажите адрес в настройках интеграции AmoCRM:', url);

    client.environment.set('auth.redirect_uri', url);

    const authUrl = client.auth.getUrl();
    console.log('Перейдите по адресу для завершения авторизации', authUrl);

    try {
        const connected = await client.connection.connect();
        console.log('Статус подключения:', connected);
    }
    catch (e) {
        console.log('Ошибка установления соединения', e);
    }

    console.log('Выключаю ngrok...');
    await ngrok.kill();
})();