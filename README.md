# API para cargar y descargar archivos

Esta es una API construida con **Node.js** y **Express** que permite **cargar y descargar archivos** (imágenes, videos, PDFs) directamente a un bucket de **AWS S3**.

## Tecnologías usadas

- Node.js + Express
- AWS SDK v3 (`@aws-sdk/client-s3`)
- `@aws-sdk/lib-storage` (para manejo de archivos pesados)
- Multer (para manejo de `multipart/form-data`)
- UUID (para renombrar los archivos)
- Dotenv (para manejo de variables de entorno)

## Endpoints
**URL desplegada:** http://34.228.53.48:3000 

La API puede ser probada en Postman con los siguientes paths:

### Subida de un solo archivo

**POST** `http://34.228.53.48:3000/upload-single-file`

- Tipo de body: `form-data`
- Clave: `file`. Valor: seleccionar un archivo (imagen, PDF o video)

**Respuesta:**

```bash
{
    "message": "Archivo cargado exitosamente",
    "fileName": "b2c5825e-4755-439a-fondo.jpg",
    "mimeType": "image/jpeg"
}
```

---

### Subida de múltiples archivos

**POST** `http://34.228.53.48:3000/upload-multiple-files`

- Tipo de body: `form-data`
- Clave: `files`, Tipo: File (selecciona varios archivos)

**Respuesta:**

```bash
{
    "message": "Cargado(s) 2 archivo(s) con éxito y 0 archivo(s) fallido(s)",
    "uploaded": [
        {
            "file": "archivo.pdf",
            "fileName": "2c0e99ff-286b-44aa-a18c-b556e36cbb7f-archivo.pdf",
            "mimeType": "application/pdf"
        },
        {
            "file": "fondo.jpg",
            "fileName": "1c19b7c3-e6c2-4761-b37a-472886c152a1-fondo.jpg",
            "mimeType": "image/jpeg"
        }
    ],
    "failed": []
}
```
---

### Descarga de un solo archivo

**GET** `http://34.228.53.48:3000/download-single-file/{fileName}`


**Respuesta:**

```bash
{
    "url": "https://nombre-bucket.s3.us-east-1.amazonaws.com/37248d6c-606c-4f1c-8111-6e7a0df3io1a-fondo.jpg"
}
```

### Descarga de múltiples archivos

**POST** `http://34.228.53.48:3000/download-multiple-files`

- Tipo de body: `raw` (formato JSON)

```json
{
   "files": [
    "uuid-archivo1.pdf",
    "uuid-archivo2.jpg",
    "uuid-archivo3.mp4"
  ]
}
```

**Respuesta:**

```bash
{
    "message": "URLs generadas exitosamente",
    "urls": [
        {
            "file": "uuid-archivo1.pdf",
            "url": "https://nombre-bucket.s3.us-east-1.amazonaws.com/uuid-archivo1.pdf"
        },
        {
            "file": "uuid-archivo2.jpg",
            "url": "https://nombre-bucket.s3.us-east-1.amazonaws.com/uuid-archivo2.jpg"
        },
              {
            "file": "uuid-archivo3.mp4",
            "url": "https://nombre-bucket.s3.us-east-1.amazonaws.com/uuid-archivo3.mp4"
        }
    ]
}
```
---

## Instalación

Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
```

Instalar dependencias
```bash
npm install
```

Crear archivo `.env` usando de referencia `.env.example`

```bash
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
AWS_REGION=''
AWS_BUCKET_NAME=''
PORT=''
```

Iniciar el servidor
```bash
npm run start
```
Esto iniciará la app en `http://localhost:PORT`

---

## Notas

- Si dos archivos tienen el mismo nombre, no se sobrescriben gracias al uso de uuid.

- Los archivos no se almacenan localmente, solo se procesan en memoria y se envían directamente a S3.

- Para restringir en un futuro el acceso a archivos por tipo o por usuario, sería recomendable almacenar el nombre del archivo `(fileName)` junto con su metadata en una base de datos como DynamoDB.

- Para entornos de producción, es importante restringir el acceso directo al bucket de S3. Se puede realizar a través de CloudFront, permitiendo que los archivos sean servidos únicamente desde el CDN.

- Para el manejo y seguimiento de incidencias se puede implementar una tabla de logs en DynamoDB que registre:

    - La fecha y hora de cada operación

    - El nombre de usuario o IP

    - Listado de los archivos que fallaron al cargar o descargar


