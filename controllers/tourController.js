const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
);
exports.checkId = (req, res, next, val) => {
    console.log(`The tour id is ${val}`);
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'Failed',
            message: 'ID Not Found',
        });
    }
    next();
};
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};
exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1; //NOTE: converts string into number
    const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour,
        },
    });
};
exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
    const id = req.params.id * 1;

    res.status(200).json({
        status: 'Success',
        data: {
            tour: '<Updated Tour Here...>',
        },
    });
};
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'Success',
        data: null,
    });
};
