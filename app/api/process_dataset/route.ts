import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('user_id') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  const newFormData = new FormData();
  newFormData.append('file', file, file.name);
  newFormData.append('user_id', userId);

  try {
    const response = await axios.post('https://smart-data-backend.onrender.com/process_dataset', newFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      context_report: response.data.context_report,
      file_id: response.data.file_id,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error sending file to Flask API:', error.response?.data || error.message);
    return NextResponse.json({
      message: 'Error sending file to Flask API',
      error: error.response?.data || error.message,
    }, { status: 500 });
  }
}
