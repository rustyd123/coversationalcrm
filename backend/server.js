const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = [
  {
    email: 'test@example.com',
    password: bcrypt.hashSync('password', 10) // Ensure this is 'password' in plain text
  }
];

app.post('/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user) {
    return res.status(401).send({ message: 'Invalid email' });
  }
  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ message: 'Invalid password' });
  }
  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  res.status(200).send({ token });
});

app.post('/register', (req, res) => {
  const existingUser = users.find(u => u.email === req.body.email);
  if (existingUser) {
    return res.status(400).send({ message: 'User already exists' });
  }
  const newUser = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  users.push(newUser);
  res.status(200).send({ message: 'Registration successful' });
});

app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' });
    }
    res.status(200).send({ message: 'Welcome to the Dashboard!' });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' });
    }
    const user = users.find(u => u.email === decoded.email);
    res.status(200).send(user);
  });
});

app.put('/profile', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' });
    }
    const user = users.find(u => u.email === decoded.email);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.email = req.body.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }
    res.status(200).send({ message: 'Profile updated successfully' });
  });
});

app.listen(3001, () => {
  console.log('Backend server is running on port 3001');
});


