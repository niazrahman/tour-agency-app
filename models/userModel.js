const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
        required : [true, 'Please confirm Password'],
        validate : {
            // this only work on CREATE and SAVE
            validator : function (el){
                return el === this.password 
            },
            message : 'Password does not match'
        }
    }
})

userSchema.pre('save', async function(next){
    // only run this function if the password is modified
    if(!this.isModified('password')) return next()

    // hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12)

    // delete the passwordConfirm field
    this.passwordConfirm  = undefined
    next()

})

const User = mongoose.model('User',userSchema)

module.exports = User