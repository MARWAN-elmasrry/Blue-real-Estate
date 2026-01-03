import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';
import { startRentUpdateScheduler } from './jobs/rentUpdateJob.js';  

dotenv.config(); 

const app = express();

// Connect to database and start scheduler
connectDB().then(() => {
  
  // Start the automatic rent update scheduler
  startRentUpdateScheduler();
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json()); 

app.use('/api', postRoutes );
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`; 

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${BASE_URL}`);
});