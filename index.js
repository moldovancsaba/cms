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

// Text Data (for settings page)
const texts = {
    welcome_message: "Send a Message",
    chat_title: "Chat Messages",
    settings_page_title: "Settings"
};

// Render Dashboard
app.get('/', async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Dashboard', messages });
});

// Render Settings Page
app.get('/settings', (req, res) => {
    res.render('settings', { texts });
});

// API Route for messages
app.use('/messages', messageRoutes);

// Export for Vercel
module.exports = app;
