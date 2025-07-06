import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './uploadRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
