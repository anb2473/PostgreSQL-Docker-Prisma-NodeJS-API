import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/authRoutes.js'; // Import auth routes
import todoRoutes from './routes/todoRoutes.js'; // Import todo routes 
import authMiddleware from './middleware/authMiddleware.js'; 

const app = express();
const PORT = process.env.PORT || 8000;

// Get path from URL of module

const __filename = fileURLToPath(import.meta.url);
// Get dirnanme from path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
// Configure to serve static files from public
// This line also configures the server to automatically serve the fanta.css and styles.css when the browser requests them
app.use(express.static(path.join(__dirname, 'public')))

// Serve HTML file from public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
