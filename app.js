const express = require('express');

const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();
// Middlewares
app.use(morgan('dev'))
app.use(express.json());

app.use((req,res,next) => {
     req.requestTime = new Date().toISOString()
    next()
})
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

app.all('*',(req,res,next) => {
    res.status(404).json({
        status: 'Failed',
        message : `Can't find ${req.originalUrl} on this server`
    })
})
module.exports = app
