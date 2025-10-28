import express from 'express';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get the profile of the currently logged-in user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true
            }
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update the profile of the logged-in user
router.put('/profile', authMiddleware, async (req, res) => {
    const { fullName, email, avatarUrl } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { fullName, email, avatarUrl },
            select: { id: true, fullName: true, email: true, avatarUrl: true } // Return the updated user without the password
        });
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/users/password
// @desc    Change the user's password
router.put('/password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        // First, I need to verify their current password is correct.
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password.' });
        }

        // Now, I'll hash the new password.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // And finally, update it in the database.
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ msg: 'Password updated successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;