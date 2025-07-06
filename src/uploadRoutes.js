import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from './s3.js';
import { fileTypeFromBuffer } from 'file-type';

const router = express.Router();
const upload = multer();

router.post('/upload-single-file', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('Archivo no encontrado');

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    const detectedType = await fileTypeFromBuffer(file.buffer);
    const mimeType = detectedType?.mime || file.mimetype;

    if (!allowedTypes.includes(mimeType)) {
        return res.status(400).json({ error: 'Tipo de archivo no permitido' });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    try {
        await uploadToS3(file.buffer, fileName, mimeType);

        return res.status(200).json({
            message: 'Archivo cargado exitosamente',
            fileName,
            mimeType,
        });
    } catch (error) {
        console.error('Error al cargar a S3:', error);
        return res.status(500).json({ error: 'Error al cargar el archivo a S3' });
    }
});

router.post('/upload-multiple-files', upload.array('files'), async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Archivos no encontrados' });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    const errors = [];
    const successes = [];

    for (const file of files) {
        const originalName = file.originalname;

        const detectedType = await fileTypeFromBuffer(file.buffer);
        const mimeType = detectedType?.mime || file.mimetype;

        if (!allowedTypes.includes(mimeType)) {
            errors.push({
                file: originalName,
                error: `Tipo de archivo no permitido: ${mimeType}`
            });
            continue;
        }

        const fileName = `${uuidv4()}-${originalName}`;

        try {
            await uploadToS3(file.buffer, fileName, mimeType);

            successes.push({
                file: originalName,
                fileName,
                mimeType
            });
        } catch (err) {
            console.error(`Error al subir archivo ${originalName}:`, err);
            errors.push({
                file: originalName,
                error: err.message
            });
        }
    }

    const totalFailedFiles = errors.length;
    const totalSuccessfulFiles = successes.length;

    return res.status(207).json({
        message: `Cargado(s) ${totalSuccessfulFiles} archivo(s) con éxito y ${totalFailedFiles} archivo(s) fallido(s)`,
        uploaded: successes,
        failed: errors
    });
});

export default router;