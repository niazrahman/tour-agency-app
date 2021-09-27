const sendErrDev = ((res,err) => {
    res.status(err.statusCode).json({
        status : err.status,
        error : err,
        message : err.message,
        stack : err.stack
    })
})

const sendErrProd = ((res,err) => {
    // Operational ,Trusted error:  Send message to the client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status : err.status,
            message : err.message
        })
    // Programming or unknown error : Don't leak error details
    }else {
        // 1) log error
        console.error('Error',err)

        // 2) send a generic message to the client
        res.status(500).json({
            status : 'error',
            message : 'Something went very wrong'
        })
    }
})


module.exports = ((err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if(process.env.NODE_ENV === 'development'){
        sendErrDev(res,err)
    }else if(process.env.NODE_ENV === 'production'){
        sendErrProd(res,err)
    }
})