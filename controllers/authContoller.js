const {promisify} = require('util')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('../utils/email')

const signToken = id => jwt.sign({ id },process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })

exports.signUp = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        role : req.body.role
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

    // 4) check if user chnaged password after token was issued
    if(currentUser.passwordChangedAfter(decoded.iat)){
        return next(new AppError('User recently changed password, Please log in again!',401))
    }

    // Grant access to protecting route
    req.user = currentUser
    next()
})

exports.restrictTo = (...roles) => (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next( new AppError('Your do not have any permission to perform this action',403))
        }
        next()
    }


exports.forgotPassword = catchAsync( async(req,res,next) => {
    // 1) check if the user exist with this email
    const user = await User.findOne({email : req.body.email})
    if(!user){
        next(new AppError('User does not exist with this email',404))
    }

    // 2) generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave : false})

    // 3) send token to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`

    const message = `Forgot your Password? Submit a PATCH request with your new password and confirm password to this ${resetURL} Url. If you didn't foget your password then please ignore this email!`

    try {
        await sendEmail({
            email : user.email,
            subject : 'Your password reset token. (Valid for 10 mins)',
            message
        })
        res.status(200).json({
            status : 'success',
            message : 'Token send to email'
        })
    } catch (err){
        user.passwordResetToken = undefined
        user.passwordTokenExpires = undefined
        await user.save({validateBeforeSave : false})
        return next( new AppError('There was an error sending the mail! Try again later!',500))
    }
})

exports.resetPassword = (req,res,next) => {}