require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User ', userSchema);

// Middleware
app.use(express.json());

// CORS - allow frontend origin (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: false, // set true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Routes

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Invalid email or password too short' });
  }
  try {
    const existingUser  = await User.findOne({ email });
    if (existingUser ) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser  = new User({ email, passwordHash });
    await newUser .save();

    req.session.userId = newUser ._id; // login user after register
    res.status(201).json({ message: 'User  registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Get current user info
app.get('/api/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const user = await User.findById(req.session.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User  not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
