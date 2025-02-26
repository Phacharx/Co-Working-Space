const mongoose = require('mongoose');
const SpaceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'], 
        unique: true 
    },
    address: { 
        type: String, 
        required: [true, 'Please add an address'] 

    },
    telephone: { 
        type: String, 
        required: [true, 'Please add a telephone number'] 

    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
SpaceSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'space',
    justOne: false
});
module.exports = mongoose.model('Space', SpaceSchema);