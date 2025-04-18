import express from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // User password for auth
import db from '../db.js'; // Last line in db exports default db, allowing importing db

// Sub section of app where we can build routes
const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bycrypt.hashSync(password, 8); // Hashing password with bcryptjs
    
    // Save user to db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword);

        // Give user default todo
        const defaultTodo = 'Hello! Add your first todo!';
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // create JWT token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'}); // 24 hours
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(503).json({error: 'Internal server error'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username);

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
