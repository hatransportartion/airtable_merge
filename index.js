
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const env = require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/merge', (req, res) => {

    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})