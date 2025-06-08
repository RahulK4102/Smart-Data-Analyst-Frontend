import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_id,outlierOptions } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  console.log("inside detect")

  try {
    const response = await axios.post(
      'https://smart-data-backend.onrender.com/detect_outliers',
      { user_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      message: 'Outliers detected successfully!',
      outliers: response.data.outliers,          // List of column-wise outlier stats
      boxplots: response.data.boxplots,          // Dict of base64 encoded images
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error contacting Flask API:', error.response?.data || error.message);
    return NextResponse.json({
      message: 'Error contacting Flask API',
      error: error.response?.data || error.message,
    }, { status: 500 });
  }
}
