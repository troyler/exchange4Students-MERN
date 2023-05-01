const mongoose = require('mongoose');
const {Schema} = mongoose;

const PurchaseOrderSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', unique: true},
    quantity: { type: Number},
    sellerEmail : {type: String}
  }],
  totalPrice: { type: Number, required: true },
  firstName: String,
  lastName: String,
  buyerEmail: String,
}, { timestamps: true });

const PurchaseModel = mongoose.model('Purchase', PurchaseOrderSchema);


module.exports = PurchaseModel;