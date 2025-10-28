import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: { fullName, email, password: hashedPassword },
        });
        
        const payload = { user: { id: newUser.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: newUser.id,
                        fullName: newUser.fullName,
                        email: newUser.email,
                        avatarUrl: newUser.avatarUrl
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };

        const expiresIn = rememberMe ? '30d' : '1d';

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        avatarUrl: user.avatarUrl
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;