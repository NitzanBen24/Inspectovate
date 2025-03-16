"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({ onSave }: { onSave: (signature: string) => void }) {
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [signature, setSignature] = useState<string | null>(null);

    const handleClear = () => {
        sigCanvas.current?.clear();
        setSignature(null);
    };

    const handleSave = () => {
        const signatureData = sigCanvas.current?.toDataURL("image/png");
        if (signatureData) {
            setSignature(signatureData);
            onSave(signatureData);        
        }
    };

    return (
        <div className="border p-4 flex-col justify-center">
            <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 400, height: 200, className: "signature-canvas border" }} />
            <div className="mt-2 flex gap-2">
                <button onClick={handleClear} className="bg-gray-300 px-2 py-1">Clear</button>
                <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1">Save</button>
            </div>
            {signature && <img src={signature} alt="Signature preview" className="mt-2 border" />}
        </div>
    );
}
