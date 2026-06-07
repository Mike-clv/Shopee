import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

function sanitizeBaseName(fileName = '') {
  return path
    .basename(fileName, path.extname(fileName))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'image';
}

function ensureAllowedImage(file) {
  if (!file) {
    const error = new Error('Chưa có file ảnh để upload.');
    error.status = 400;
    throw error;
  }

  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Chỉ hỗ trợ upload ảnh JPG, PNG, WEBP, GIF hoặc SVG.');
    error.status = 400;
    throw error;
  }
}

function buildFileName(file) {
  const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
  return `${Date.now()}-${crypto.randomUUID()}-${sanitizeBaseName(file.originalname)}${ext}`;
}

export async function saveImageUpload(file) {
  ensureAllowedImage(file);
  const fileName = buildFileName(file);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${fileName}`, file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.mimetype,
    });

    return {
      url: blob.url,
      storage: 'vercel-blob',
      fileName,
    };
  }

  if (process.env.VERCEL) {
    const error = new Error('Thiếu BLOB_READ_WRITE_TOKEN. Trên Vercel, ảnh upload runtime cần lưu bằng Vercel Blob để không bị mất sau mỗi lần deploy.');
    error.status = 500;
    throw error;
  }

  const uploadDir = path.join(rootDir, process.env.UPLOAD_DIR || 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), file.buffer);

  return {
    url: `/uploads/${fileName}`,
    storage: 'local',
    fileName,
  };
}
