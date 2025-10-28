import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Synergize API is running!');
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

const cleanup = async () => {
    console.log('Received shutdown signal. Cleaning up...');
    server.close(async () => {
        console.log('HTTP server closed.');
        await prisma.$disconnect();
        console.log('Prisma connection closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);