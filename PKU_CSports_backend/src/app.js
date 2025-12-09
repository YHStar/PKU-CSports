const express = require('express');
const authRoutes = require('./api/auth');
const newsRoutes = require('./api/news');
const matchRoutes = require('./api/matches');
const standingRoutes = require('./api/standings');
const commentRoutes = require('./api/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/comments', commentRoutes);

// A simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the CSports API!');
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
