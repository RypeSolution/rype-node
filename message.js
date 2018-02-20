/**
 * Created by anthony on 01/09/2017.
 */

class MessageHandler {
    
    constructor(){
        this.handers = {}
    }
    
    topic(topicName, fn){
        this.handers[topicName] = fn
    }
    
    handle(message){
    
    }
}

const handler = new MessageHandler()

handler.topic('/hello', (message) => {
    
    return {hello: 'world'}
})

module.exports = {handler}