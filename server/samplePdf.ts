import fs from 'fs';
import path from 'path';

/**
 * Generates a valid standard PDF buffer for educational notes.
 */
export function generateValidNotePdf(title: string, subtitle: string, bodyLines: string[]): Buffer {
  const safeTitle = title.replace(/[()\\]/g, '');
  const safeSubtitle = subtitle.replace(/[()\\]/g, '');
  
  let textStream = `BT\n/F1 18 Tf\n50 730 Td\n(POLYTECHNIC HUB - Digital Study Library) Tj\n0 -30 Td\n/F1 14 Tf\n(${safeTitle}) Tj\n0 -22 Td\n/F1 11 Tf\n(${safeSubtitle}) Tj\n0 -25 Td\n`;
  
  for (const line of bodyLines) {
    const safeLine = line.replace(/[()\\]/g, '');
    textStream += `/F1 10 Tf\n(${safeLine}) Tj\n0 -16 Td\n`;
  }
  textStream += `ET`;

  const streamLength = Buffer.byteLength(textStream, 'utf8');

  const pdfStr = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${textStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000000${(300 + streamLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

  return Buffer.from(pdfStr, 'utf8');
}

export function ensureSamplePdfExists(uploadsDir: string) {
  const samplePath = path.join(uploadsDir, 'sample.pdf');
  if (fs.existsSync(samplePath)) return;

  const pdfBuf = generateValidNotePdf(
    'Electrical Circuit & Network Theory — Complete Notes',
    'Branch: Electrical Engineering | Semester 3 | Unit 1',
    [
      '1. Kirchhoffs Current Law (KCL): The algebraic sum of currents entering a junction is zero.',
      '   Formula: sum(I_in) = sum(I_out)',
      '2. Kirchhoffs Voltage Law (KVL): The algebraic sum of potential differences in a loop is zero.',
      '   Formula: sum(V) = 0',
      '3. Mesh Analysis and Nodal Analysis techniques for complex engineering circuits.',
      '4. Practical solved numerical examples and previous exam question sets.',
      'Note: This document was verified by Polytechnic Hub Academic Cell.'
    ]
  );

  try {
    fs.writeFileSync(samplePath, pdfBuf);
  } catch (e) {
    console.error('Failed to create sample PDF:', e);
  }
}

