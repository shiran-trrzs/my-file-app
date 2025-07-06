import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './uploadRoutes.js';
import dowloadRoutes from './downloadRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(uploadRoutes);
app.use(dowloadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
