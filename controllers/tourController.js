const Tour = require('../models/tourModel')


 
 exports.getAllTours = async (req, res) => {

    try{
      
      // 1.filter
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const queryObj = {...req.query} 
      const excludeFields = ['page', 'sort', 'limit', 'fields']
      excludeFields.forEach(el => delete queryObj[el])
     
     let queryStr = JSON.stringify(queryObj)
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
     console.log(JSON.parse(queryStr))

      let query =  Tour.find(JSON.parse(queryStr))
      //2.Sort
      if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        console.log(sortBy)
        query = query.sort(sortBy)
      }else{
        query = query.sort('-createdAt')
      }
      //3.filter
      if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
      }else{
        query = query.select('-__v')
      }
      const tours = await query
      res.status(200).json({
        status : 'Success', 
        results : tours.length, 
        data : {
          tours
        }
      })
    }catch (err) {
      res.status(404).json({
        status : 'Failed',
        message : err
      })
    }
  };
  
  exports.getTour = async (req, res) => {
   try{
      const tour = await Tour.findById(req.params.id)
      res.status(200).json({
        status : 'Success',
        data : {
          tour
        }
      })
   }catch(err) {
     res.status(404).json({
       status : 'Failed',
       message : err
     })
   }

  };
  
  exports.createTour = async (req, res) => {
    try{
      const newTour = await Tour.create(req.body)
      res.status(200).json({
        status : 'Success',
        data : {
          tour : newTour
        }
      })
    }catch(err){
      res.status(400).json({
        status : 'Failed',
        message : err
      })
    }
  };
  exports.updateTour = async (req, res) => {
   try{
      const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
      res.status(200).json({
        status : 'Success',
        data : {
          tour
        }
      })
   }catch(err) {
     res.status(404).json({
       status : 'Failed',
       message : err
     })
   }
  };
  exports.deleteTour = async (req, res) => {
    try{
      await Tour.findByIdAndDelete(req.params.id)
      res.status(200).json({
        status : 'Success',
        data : null
      })
    }catch (err) {
      res.status(404).json({
        status : 'Failed',
        message : err
      })
    }
    
  };