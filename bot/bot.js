const TelegramBot = require('node-telegram-bot-api');
const { handleCommand } = require('./src/commands');
const { handleCallback } = require('./src/callbacks');
const { handleMessage } = require('./src/messages');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let userStates = {};

bot.onText(/\/(.+)/, (msg) => handleCommand(msg, bot, userStates));
bot.on('callback_query', (callbackQuery) => handleCallback(callbackQuery, bot, userStates));
bot.on('message', (msg) => {
    if (!msg.text.startsWith('/')) {
        handleMessage(msg, bot, userStates);
    }
});

module.exports = bot;