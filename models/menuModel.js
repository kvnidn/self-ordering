const {Schema, model} = require('mongoose')

const menuSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,            
            required: true
        },
        type: {
            type: String,
            required: true
        }

    },
    {
        Collection: 'menus',
    }
)


module.exports = model('menus', menuSchema)
