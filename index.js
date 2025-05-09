
const express = require('express')
const cors = require('cors');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const path = require('path');

const env = require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

const mergeRoute = require('./router');

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the new World');
})

//LOg middleware
app.use((req, res, next) => {
  //log date in PST format
  const date = new Date();
  const options = { timeZone: 'America/Los_Angeles', hour12: false };
  const dateString = date.toLocaleString('en-US', options);
  console.log(`${dateString} ${req.method} ${req.url}`);
  next();
});

app.use('/', mergeRoute );

//Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})