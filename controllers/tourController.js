const Tour = require('../models/tourModel')


  // route handlers - tours
 exports.getAllTours = async (req, res) => {
    try{
      const tours = await Tour.find()
      res.status(200).json({
        status : 'Success',
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
  exports.deleteTour = (req, res) => {
    
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  };