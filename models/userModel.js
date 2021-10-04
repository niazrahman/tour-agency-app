const crypto = require('crypto')
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
    role : {
        type : String,
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true,'Please provide a Password'],
        minLength : 6,
        select : false
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
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordTokenExpires : Date
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

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.passwordChangedAfter = function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordTokenExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User',userSchema)

module.exports = User