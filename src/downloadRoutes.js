import express from 'express';
import { getUrl } from './s3.js';

const router = express.Router();

router.get('/download-single-file/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const url = await getUrl(key);

        return res.status(200).json({ url });
    } catch (error) {
        console.error('Error al generar URL de descarga:', error);
        return res.status(404).json({ error: 'Archivo no encontrado o error al generar URL' });
    }
});

export default router;