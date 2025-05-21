import axios from "axios";

const _apiKey = process.env.NEXT_PUBLIC_API_KEY;

export async function generatePdf(payload: any): Promise<any> {
    const { data } = await axios.post(
      '/api/generate-pdf',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${_apiKey}`,
        },
      }
    );
  
    return data;
  }
  