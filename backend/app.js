import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/user-routes.js';
import blogRouter from './routes/blog-routes.js';

const app = express();

app.use(express.json());

app.use(('/api/user'), userRouter);
app.use(('/api/blog'), blogRouter);

// Date middleware in GMT
app.use((req, res, next) => {
    const date = new Date()
    console.log(req.url, "Requested at:", date.toUTCString());
    next();
});

mongoose.connect("mongodb+srv://otis95:patecho@cluster0.b3httwl.mongodb.net/db?retryWrites=true&w=majority");

const db = mongoose.connection

// Handle Mongoose error
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

// Confirm successful MongoDB connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const port = process.env.PORT || 5000;

const listener = app.listen(port, () => {
  console.log(`⚡️Your app is listening on port ${port}`);
});
