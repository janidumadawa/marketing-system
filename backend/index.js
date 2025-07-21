const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Only declare ONCE:
const oldClientRoutes = require('./routes/oldClientRoutes');
app.use('/api/old-clients', oldClientRoutes);

const oldTargetsRouter = require('./routes/oldTargetRoutes');
app.use('/api/old-targets', oldTargetsRouter);

// If you have monthlyTargetRoutes:
const monthlyTargetRoutes = require('./routes/monthlyTargetRoutes');
app.use('/api/monthly-targets', monthlyTargetRoutes);

const adRoutes = require('./routes/adRoutes');
app.use('/api/ads', adRoutes);

const clientsRouter = require('./routes/clientRoutes');
app.use('/api/clients', clientsRouter);

app.get('/', (req, res) => {
  res.send('Backend is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
