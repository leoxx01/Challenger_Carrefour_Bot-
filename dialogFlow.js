const dialog = require('dialogflow')

const config = require('./desafiocarrefour-pclp-b523a332bd25.json')
const { SessionsClient } = require('dialogflow')

const sessionClient = new dialog.SessionsClient({
    projectId: config.project_id,
    credentials:{
        private_key:  config.private_key,
        client_email: config.client_email
    }
})

const sendMsg = async (chatId,msg) =>{
    const sessionPath = sessionClient.sessionPath(config.project_id,chatId)
    const request = {
        session: sessionPath,
        queryInput:{
            text:{
                text:msg,
                languageCode: 'pt-BR'
            }
        }
    }
    const response =  await sessionClient.detectIntent(request)
    const result = response[0].queryResult
    return{
        text: result.fulfillmentText,
        intent: result.intent.displayName,
        fields: result.parameters.fields,
    }
}

module.exports.sendMsg = sendMsg