import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { query,context,user_id,column_mapping } = await request.json();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/process_query',
        {
            user_id: user_id,
            context: context,
            query:query,
            column_mapping:column_mapping
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Chat Bot Response : "+response)
      return NextResponse.json({
        message: 'Chat Bot Response generated succesfully !',
        image:response.data.image
      }, { status: 200 });
    } catch (error:any) {
      console.error('Error sending data to Flask API:', error.response?.data || error.message);
      return NextResponse.json({
        message: 'Error sending data to Flask API',
        error: error.response?.data || error.message,
      }, { status: 500 });
    }
  
}
