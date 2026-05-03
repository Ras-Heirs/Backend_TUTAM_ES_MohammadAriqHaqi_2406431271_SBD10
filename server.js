require('dotenv').config();
const express = require('express');
const cors = require('cors');
const noteRoutes = require('./src/routes/noteRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/notes', noteRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend berjalan di port ${PORT}`);
});