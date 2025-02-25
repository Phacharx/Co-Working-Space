const mongoose = require('mongoose');
const ReservationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    space: { type: mongoose.Schema.ObjectId, ref: 'Space', required: true }
});
module.exports = mongoose.model('Reservation', ReservationSchema);