const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/softwares', require('./routes/softwares'));

// Frontend routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'frontend', 'index.html')));
app.get('/frontend/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'frontend', req.path.split('/frontend')[1])));
app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', req.path.split('/admin')[1])));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));