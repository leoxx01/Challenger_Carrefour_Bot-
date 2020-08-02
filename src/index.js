const TelegramBot = require('node-telegram-bot-api')
const dialog = require('./dialogFlow')
const dotenv = require('dotenv').config()
const jsonPesquisa = require('./links.json')//Arquivos json que simula um banco de dados
const accounts = require('./accounts.json')//Arquivos json que simula um banco de dados


const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})

/*Função de validação no json que faz a simulação de uma base de dados que confirma que o cpf passado realmente 
é valido para passar o objeto do úsuario e fazer uma apresentação adequada 
*/
const validarCpf = (cpf) =>{
    let account = accounts.accounts.filter(account =>{
        return account.cpf === cpf[1]
    })
    return account
}

bot.on('message', async (msg)=>{
    const chatId = msg.chat.id
    //Mandando dados para o DialogFlow dar uma resposta pré configurada
    const dfResponse = await dialog.sendMsg(chatId.toString(), msg.text)

    let responseText = dfResponse.text
    let intent = dfResponse.intent
    //Checando se existe alguma url com o assunto pesquisado para ser passado para o usuario
    let link = jsonPesquisa.links[intent]

    if(intent === '/consultar'){
        let cpf = msg.text.split(" ")
        const data = validarCpf(cpf)
        
        if(data.length>0){
            const value = data[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            bot.sendMessage(chatId,`\n\n Sua fatura é do valor de ${value}`)
        }else{
            bot.sendMessage(chatId,`\n\n CPF Invalido`)
        }
    
    }
    //Caso tenha um link este link é passado junto com a frase do DialogFlow
    if(link){
            bot.sendMessage(chatId,`${responseText} ${link}`)
    }else{
        /* Está parte do código faz a mesma coisa do link só que com algumas outras informações que não tem 
         haver com produtos
        */
        let intentTwo = dfResponse.intent
        let linkTwo = jsonPesquisa[intent]
        if(linkTwo){
            bot.sendMessage(chatId,`${responseText} \n\n  ${linkTwo}`)
        }
        else if(intentTwo === "Boas-Vindas" || intentTwo === "/info"  ){
            bot.sendMessage(chatId,responseText)
        }
    }
})


