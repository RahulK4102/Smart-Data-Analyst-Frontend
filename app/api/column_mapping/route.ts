import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_id,context } = await request.json();
  console.log(context)

    console.log("inside the data cleaning"+context);
    try {
      const response = await axios.post(
        'https://smart-data-backend.onrender.com/map_columns',
        { user_id,context:context },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("cleaning response : "+response)
      return NextResponse.json({
        message: 'Data cleaned successfully!',
        available_columns:response.data.available_columns,
        expected_columns:response.data.expected_columns
      }, { status: 200 });
    } catch (error:any) {
      console.error('Error sending data to Flask API:', error.response?.data || error.message);
      return NextResponse.json({
        message: 'Error sending data to Flask API',
        error: error.response?.data || error.message,
      }, { status: 500 });
    }
  
}
