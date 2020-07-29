const TelegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv').config()

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})

bot.on('message', async (msg)=>{
    const chatId = msg.chat.id
    bot.sendMessage(chatId, "Ola")
})