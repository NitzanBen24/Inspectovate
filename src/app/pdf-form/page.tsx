'use client';
const _apiKey = process.env.NEXT_PUBLIC_API_KEY;
import { useState } from 'react';

type Block = {
  floor: string;
  insulation: string;
  grounding: string;
  rcd: string;
};

export default function PdfFormPage() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [date, setDate] = useState('');
    const [siteName, setSiteName] = useState('');

    const addBlock = () => {
        setBlocks([...blocks, { floor: '', insulation: '', grounding: '', rcd: '' }]);
    };

    const updateBlock = (index: number, field: keyof Block, value: string) => {
        const updated = [...blocks];
        updated[index][field] = value;
        setBlocks(updated);
    };

    const handleSubmit = async () => {
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            body: JSON.stringify({ date, siteName, blocks }),
            headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${_apiKey}` },
        });
    
        const data = await response.json();
        if (data.url) {
            // Open saved PDF URL in a new tab
            window.open(data.url);
        } else {
            alert('Error generating PDF');
        }
    };
  

//   return (
//     <div className="p-4">
//       <h1>טופס בדיקה</h1>
//       <input placeholder="תאריך" value={date} onChange={(e) => setDate(e.target.value)} />
//       <input placeholder="שם אתר" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
//       <hr />

//       {blocks.map((block, i) => (
//         <div key={i} className="border p-2 my-2">
//           <input placeholder="קומה" value={block.floor} onChange={(e) => updateBlock(i, 'floor', e.target.value)} />
//           <input placeholder="תוצאה בדיקת בידוד" value={block.insulation} onChange={(e) => updateBlock(i, 'insulation', e.target.value)} />
//           <input placeholder="תוצאה בדיקת הארקה" value={block.grounding} onChange={(e) => updateBlock(i, 'grounding', e.target.value)} />
//           <input placeholder="RCD" value={block.rcd} onChange={(e) => updateBlock(i, 'rcd', e.target.value)} />
//         </div>
//       ))}

//       <button onClick={addBlock}>הוסף לוח שירות</button>
//       <button onClick={handleSubmit}>צור PDF</button>
//     </div>
//   );
}
