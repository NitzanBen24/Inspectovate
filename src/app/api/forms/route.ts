import { changeFormStatus, formSubmit, removeForm, removeToArchive, searchForms } from "@/app/server/actions/formActions";
import { deleteForm, updateFormStatus } from "@/app/server/lib/db/forms";
import { fetchCompanyForms } from "@/app/server/services/companyService";

import { NextRequest, NextResponse } from "next/server";


async function _handleFormsPost(payload:any) {

    switch (payload.action) {
        case 'submit':
            return await formSubmit(payload);            
        case 'search':
            return await searchForms(payload);        
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
        
        if (!result.success) {
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

        /** Todo: testig, simulate false return */
        const actions: Record<string, (payload: any) => Promise<any>> = {
            single: changeFormStatus,
            all: removeToArchive,
          };
      
        const handler = actions[payload.action];
      
        if (!handler) {
            return NextResponse.json(
                { error: "Invalid action. trying to update form status." },
                { status: 400 }
            );
        }

        const result = await handler(payload);

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
        
        if (!payload.id) {
            return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
        }
        
        const result = await removeForm(payload)
        
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

