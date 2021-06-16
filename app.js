const fs = require('fs');
const express = require('express');

const app = express();

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

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
