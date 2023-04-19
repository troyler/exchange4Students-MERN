const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    photos: [String],
    price: Number,
    condition: String,
    category: String,

});

const ProductModel = mongoose.model('Products', ProductSchema);


module.exports = ProductModel;

