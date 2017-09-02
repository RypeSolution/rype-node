const DbObject = require('../lib/db').DbObject

class User extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    authenticate(password) {
        //TODO {anthony}: make async
        return require('bcrypt').compareSync(password, this.password_hash)
    }
    
    static columnDefs(DataTypes) {
        return {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            password_hash: DataTypes.STRING,
            birthDate: DataTypes.DATE,
            password: {
                type: DataTypes.VIRTUAL,
                set: function (val) {
                    const bcrypt = require('bcrypt')
                    const salt = bcrypt.genSaltSync()
                    
                    this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
                    this.setDataValue('password_hash', bcrypt.hashSync(val, salt));
                }
            }
        }
    }
    
    static associate(models) {
    
    }
}

module.exports = User