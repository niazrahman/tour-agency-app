const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.signUp = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        emali : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    })
    res.status(201).json({
        status : 'Success',
        data : {
            user : newUser
        }
    })
})