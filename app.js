const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello from the server');
});

app.post('/', (req, res) => {
    res.status(200).json({
        message: 'You can post at the endPoint...',
        app: 'Node Project',
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
