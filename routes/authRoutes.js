import express from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // User password for auth
import prisma from '../prismaClient.js';

// Sub section of app where we can build routes
const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bycrypt.hashSync(password, 8); // Hashing password with bcryptjs
    
    // Save user to db
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        // Give user default todo
        const defaultTodo = 'Hello! Add your first todo!';
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // create JWT token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'}); // 24 hours
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(503).json({error: 'Internal server error'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const passwordIsValid = await bycrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({message: 'Invalid password'});
        }

        // successful auth
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'}); // 24 hours
        res.json({ token });
    }
    catch (error) {
        console.log(error.message);
        res.status(503);
    }

})

export default router;
