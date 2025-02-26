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
    },
    openTime: { 
        type: String, 
        required: [true, 'Please add an opening time'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'] 
    },
    closeTime: { 
        type: String, 
        required: [true, 'Please add a closing time'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'] 
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
