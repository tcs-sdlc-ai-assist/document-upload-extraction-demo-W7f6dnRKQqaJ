import { ExtractionResult } from '@/src/lib/types';
import { getFileExtension } from '@/src/services/FileValidator';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractFromPdf(file: File): Promise<ExtractionResult> {
  try {
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: { str?: string }) => ('str' in item ? item.str : ''))
        .join(' ');
      textParts.push(pageText);
    }

    const text = textParts.join('\n\n').trim();

    return {
      success: true,
      text,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract text from PDF';
    return {
      success: false,
      text: '',
      errorMessage: message,
    };
  }
}

async function extractFromDocx(file: File): Promise<ExtractionResult> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    const text = result.value.trim();

    return {
      success: true,
      text,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract text from DOCX';
    return {
      success: false,
      text: '',
      errorMessage: message,
    };
  }
}

async function extractFromTxt(file: File): Promise<ExtractionResult> {
  try {
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      reader.readAsText(file);
    });

    return {
      success: true,
      text: text.trim(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract text from TXT';
    return {
      success: false,
      text: '',
      errorMessage: message,
    };
  }
}

async function extractTextOnce(file: File): Promise<ExtractionResult> {
  const extension = getFileExtension(file.name);

  switch (extension) {
    case '.pdf':
      return extractFromPdf(file);
    case '.docx':
      return extractFromDocx(file);
    case '.txt':
      return extractFromTxt(file);
    default:
      return {
        success: false,
        text: '',
        errorMessage: `Unsupported file type: ${extension}`,
      };
  }
}

async function extractText(file: File): Promise<ExtractionResult> {
  let lastResult: ExtractionResult = {
    success: false,
    text: '',
    errorMessage: 'Extraction not attempted',
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    lastResult = await extractTextOnce(file);

    if (lastResult.success) {
      return lastResult;
    }

    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  return {
    success: false,
    text: '',
    errorMessage: lastResult.errorMessage || 'Text extraction failed after retries',
  };
}

export {
  extractText,
  extractFromPdf,
  extractFromDocx,
  extractFromTxt,
};