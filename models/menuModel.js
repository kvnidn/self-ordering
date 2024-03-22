const {Schema, model} = require('mongoose')

const menuSchema = new Schema(
    {
        name: {
            type: String
        },
        image: {
            type: String
        },
        price: {
            type: Number
        },
        type: {
            type: String
        }

    },
    {
        Collection: 'menus',
    }
)


module.exports = model('menus', menuSchema)
