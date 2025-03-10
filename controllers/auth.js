const { send } = require('process');
const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true, 
        token
    });
};

exports.register = async (req, res) => {
    try {
        const { name, telephone, email, password, role } = req.body;
        const user = await User.create({ 
            name, 
            telephone, 
            email, 
            password, 
            role 
        });
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err);
    }
};

exports.login = async (req, res, next) => {
    try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({success: false, msg: 'Please provide email and password'});
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return res.status(400).json({success: false, msg: 'Invalid credentials'});
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({success: false, msg: 'Invalid credentials'});
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);

    } catch {
        return res.status(401).json({success: false, msg: 'Cannot convert email or password to string'});
    }
}

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({success: true, data: user});
}

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true, 
        data: {}
    });
};