import { createWorker } from 'tesseract.js';

export const ocr = await createWorker('eng');
