/*
    Menu Schema untuk informasi menu
    Nama item, image path, harga, dan tipenya
*/
const {Schema, model} = require('mongoose')

const menuSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the foods name !"]
        },
        image: {
            type: String,
            required: [true, "Please enter a link"]
        },
        price: {
            type: Number,            
            required: [true, "Please enter the price"]
        },
        type: {
            type: String,
            required: [true, "Please choose the type"]
        }

    },
    {
        Collection: 'menus',
    }
)

module.exports = model('menus', menuSchema)
