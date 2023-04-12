const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
require('dotenv').config();
const config = require('./config/index');

const { port, uri, allowedDomains } = config;

const app = express();
app.use(cors({ origin: allowedDomains, credentials: true }));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello to my app');
});

app.post('/api/signup', async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const generateUserId = uuidv4();

  try {
    await client.connect();

    const database = client.db('app-data');
    const users = database.collection('users');
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send('User already exists. Please log in');
    }

    const sanitizedEmail = email;
    sanitizedEmail.toLowerCase();

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error(err);
        return;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }
        const data = {
          user_id: generateUserId,
          email: sanitizedEmail,
          hashed_password: hash,
        };
        users.insertOne(data);
      });
    });

    const token = jwt.sign(sanitizedEmail, {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ token, userId: generateUserId });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.post('/api/login', async (req, res) => {
  const client = new MongoClient(uri);
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
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.get('/api/gendered-users', async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;
  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { gender_identity: { $eq: gender } };
    const foundUsers = await users.find(query).toArray();

    res.send(foundUsers);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.put('/api/user', async (req, res) => {
  const client = new MongoClient(uri);
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
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/api/user', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.put('/api/addmatch', async (req, res) => {
  const client = new MongoClient(uri);
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
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/api/users', async (req, res) => {
  const client = new MongoClient(uri);
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
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get('/api/messages', async (req, res) => {
  const client = new MongoClient(uri);

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
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post('/api/message', async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db('app-data');
    const messages = database.collection('messages');

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.listen(port, () =>
  console.log('server is running on PORT', +port)
);
