
const express = require('express')

let app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;
