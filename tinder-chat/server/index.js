const express = require('express');
const cors = require('cors');
require('dotenv').config();
const config = require('./config/index');
const path = require('path');

const { port } = config;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello to my app');
});

app.use('/api/signup', require('./routes/routes'));

app.use('/api/login', require('./routes/routes'));

app.use('/api/gendered-users', require('./routes/routes'));

app.use('/api/user', require('./routes/routes'));

app.use('/api/user', require('./routes/routes'));

app.use('/api/addmatch', require('./routes/routes'));

app.use('/api/users', require('./routes/routes'));

app.use('/api/messages', require('./routes/routes'));

app.use('/api/message', require('./routes/routes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client', 'build', 'index.html')
    );
  });
}

app.listen(port, () =>
  console.log('server is running on PORT', +port)
);
