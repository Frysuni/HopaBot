require('dotenv').config();
const { Info } = require('../utilities/logger.js');
const { start } = require('../suggestions/firstmessage.js');

module.exports = async (client, message) => {
    if (message.content === process.env.SUGGESTIONS_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        Info('SUGGESTIONS_TRIGGER');
        start(client, message);
    }
    if (message.content == process.env.AD_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        Info('AD_TRIGGER');
        client.channels.cache.get(process.env.AD_CHANNEL_ID).send(process.env.AD_TEXT);
    }
};