// In models/Cart.js

const mongoose = require('mongoose');
const {Schema} = mongoose;

const CartSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number},
  }],
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
