const express = require('express');
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

const globarErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');


const app = express();
// Global  Middlewares
app.use(morgan('dev'))
app.use(express.json());

const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many request from this Ip, Please try again after 1 hour'
})
app.use('/api',limiter)

app.use((req,res,next) => {
     req.requestTime = new Date().toISOString()
    next()
})
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

app.all('*',(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globarErrorHandler)
module.exports = app
