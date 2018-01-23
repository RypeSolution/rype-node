const DbObject = require('../lib/db').DbObject

class RentItems extends DbObject {

    static scopeDefs() {
        return {}
    }



    static columnDefs(DataTypes) {
        return {
            itemName: DataTypes.STRING,
            itemDescription: DataTypes.STRING,
            itemSpecifics: DataTypes.STRING,
            itemPhoto: DataTypes.STRING,
            itemPricing: DataTypes.STRING,
            availableDate: DataTypes.DATE,
            deliveryOption: DataTypes.STRING

                }
            }
        }
    

    static associate(models) {

    }
}

module.exports = RentItems
