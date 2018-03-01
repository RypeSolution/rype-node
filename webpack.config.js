var path = require('path');

var DIST_PATH = path.resolve( __dirname, 'dist' );
var SOURCE_PATH = path.resolve( __dirname, 'src' );

module.exports = {
   entry: SOURCE_PATH + '/app/app.js',
   devtool: 'eval',
   output: {
       path: DIST_PATH,   
       filename: 'app.dist.js',
       publicPath: '/app/'
   },
    devServer: {
        host: process.env.PORT ? 'rype16.herokuapp.com' : '0.0.0.0',
        disableHostCheck: true,
        port: process.env.PORT || 8080,
    },
   module: {
       loaders: [
           {
               test: /.jsx?$/,  
               loader: 'babel-loader',
               exclude: /node_modules/,
               query: {
                   presets: [
                       'es2016',
                       'react',
                       'stage-2'
                   ]
               }
           },
           {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
           }
       ]
   }
};