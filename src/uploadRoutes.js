import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from './s3.js';

const router = express.Router();
const upload = multer();

router.post('/upload-single-file', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('Archivo no encontrado');

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Tipo de archivo no permitido' });
    }
    const fileName = `${uuidv4()}-${file.originalname}`;

    try {
        await uploadToS3(file.buffer, fileName, file.mimetype);

        return res.status(200).json({
            message: 'Archivo subido exitosamente',
            fileName,
            mimeType: file.mimetype,
        });
    } catch (error) {
        console.error('Error al subir a S3:', error);
        return res.status(500).json({ error: 'Error al subir el archivo a S3' });
    }
});

export default router;