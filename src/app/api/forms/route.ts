import { formSubmit, searchForms } from "@/app/server/actions/formActions";
import { deleteForm, updateFormStatus } from "@/app/server/lib/db/forms";

import { NextRequest, NextResponse } from "next/server";


async function _handleFormsPost(payload:any) {

    switch (payload.action) {
        case 'submit':
            return await formSubmit(payload);            
        case 'search':
            return await searchForms(payload.search);        
        default:
            return { success: false, message: 'no action!' };
    }
    

}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {

        const payload = await req.json();            
        
        if (!payload) {
            return NextResponse.json({ error: "Missing file to save!" }, { status: 400 });
        }

        const result = await _handleFormsPost(payload);
        
        if (result.error) {
            return NextResponse.json(                
                result,
                { status: 500 }
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Unknown error in POST Form:", error);        
        return NextResponse.json({ message: error.message || "Unknown error occurred" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const payload = await req.json(); // Expecting 'id' and 'updates' in the request body
        
        if (!payload.id || !payload.status || !payload.formName) {
            return NextResponse.json({ error: "Form ID and updates are required" }, { status: 400 });
        }        
        
        const result = await updateFormStatus(payload); // Call your update logic here

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Form update failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: result.message });
    } catch (error: unknown) {
        console.error("Error updating form:", error);
        return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    try {
        
        const payload = await req.json(); // Extract the `id` from the request body
        
        if (!payload.id || !payload.formName) {
            return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
        }

        const result = await deleteForm(payload.id.toString()); // Call your delete service or database function

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Form deletion failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: result.message });
    } catch (error: unknown) {
        console.error("Error deleting form:", error instanceof Error ? error.stack : error);
        return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
    }
}

