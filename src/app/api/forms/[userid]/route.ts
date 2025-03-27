
import { getFormsByUserId } from '@/app/server/actions/formActions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params }: { params: { userid: string } }): Promise<NextResponse> {

    const { userid } = await params;
    
    try {

		const res = await getFormsByUserId(userid); 
		
		if (res.error) {
			return NextResponse.json( res , { status: 500 });
		}
		
		return NextResponse.json(res);

    } catch (error) {
		console.error('Error loading Data::', error);
		return NextResponse.json({ error: 'Failed to load user data' }, { status: 500 });
    }
} 