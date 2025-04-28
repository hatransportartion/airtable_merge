
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const env = require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

const mergeRoute = require('./airtable/router');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the new World');
})

//LOg middleware
app.use((req, res, next) => {
  console.log(`${new Date().toString()} ${req.method} ${req.url}`);
  next();
});

app.use('/api', mergeRoute );

//Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})