
import { isUserExists } from '@/app/server/actions/userActions';
import { addUserTkn } from '@/app/utils/auth/userAuth';
import { NextRequest, NextResponse } from 'next/server';

  
export async function POST(req: NextRequest): Promise<NextResponse> {

    try {      

      const { email, password } = await req.json();
      // Check if user exists
      const user = await isUserExists(email, password);

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }

      return addUserTkn(user);

    } catch (error) {
      console.error('Error during login:', error);
      return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
    }

}


// export const GET = async () => {
//     try {
//       const result = await getAllUsers();      
//       return NextResponse.json(result);
//     } catch (error) {
//       console.error('Error loading PDF template:', error);
//       return NextResponse.json({ error: 'Failed to load PDF template' }, { status: 500 });
//     }
//   } 




