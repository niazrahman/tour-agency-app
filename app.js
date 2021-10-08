/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
// eslint-disable-next-line node/no-unpublished-require
const morgan = require('morgan')

const globarErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');


const app = express();
// Global  Middlewares
// Set Security http headers
app.use(helmet())

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// limit requests from api
const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many request from this Ip, Please try again after 1 hour'
})
app.use('/api',limiter)

// body parser, reading data from body into req.body
app.use(express.json({limit : '10kb'}));

// serving static file
app.use(express.static(`${__dirname}/public`))

// test middleware
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
