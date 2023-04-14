const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello to my app');
});

app.use('/api/signup', routes);

app.use('/api/login', routes);

app.use('/api/gendered-users', routes);

app.use('/api/user', routes);

app.use('/api/user', routes);

app.use('/api/addmatch', routes);

app.use('/api/users', routes);

app.use('/api/messages', routes);

app.use('/api/message', routes);

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
