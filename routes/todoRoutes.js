import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
    const todos = getTodos.all(req.userID); // req.user.id is set in auth middleware
    res.json(todos);
})

router.post('/', (req, res) => {
    const {task} = req.body;
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
    const result = insertTodo.run(req.userID, task); // req.user.id is set in auth middleware
    res.json({id: result.lastInsertRowid, task: task, completed: 0})
})

// Dynamic id to edit specific todo id
router.put('/:id', (req, res) => {
    const {completed} = req.body;
    const {id} = req.params; // Get id from params
    const updateTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`);
    updateTodo.run(completed, id);

    res.json({message: "Todo completed"})
})

// Dynamic id to delete specific todo id
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
    deleteTodo.run(id, req.userID); // req.user.id is set in auth middleware
    res.json({message: "Todo deleted"})
})

export default router;