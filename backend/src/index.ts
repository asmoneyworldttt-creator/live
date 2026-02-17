import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './services/socket.service';
import { initJobs } from './jobs/cron';
import { errorHandler } from './middleware/error.middleware';

// Route Imports
import usersRoutes from './routes/users';
import discoveryRoutes from './routes/discovery';
import chatRoutes from './routes/chat';
import walletRoutes from './routes/wallet';
import premiumRoutes from './routes/premium';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payments';
import callRoutes from './routes/calls';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Initialize Real-time Features
const io = initSocket(httpServer);
app.set('io', io);

// Initialize Background Jobs
initJobs();

// Routes
app.get('/', (req, res) => {
    res.send('Social App Backend API is running with AI Intelligence & Real-time Support');
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/calls', callRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
