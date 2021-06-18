const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
// 1.MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});

// 2. ROUTE HANDLERS
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
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

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined',
    });
};
const getUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined',
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined',
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined',
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined',
    });
};
// NOTE: old way
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//NOTE:  refactoring code
// ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);
// CREATE SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
