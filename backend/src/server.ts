import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { prisma } from './lib/prisma';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import timesheetRoutes from './routes/timesheets';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import emailRoutes from './routes/emailRoutes';
import demoDataRoutes from './routes/demo-data';
// import testEmailRoutes from './routes/testEmail';
import { performanceMiddleware } from './middleware/performance';
// import { cacheMiddleware } from './middleware/cache';
// import performanceRoutes from './routes/performance';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(performanceMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/performance', performanceRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/demo', demoDataRoutes);
// app.use('/api/test', testEmailRoutes);

// Apply caching to specific routes - Disabled for now
// app.use('/api/timesheets', cacheMiddleware(60)); // Cache for 1 minute
// app.use('/api/projects', cacheMiddleware(300)); // Cache for 5 minutes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'UXFLOW Timesheet API'
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 UXFLOW Timesheet API running on port ${PORT}`);
});

export { prisma };