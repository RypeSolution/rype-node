/**
 * Created by anthony on 01/09/2017.
 */
const _ = require('lodash')
const url = require('url')
const EventEmitter = require('events').EventEmitter

class WebSocketHandler extends EventEmitter {
    
    constructor() {
        super()
    }
    
    onMessage(connection, message) {
        let msg = message.msg
    
        console.log('Received Message: ', msg)
        
        let parsed = url.parse(msg.topic)
        let handler = this.handlers[parsed.pathname]
        
        if(!handler) return {data: 404, type: 'utf8'}
    
        let resp = handler(connection, msg)
        
        if(_.isString(resp)){
            resp = {type:'utf8', data:resp}
        }else if(!('type' in resp)){
            resp['type'] = 'utf8'
        }
        
        return resp
    }
    
    topic(label, callback) {
       this.handlers[label] = callback
    }
    
    onClose(connection, reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    }
    
    get handlers() {
        return this.constructor.HANDLERS
    }
}

WebSocketHandler.HANDLERS = {}

const wsHandler = new WebSocketHandler()

wsHandler.topic('/status', (conn, msg) => {
    return {data: 'hello world'}
})

module.exports = {wsHandler}