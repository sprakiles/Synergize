import express from 'express';
import prisma from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- GET all projects for the logged-in user ---
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { ownerId: req.user.id },
            include: { 
                tasks: true, 
                members: { include: { user: true } } 
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- CREATE a new project ---
router.post('/', authMiddleware, async (req, res) => {
    const { title, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });
    try {
        const newProject = await prisma.project.create({
            data: { 
                title, 
                ownerId: req.user.id, 
                startDate: startDate ? new Date(startDate) : null, 
                endDate: endDate ? new Date(endDate) : null 
            }
        });
        res.status(201).json(newProject);
    } catch (err) { 
        console.error(err.message); 
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- UPDATE an existing project ---
// @route   PUT /api/projects/:id
// @desc    Update a project's details
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, startDate, endDate } = req.body;

    try {
        const project = await prisma.project.findUnique({
            where: { id: id },
        });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.ownerId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const dataToUpdate = {
            title,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        const updatedProject = await prisma.project.update({
            where: { id: id },
            data: dataToUpdate,
            include: {
                tasks: true, 
            },
        });
        
        res.status(200).json(updatedProject);

    } catch (err) {
        console.error("Error updating project:", err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// --- DELETE a project ---
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await prisma.project.findUnique({ where: { id: req.params.id } });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.ownerId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await prisma.project.delete({ where: { id: req.params.id } });

        res.json({ msg: 'Project and all its tasks have been removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' }); 
    }
});

export default router;