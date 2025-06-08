import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { user_id,column_mapping,business_context } = await request.json();
  console.log(column_mapping)

    console.log("inside the Report Generation"+column_mapping);
    try {
      const response = await axios.post(
        'https://smart-data-backend.onrender.com/generate_report',
        { user_id,column_mapping:column_mapping,business_context:business_context },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Report Genration : "+response)
      return NextResponse.json({
        message: 'Report Genrated successfully!'
      }, { status: 200 });
    } catch (error:any) {
      console.error('Error sending data to Flask API:', error.response?.data || error.message);
      return NextResponse.json({
        message: 'Error sending data to Flask API',
        error: error.response?.data || error.message,
      }, { status: 500 });
    }
  
}
