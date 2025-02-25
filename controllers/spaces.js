const Space = require('../models/Space');
exports.getSpaces = async (req, res) => {
    const spaces = await Space.find();
    res.status(200).json({ success: true, data: spaces });
};
exports.getSpace = async (req, res) => {
    const space = await Space.findById(req.params.id);
    if (!space) {
        return res.status(404).json({ success: false, message: 'Space not found' });
    }
    res.status(200).json({ success: true, data: space });
};
exports.createSpace = async (req, res) => {
    const space = await Space.create(req.body);
    res.status(201).json({ success: true, data: space });
};
exports.updateSpace = async (req, res) => {
    const space = await Space.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!space) {
        return res.status(404).json({ success: false, message: 'Space not found' });
    }
    res.status(200).json({ success: true, data: space });
};
exports.deleteSpace = async (req, res) => {
    const space = await Space.findById(req.params.id);
    if (!space) {
        return res.status(404).json({ success: false, message: 'Space not found' });
    }
    await space.deleteOne();
    res.status(200).json({ success: true, data: {} });
};