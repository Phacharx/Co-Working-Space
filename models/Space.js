const mongoose = require('mongoose');
const SpaceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    telephone: { type: String, required: true }
});
module.exports = mongoose.model('Space', SpaceSchema);