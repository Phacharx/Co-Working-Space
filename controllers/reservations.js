const Reservation = require('../models/Reservation');
const Space = require('../models/Space');

exports.getReservations = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'space',
            select: 'name address telephone'
        });
    } else {
        if(req.params.spaceId){
            console.log(req.params.spaceId);
            query = Reservation.find({ space: req.params.spaceId }).populate({
                path: 'space',
                select: 'name address telephone'
            });
        } else {
            query = Reservation.find().populate({
            path: 'space',
            select: 'name address telephone'
        });
        }
    }
    try {
        const reservations = await query;
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Reservation"});
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'space',
            select: 'name address telephone'
        });
        if(!reservation) {
            return res.status(404).json({success:false, message: `No reservation with the id of ${req.params.id}`});
        }
        res.status(200).json({success:true, data: reservation});
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find reservation"});
    }
};

exports.createReservation = async (req, res, next) => {
    try {
        if (!req.body.space) {
            return res.status(400).json({ success: false, message: "Space ID is required" });
        }

        const space = await Space.findById(req.body.space);
        if (!space) {
            return res.status(404).json({ success: false, message: `No space with the id of ${req.body.space}` });
        }

        req.body.user = req.user.id;
        
        const reservation = await Reservation.create(req.body);
        res.status(201).json({ success: true, data: reservation });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot add reservation" });
    }
};


exports.updateReservation = async(req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            res.status(404).json({success:false, message: `No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to update this reservation`});
        }
        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success:true, data: reservation});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success:false, message:"Cannot update reservation"});
    }
}

exports.deleteReservation = async(req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            res.status(404).json({success:false, message: `No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this reservation`});
        }
        await reservation.deleteOne();
        res.status(200).json({success:true, data: {}});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success:false, message:"Cannot delete reservation"});
    }
}
