/*
    Order Schema untuk menampung detail pesanan yang ditambahkan ke Cart Schema
    Cart Schema menampung data user, pesanan, dan waktu pemesanan
*/
const {Schema, model} = require('mongoose')

const orderSchema = new Schema(
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
        },
        quantity: {
            type: Number,
            required: true
        }

    },
    {
        Collection: 'orders',
    }
)

const cartSchema = new Schema(
    {
        username: {
            type: String,
        },
        date: {
            type: String,
            // default: Date.now
        },
        cartOrder: [orderSchema]
    },
    {
        Collection: 'carts'
    }
)


module.exports = model('carts', cartSchema)