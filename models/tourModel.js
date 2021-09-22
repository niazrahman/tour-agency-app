const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'A tour must need a name'],
      unique : true,
      trim : true
    },
    duration : {
      type : Number,
      required : [true, 'A tour must need a duration']
    },
    maxGroupSize : {
      type : Number,
      required : [true, 'A tour must have a group size']
    },
    difficulty : {
      type : String,
      required : [true, 'A tour must have a difficulty']
    },
    ratingsAverage : {
      type : Number,
      default : 4.5
    },
    ratingsQuantity : {
      type : Number,
      dafault : 0
    },
    price : {
      type : Number,
      required : [true, 'A tour must have a price'],
      
    },
    summary : {
      type : String,
      trim : true,
      required : [true,'A tour must have a summary']
    },
    description : {
      type : String,
      trim : true
    },
    imageCover : {
      type : String,
      required : [true, 'A tour must have a cover image']
    },
    images : [String],
    createdAt : {
      type : Date,
      default : Date.now(),
      select : false
    },
    startsDate : [Date]
  })
  const Tour = mongoose.model('Tour',tourSchema)

  module.exports = Tour