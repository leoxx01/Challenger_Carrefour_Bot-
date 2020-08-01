const TelegramBot = require('node-telegram-bot-api')
const dialog = require('./dialogFlow')
const dotenv = require('dotenv').config()
const jsonPesquisa = require('./links.json')
const accounts = require('./accounts.json')


const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})

const validarCpf = (cpf) =>{
    let account = accounts.accounts.filter(account =>{
        return account.cpf === cpf[1]
    })
    return account
}

bot.on('message', async (msg)=>{
    const chatId = msg.chat.id
    const dfResponse = await dialog.sendMsg(chatId.toString(), msg.text)

    let responseText = dfResponse.text
    let intent = dfResponse.intent
    let link = jsonPesquisa.links[intent]

    if(intent === '/consultar'){
        let cpf = msg.text.split(" ")
        const data = validarCpf(cpf)
        if(data){
            const value = data[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            bot.sendMessage(chatId,`\n\n Sua fatura é do valor de ${value}`)
        }
    
    }
    if(link){
            bot.sendMessage(chatId,`${responseText} ${link}`)
    }else{
        let intentTwo = dfResponse.intent
        let linkTwo = jsonPesquisa[intent]
        if(linkTwo){
            bot.sendMessage(chatId,`${responseText} \n\n  ${linkTwo}`)
        }
        else{
            bot.sendMessage(chatId,responseText)
        }
    }
})


