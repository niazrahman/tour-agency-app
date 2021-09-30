const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true, 'Please provide your Name']
    },
    email : {
        type : String,
        required : [true, 'Please provide your Email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid Email']
    },
    photo : String,
    password : {
        type : String,
        required : [true,'Please provide a Password'],
        minLength : 6
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm Password']
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User