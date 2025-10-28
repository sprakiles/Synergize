import express from 'express';
import prisma from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { title, projectId, priority, dueDate } = req.body;
    if (!title || !projectId) {
        return res.status(400).json({ msg: 'Title and Project ID are required.' });
    }

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId }});
        if (project.ownerId !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to add tasks to this project.' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                projectId,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                assigneeId: req.user.id 
            }
        });
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, status, priority, dueDate, assigneeId } = req.body;
        
        const task = await prisma.task.findUnique({ where: { id: req.params.id } });
        if (!task) {
            return res.status(404).json({ msg: 'Task not found.' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { title, status, priority, dueDate: dueDate ? new Date(dueDate) : undefined, assigneeId }
        });
        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;