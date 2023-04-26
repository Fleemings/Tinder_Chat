const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
// const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const URI = process.env.MONGODB_URI;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello to my app');
// });

app.post('/signup', async (req, res) => {
  const client = new MongoClient(URI);
  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send('User already exists. Please login');
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

app.post('/login', async (req, res, next) => {
  const client = new MongoClient(URI);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const user = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id });
    } else if (!correctPassword)
      res.status(400).send('Invalid Credentials');
    next();
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.get('/gendered-users', async (req, res, next) => {
  const client = new MongoClient(URI);
  const gender = req.query.gender;
  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { gender_identity: { $eq: gender } };
    const foundUsers = await users.find(query).toArray();

    res.send(foundUsers);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.put('/user', async (req, res, next) => {
  const client = new MongoClient(URI);
  const formData = req.body.formData;
  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/user', async (req, res, next) => {
  const client = new MongoClient(URI);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.put('/addmatch', async (req, res, next) => {
  const client = new MongoClient(URI);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { user_id: userId };

    const updatedDocument = {
      $push: {
        matches: {
          user_id: matchedUserId,
        },
      },
    };
    const user = await users.updateOne(query, updatedDocument);

    res.send(user);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/users', async (req, res, next) => {
  const client = new MongoClient(URI);
  const userIds = JSON.parse(req.query.userIds);

  console.log(userIds);

  try {
    await client.connect();

    const database = client.db('app-data');
    const users = database.collection('users');

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundedUsers = await users.aggregate(pipeline).toArray();
    console.log(foundedUsers);

    res.send(foundedUsers);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/messages', async (req, res, next) => {
  const client = new MongoClient(URI);

  const userId = req.query.userId;
  const correspondingUserId = req.query.correspondingUserId;
  console.log(userId, correspondingUserId);

  try {
    await client.connect();
    const database = client.db('app-data');
    const messages = database.collection('messages');

    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post('/message', async (req, res, next) => {
  const client = new MongoClient(URI);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db('app-data');
    const messages = database.collection('messages');

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
    next();
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(
//       path.join(__dirname, '../client/build', 'index.html')
//     );
//   });
// }

app.listen(port, () =>
  console.log('server is running on PORT', +port)
);
