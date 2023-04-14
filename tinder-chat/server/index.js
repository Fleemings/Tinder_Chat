const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { endpoint } = require('./routes/routes');

app.get('/', (req, res) => {
  res.send('Hello to my app');
});

app.use('/api/signup', endpoint);

app.use('/api/login', endpoint);

app.use('/api/gendered-users', endpoint);

app.use('/api/user', endpoint);

app.use('/api/user', endpoint);

app.use('/api/addmatch', endpoint);

app.use('/api/users', endpoint);

app.use('/api/messages', endpoint);

app.use('/api/message', endpoint);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.join(__dirname, '../client/build', 'index.html')
    );
  });
}

app.listen(port, () =>
  console.log('server is running on PORT', +port)
);
