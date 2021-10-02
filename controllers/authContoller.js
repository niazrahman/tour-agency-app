const {promisify} = require('util')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const signToken = id => jwt.sign({ id },process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })

exports.signUp = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    })

    const token = signToken(newUser._id)
    
    res.status(201).json({
        status : 'Success',
        token,
        data : {
            user : newUser
        }
    })
})

exports.login = catchAsync(async(req,res,next) => {
    const {email, password} = req.body

    // 1) check if the email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password',400))
    }

    // 2) check if user exists and password is correct
    const user = await User.findOne({email}).select('+password') 
    if(!user || !(await user.correctPassword(password, user.password) )){
        return next(new AppError('Invalid Credentials',401))
    }

    //  3) if everything okay send token to the client
    const token = signToken(user._id)
    res.status(200).json({
        status : 'Success',
        token
    })
})


exports.protect = catchAsync( async (req,res,next) => {
    // 1) getting token and check if its there
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('You are not logged In',401))
    }

    //  2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

    // check if user still exists
    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exists!', 401))
    }

    next()
})