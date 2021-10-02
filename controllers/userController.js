const User = require('../models/userModel')
const CatchAsync = require('../utils/catchAsync')

exports.getAllUsers = CatchAsync( async (req,res,next) =>{
    const users = await User.find()

    res.status(200).json({
        status : 'Success',
        data : {
            users
        }
    })
})

exports.getUser = (req,res) =>{
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not handled yet...'
    })
}

exports.createUser = (req,res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not handled yet...'
    })
}

exports.updateUser = (req,res) =>{
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not handled yet...'
    })
}

exports.deleteUser = (req,res) => {
    res.status(500).json({
        status : 'Failed',
        message : 'This route is not handled yet...'
    })
}