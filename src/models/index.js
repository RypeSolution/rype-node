
'use strict';
const Sequelize = require('sequelize')
const env       = process.env.NODE_ENV || 'development'
const config    = require(__dirname + '/../db.js')[env]
const path = require('path')
const fs = require('fs')
const DbObject = require('../lib/db').DbObject

let db = {}
let sequelize
if (config.dialect === 'sqlite') {
    config.storage = path.join(__dirname, '../', config.storage)
}

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config)
}

function importer(filePath){
    let defineCall = require(filePath)
    
    if(defineCall.prototype instanceof DbObject){
        const DbObjCls = defineCall
        
        defineCall = function() {
             return DbObjCls.getModel.apply(DbObjCls, [...arguments])
        }
    }

    return sequelize.import(filePath, defineCall)
}

let modelFiles = fs.readdirSync(__dirname).map((fName) => __dirname + '/'+ fName)
let modelFilePath

modelFilePath = path.join(__dirname, 'user.js')
if(modelFiles.includes(modelFilePath)) db['User'] = importer(modelFilePath)


Object.keys(db).forEach((modelName) => { if (db[modelName].associate) db[modelName].associate(db) })

db.sequelize = sequelize
module.exports = db
