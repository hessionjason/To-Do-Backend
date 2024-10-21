const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completedOn: { type: String, default: null }
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
// Fetch all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Update a todo (if you want to implement edit functionality)
app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
