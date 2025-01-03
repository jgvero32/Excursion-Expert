import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth/router';
import userRouter from './src/routes/users/router';
import itineraryRouter from './src/routes/itineraries/router';

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = ['http://localhost:3000', 'https://excursion-expert.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/itineraries', itineraryRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});