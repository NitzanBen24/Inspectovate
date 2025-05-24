import { sendDynamicForm } from '@/app/server/actions/dynamicFormActions';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    
    try {

        const payload = await req.json();    
    
        if (!payload) {
            return NextResponse.json({ error: "Missing payload data!" }, { status: 400 });
        }
    
        const result = await sendDynamicForm(payload);
        
        if (!result.success) {
            return NextResponse.json(                
                result,
                { status: 500 }
            );
        }
    
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Unknown error in POST Dynamic Form:", error);        
        return NextResponse.json({ message: error.message || "Unknown error occurred" }, { status: 500 });
    }
    
}
    

