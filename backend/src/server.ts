// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import userRouter from '../routes/users/router';
import placesRouter from '../routes/places/router';
import authRouter from '../routes/auth/router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/places', placesRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
