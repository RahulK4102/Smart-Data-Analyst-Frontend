import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_description, user_id } = await request.json();

  if (!user_description) {
    return NextResponse.json({ error: 'No user description provided' }, { status: 400 });
  }


  if (!user_id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    const response = await axios.post('http://127.0.0.1:5000/extract_insight', {
      user_description,
      user_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({
      message: 'Business insight extracted successfully!',
      business_insight: response.data.business_insight,
      output_path: response.data.output_path,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error sending data to Flask API:', error.response?.data || error.message);
    return NextResponse.json({
      message: 'Error sending data to Flask API',
      error: error.response?.data || error.message,
    }, { status: 500 });
  }
}
