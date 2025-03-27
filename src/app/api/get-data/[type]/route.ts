import { getManufactures, getTechnicians } from '@/app/server/lib/db/dbObject';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { type: string } }): Promise<NextResponse> => {
    const { type } = params;
    /**
     * get data from db by type => first case manufactures
     */    
    try {
      let response;
      switch(type) {
        case 'manufactures':
          response = await getManufactures();
          break;
        case 'technicians':
          response = await getTechnicians();          
      }
      
      return NextResponse.json(response);
    } catch (error: any) {
      console.error('Error fetching data, get-data:', error.message);
      return NextResponse.json({ error: 'Failed to load PDF template' }, { status: 500 });
    }
  } 
  