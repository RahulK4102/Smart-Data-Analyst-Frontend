import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_id,choice } = await request.json();
  console.log(choice)

    console.log("inside the data cleaning"+choice);
    try {
      const response = await axios.post(
        'https://smart-data-backend.onrender.com/handle_nulls',
        { user_id,choice:choice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("cleaning response : "+response)
      return NextResponse.json({
        message: 'Data cleaned successfully!'
      }, { status: 200 });
    } catch (error:any) {
      console.error('Error sending data to Flask API:', error.response?.data || error.message);
      return NextResponse.json({
        message: 'Error sending data to Flask API',
        error: error.response?.data || error.message,
      }, { status: 500 });
    }
  
}
