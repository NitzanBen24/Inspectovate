import { authorizeUser, removeUserTkn } from '@/app/utils/auth/userAuth';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest): Promise<NextResponse> {
  return authorizeUser(req);    
}

export async function POST(): Promise<NextResponse> {
  return removeUserTkn();
}

