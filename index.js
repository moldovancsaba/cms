require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Message = require('./models/Message');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Render Admin Panel with messages
app.get('/', async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Dashboard', messages });
});

// API Route for messages
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
