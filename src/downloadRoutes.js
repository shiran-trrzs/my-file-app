import express from 'express';
import { getUrl, getUrls } from './s3.js';

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

router.post('/download-multiple-files', async (req, res) => {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length == 0) {
        return res.status(400).json({ error: 'Debe ingresar una lista de archivos' });
    }

    try {
        const urls = await Promise.all(getUrls(files));

        return res.status(200).json({
            message: 'URLs generadas exitosamente',
            urls,
        });
    } catch (error) {
        console.error('Error generando URLs:', error);
        return res.status(500).json({ error: 'Error al generar las URLs de descarga' });
    }
});

export default router;