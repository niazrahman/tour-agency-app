const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'A tour must need a name'],
      unique : true,
      trim : true
    },
    slug : String,
    secretTour : {
      type : Boolean,
      default : false
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
    startDates : [Date]
  },{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
  })

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7
  })

  // document middleware
  tourSchema.pre('save',function(next){
    this.slug = slugify(this.name , { lower:true })
    next()
  })

  // Query Middleware
  // eslint-disable-next-line prefer-arrow-callback
  tourSchema.pre(/^find/,function(next){
    this.find({secretTour : { $ne : true}})
    this.start =  Date.now()
    next()
  })
 // eslint-disable-next-line prefer-arrow-callback
  tourSchema.post(/^find/, function(docs,next){
    console.log(`Query took ${Date.now() - this.start} milisecond`)
    // console.log(docs)
    next()
  })

  // Aggregate middleware
  tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({ $match : { secretTour : {$ne : true} }})
    next()
  })
  const Tour = mongoose.model('Tour',tourSchema)

  module.exports = Tour