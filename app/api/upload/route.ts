import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = 'D:\\BE Project\\Backend\\Files';
  const path = join(uploadDir, file.name);
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    return NextResponse.json({ message: 'File uploaded successfully', filePath: path }, { status: 200 });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}