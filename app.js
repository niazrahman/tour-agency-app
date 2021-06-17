const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());
// app.get('/', (req, res) => {
//     res.status(200).send('Hello from the server');
// });

// app.post('/', (req, res) => {
//     res.status(200).json({
//         message: 'You can post at the endPoint...',
//         app: 'Node Project',
//     });
// });
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});
app.get('/api/v1/tours/:id', (req, res) => {
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
        data: {
            tour,
        },
    });
});

app.post('/api/v1/tours', (req, res) => {
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
});
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
