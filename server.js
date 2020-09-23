const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/', express.static(path.join(__dirname, 'build')));
// app.get('/', (request, response) => response.render('pages/index'));

app.listen(PORT, function () {
    console.log('Serving frontend on port: ' + PORT);
});
