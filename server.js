/**
 * Created by anthony on 01/03/2018.
 */
// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
//const webpack = require('webpack');
//const WebpackDevServer = require('webpack-dev-server');
//const config = require('./webpack.config');
console.log('Starting the dev web server...');
//const port = process.env.PORT || 8080
//const path = require('path');

// const options = {
//     publicPath: config.output.publicPath,
//     hot: true,
//     inline: true,
//     contentBase: './src',
//     stats: { colors: true }
// };

//const server = new WebpackDevServer(webpack(config), options);

//require('./api_server') // start api server

const path = require('path');
const express = require('express');

let app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);

let server = app.listen(app.get('port'), function() {
    console.log('listening on port ', server.address().port);
});