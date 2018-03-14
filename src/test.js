const models = require('./models')

models.sequelize.sync()
    .then(() => {
      models.User.create(userData)
          .then(user => {
              let userJson = user.get({
                  plain: true
              })
              res.json(userJson)
          })
          .catch(error => {
              res.json({error})
          })
        console.log(models.RentItems)
    })


// let deferred = {};
//
// function connectToServer() {
//   let hostUrl = location.hostname.indexOf('localhost') === -1 ? 'rype-api.herokuapp.com' : 'localhost:9000'
//   let ws = new WebSocket(`${location.protocol === 'https:' ? 'wss://' : 'ws://'}${hostUrl}`, 'echo-protocol');
//
//   ws.onclose = () => {
//     console.log('close')
//     deferred.rej(new Error('socket closed!'))
//   }
//
//   ws.onopen = () => {
//     console.log('open')
//   }
//
//   ws.onmessage = (msg) => {
//     console.log('message:', msg)
//     deferred.res(msg.data)
//   }
//
//   ws.json = (data) => {
//     let str = JSON.stringify(data)
//
//     let p = new Promise((res, rej) => {
//       deferred.res = res
//       deferred.rej = rej
//     })
//     ws.send(str)
//     return p
//   }
//
//   return ws;
// }
//
// function test() {
//   window.server.json({topic: "/test?foo=bar"})
//     .then((res) => {
//       console.log("test (response):", res)
//       alert('websocket see console for response!')
//     })
// }
//
// window.server = connectToServer()

