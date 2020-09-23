const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

app.use('/', express.static(path.join(__dirname, 'build')));

app.listen(PORT, function () {
    console.log('Serving frontend on port: ' + PORT);
});