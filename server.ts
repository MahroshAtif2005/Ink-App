import express, { WebApp } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authRoutes from './src/backend/routes/auth';
import entriesRoutes from './src/backend/routes/entries';
import insightsRoutes from './src/backend/routes/insights';
import errorMiddleware from './src/backend/middleware/errorMiddleware';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/entries', entriesRoutes);
app.use('/insights', insightsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
