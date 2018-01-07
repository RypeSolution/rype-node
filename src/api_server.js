/**
 * Created by anthony on 02/09/2017.
 */
const http = require('http')
const WebSocketServer = require('websocket').server;
const _ = require('lodash');

// Serve up public/ftp folder
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple')

const models = require('./models')
const app = express()

app.set('view engine', 'ejs')
app.use(logger('":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE,OPTIONS");
    
    next()
})

function createUser(req, res) {
    console.log('request body:', req.body)
    let name = `${req.body.firstName} ${req.body.lastName}`
    
    let userData = {
        name: name,
        password: req.body.password,
        email: req.body.email
    }
    
    console.log('creating user:', userData)
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
}

function authenticate(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log('authenticating: email=%s', email);
    if (email && password) {
        return models.User.findOne({where: {email: email}}).then(function (user) {
            let ret = null;
            if (user) {
                let authenticated = user.authenticate(password);
                ret = authenticated && user || null;
                console.log('authenticated %j: %s', user.toJSON(), authenticated);
            }
            return ret;
        })
            .then(function (user) {
                return _.isObject(user) ? res.json(user) : res.send(401);
            })
    } else {
        return res.send(401);
    }
}

app.post('/api/sessions', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    
    if (email && password) {
        return models.User.findOne({where: {email: email}})
            .then(function (user) {
                if (user && user.authenticate(password)) {
                    console.log('authenticated %s: %j', email, user.toJSON());
                    let token = jwt.encode({email: email}, 'SECRET');
                    return res.send(token)
                } else {
                    return res.sendStatus(401)
                }
            }).catch((err) => {
                return next(err)
            })
    } else {
        return res.sendStatus(401);
    }
})

app.post('/authenticate', authenticate)
app.post('/api/users', createUser)
app.post('/signup', createUser)

app.options('/signup', function (req, res) {
    res.json({hello: 'world'})
})

app.options('/authenticate', function (req, res) {
    res.json({hello: 'world'})
})

app.use(express.static(path.join(__dirname, '../')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    console.error(err)
});

module.exports = app;

const server = http.createServer(app)
// Listen

models.sequelize.sync()
    .then(() => {
        let port = 8081;
        console.log(`db synced, starting API server on ${port}...`)
        server.listen(port)
    })

class WebSocketHandler {
    
    constructor(connection) {
        this.conn = connection
        this.conn.on('message', this.onMessage.bind(this))
        this.conn.on('close', this.onClose.bind(this))
        
        this.constructor.HANDLERS[Math.random()] = this
    }
    
    onMessage(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            this.send({test: 'yes'});
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            this.conn.sendBytes(message.binaryData);
        }
    }
    
    send(data) {
        this.conn.sendUTF(data, (error) => {
            if (error) {
                console.error(error)
            } else {
                console.log('message sent:', data)
            }
        })
    }
    
    onClose(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    }
    
    static handlers() {
        return this.HANDLERS
    }
}

WebSocketHandler.HANDLERS = {}

wsServer = new WebSocketServer({httpServer: server, autoAcceptConnections: false});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    console.dir(request.resourceURL)
    
    const connection = request.accept('echo-protocol', request.origin);
    
    connection._resourceURL = request.resourceURL
    console.log((new Date()) + ' Connection accepted.');
    new WebSocketHandler(connection)
});