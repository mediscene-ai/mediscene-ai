import express from 'express';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.mjs';
import { chatRoutes } from './routes/chat.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', authRoutes);
app.use('/', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
