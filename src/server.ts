import express from 'express';
import {getMoviesByYear} from './controller/movieController';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());

// Routes
app.get('/movies/:year', getMoviesByYear);

app.listen(PORT, () => {
    console.log(`\nRunning on port ${PORT}\n`);
});

export default app;
