/**
 * Created by anthony on 07/04/2017.
 */
"use strict";

const exec = require('child_process').execSync
const Promise = require('bluebird')
const util = require('util')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')
const moment = require('moment')

function init(seed = false) {
    let sequelizeCmd = '../node_modules/.bin/sequelize';
    let args = '--config=db.js --migrations-path=db/migrations --seeders-path=db/seeders';
    console.log(exec(util.format('%s db:migrate %s', sequelizeCmd, args)).toString());
    
    if (seed) console.log(exec(util.format('%s db:seed:all %s', sequelizeCmd, args)).toString());
    return Promise.resolve(true)
}

class DbObject extends Sequelize.Instance {
    
    toJson(compact = true) {
        let res = this.toJSON()
        if (compact) {
            res = _.transform(res, (result, value, key) => {
                if (_.isUndefined(value) || _.isNull(value)) return
                result[key] = value
            }, {})
        }
        return res
    }
    
    static scopeDefs(){
        return {}
    }
    
    static columnDefs(DataTypes) {
        return {}
    }
    
    static getModel(sequelize, DataTypes) {
        if (this.prototype.Model) return this.prototype.Model
        //console.log('this=%s, sequelize=%s, DataTypes=%s', this, sequelize, DataTypes)
        let attrs = this.columnDefs(DataTypes)
        
        if(_.isEmpty(attrs)) return null
        
        let methods = {
            instanceMethods: {},
            getterMethods: {},
            setterMethods: {},
            classMethods: {},
            scopes: this.scopeDefs()
        }
        
        let meths = Object.getOwnPropertyNames(this.prototype).filter((m) => !['constructor', 'test'].includes(m))
        let clsMeths = Object.getOwnPropertyNames(this).filter((m) => _.isFunction(this[m]))
        
        // Hack: update instance and class methods to include super class
        for(let cls of [DbObject]) {
            if (this.prototype instanceof cls) {
                for (let attr of Object.getOwnPropertyNames(cls.prototype)) {
                    if (attr !== 'constructor' && !meths.includes(attr)) meths.push(attr)
                }
        
                for (let attr of Object.getOwnPropertyNames(cls)) {
                    if (_.isFunction(cls[attr]) && !clsMeths.includes(attr)) clsMeths.push(attr)
                }
            }
        }
        
        //console.log('DbObject(%s): instanceMethods=%s | classMethods=%s', this.name, meths, clsMeths)
        
        methods.instanceMethods = _.fromPairs(meths.map((m) => [m, this.prototype[m]]))
        methods.classMethods = _.fromPairs(clsMeths.map((m) => [m, this[m]]))
        
        Object.getOwnPropertyNames(this.prototype).forEach((v) => {
            let desc = Object.getOwnPropertyDescriptor(this.prototype, v)
            
            if(_.isFunction(desc['get'])){
                console.log('adding getter %s', v)
                methods.getterMethods[v] = desc.get
            }
            
            if(_.isFunction(desc['set'])){
                console.log('adding setter %s', v)
                methods.setterMethods[v] = desc.set
            }
        })
        
        let Model = this.prototype.$Model = this.prototype.Model = sequelize.define(this.name, attrs, methods)
        
        
        Model.Instance = this
        Model.refreshAttributes()
        
        if (Model.options.instanceMethods) {
            _.each(Model.options.instanceMethods, function(fct, name) {
                Model.Instance.prototype[name] = fct;
            });
        }
        
        return Model
    }
}


module.exports = {DbObject, init}