const TelegramBot = require('node-telegram-bot-api')
const dialog = require('./dialogFlow')
const dotenv = require('dotenv').config()
const jsonPesquisa = require('./links.json')

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})

bot.on('message', async (msg)=>{
    const chatId = msg.chat.id
    const dfResponse = await dialog.sendMsg(chatId.toString(), msg.text)

    let responseText = dfResponse.text
    let intent = dfResponse.intent
    let link = jsonPesquisa.links[intent]

    if(link){
        bot.sendMessage(chatId,`${responseText} ${link}`)
    }else{
        let intentTwo = dfResponse.intent
        let linkTwo = jsonPesquisa[intent]
        
        if(linkTwo){
            bot.sendMessage(chatId,`${responseText} \n\n  ${linkTwo}`)
        }else{
            bot.sendMessage(chatId,responseText)
        }
    }
})


