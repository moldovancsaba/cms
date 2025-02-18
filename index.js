require('dotenv').config({ path: './.env' });
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

// Verify if MONGO_URI is loaded
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Render Admin Panel with messages
app.get('/', async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Dashboard', messages });
});

// Render Settings Page
app.get('/settings', (req, res) => {
    res.render('settings', { texts: { welcome_message: "Send a Message", chat_title: "Chat Messages", settings_page_title: "Settings" } });
});

// API Route for messages
app.use('/messages', messageRoutes);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

