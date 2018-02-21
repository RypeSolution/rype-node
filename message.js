/**
 * Created by anthony on 01/09/2017.
 */
const _ = require('lodash')
const url = require('url')
const EventEmitter = require('events').EventEmitter

class WebSocketHandler extends EventEmitter {
    
    constructor() {
        super()
        this.subscribers = {}
    }
    
    onMessage(connection, message) {
        let msg = message.msg
    
        console.log('Received Message: ', msg)
        
        let parsed = url.parse(msg.topic, true)
        let handler = this.handlers[parsed.pathname]
        
        if(!handler) return {data: 404, type: 'utf8'}
    
        let resp = handler(connection, _.extend({$msg: msg}, parsed.query))
        
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
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
        for(let [sub, conns] of _.toPairs(this.subscribers)){
            console.log('[onClose]', sub, ':', _.includes(conns, connection))
            _.remove(conns, connection)
        }
    }
    
    addSubscription(subject, conn){
        let subs = this.subscribers[subject] = this.subscribers[subject] || []
        subs.push(conn)
        console.log('[addSubscription] ', subject)
    }
    
    get handlers() {
        return this.constructor.HANDLERS
    }
}

WebSocketHandler.HANDLERS = {}

const wsHandler = new WebSocketHandler()

wsHandler.on('db_update', (changeType, model) => {
    for(let subscriberConn of wsHandler.subscribers['db_update'] || []){
        subscriberConn.send('/subscribe?subject=db_update', {type: 'utf8', data:{updates:[{changeType, value:model}]}})
    }
})

wsHandler.topic('/status', (conn, msg) => {
    return {data: 'hello world'}
})

wsHandler.topic('/subscribe', (conn, msg) => {
    console.log('MSG', msg)
    wsHandler.addSubscription(msg.subject, conn)
    
    return {data: {subscribed: msg.subject || null}}
})

module.exports = {wsHandler}