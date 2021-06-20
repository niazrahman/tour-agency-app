const fs = require('fs');
const express = require('express');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
);
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};
const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1; //NOTE: converts string into number
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'Failed',
            message: 'ID not found!',
        });
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour,
        },
    });
};
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/starter/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'Success',
                tour: newTour,
            });
        }
    );
};
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'Failed',
            message: 'ID Not Found',
        });
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour: '<Updated Tour Here...>',
        },
    });
};
const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'Failed',
            message: 'ID Not Found',
        });
    }
    res.status(204).json({
        status: 'Success',
        data: null,
    });
};
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
