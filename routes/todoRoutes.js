import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userID: req.userID
        }
    })
    res.json(todos);
})

router.post('/', async (req, res) => {
    const {task} = req.body;
    const todo = await prisma.todo.create({
        data: {
            task: task,
            userID: req.userID
        }
    })
    res.json(todo)
})

// Dynamic id to edit specific todo id
router.put('/:id', async (req, res) => {
    const {completed} = req.body;
    const {id} = req.params; // Get id from params
    
    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userID: req.userID
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

// Dynamic id to delete specific todo id
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userID: req.userID
        }
    })
    res.json({message: "Todo deleted"})
})

export default router;