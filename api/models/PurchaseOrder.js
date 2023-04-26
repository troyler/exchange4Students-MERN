const mongoose = require('mongoose');
const {Schema} = mongoose;

const PurchaseOrderSchema = new Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String,
});

const PurchaseModel = mongoose.model('Purchase', PurchaseOrderSchema);


module.exports = PurchaseModel;

