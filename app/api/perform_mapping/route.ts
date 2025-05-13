import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_id,mapping } = await request.json();
  console.log(mapping)

    console.log("inside the data cleaning"+mapping);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/submit_mapping',
        { user_id,mapping:mapping },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Mapping response : "+response)
      return NextResponse.json({
        message: 'Data mapped successfully!'
      }, { status: 200 });
    } catch (error:any) {
      console.error('Error sending data to Flask API:', error.response?.data || error.message);
      return NextResponse.json({
        message: 'Error sending data to Flask API',
        error: error.response?.data || error.message,
      }, { status: 500 });
    }
  
}
