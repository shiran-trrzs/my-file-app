import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

export const uploadToS3 = async (fileBuffer, key, mimetype) => {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
        },
    });

    upload.on("httpUploadProgress", (progress) => {
        console.log("Progreso:", progress);
    });

    await upload.done();
};

export const getUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    return await getSignedUrl(s3, command, {
        expiresIn: 60
    })
}