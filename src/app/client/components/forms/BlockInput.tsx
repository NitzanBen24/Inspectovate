import { EmberBlock } from '@/app/utils/types/formTypes';
import React from 'react'

type BlockInputProps = {
    block: EmberBlock;
	index: number;    
	onChange: (index: number, field: keyof EmberBlock, value: string) => void;
	remove: (index: number) => void;
};


const BlockInput = ({ block, index, onChange, remove }: BlockInputProps) => {//

	
	const isFunctional = (value: boolean) => {		
		block.eboard = value ? 'ד. המתקן נבדק לטיב חומרים ואיכות עבודה ונמצא תקין:' : '';
	}

	
	return (	
		<div className="p-2 dblock border mb-2">
			<p className='flex justify-end'><button className='' onClick={() => remove(index)}>X</button></p>
			<h3>לוח {index + 1}</h3>			
			
			<div className="flex">
				<label>הארקה:</label>
				<input
					className='block-field mt-1 border border-gray-300 rounded-lg shadow-sm'
					type="text"
					defaultValue={block.ohm}
					onChange={(e) => onChange(index, 'ohm', e.target.value)}
				/>
			</div>
			<div className="flex">
				<label>מפסק פחת:</label>
				<input
					className='block-field mt-1 border border-gray-300 rounded-lg shadow-sm'
					type="text"
					defaultValue={block.depreciation}
					onChange={(e) => onChange(index, 'depreciation', e.target.value)}
				/>
			</div>
			<div className="flex">
				<label>זמן של :</label>
				<input
					className='block-field mt-1 border border-gray-300 rounded-lg shadow-sm'
					type="text"
					defaultValue={block.time}
					onChange={(e) => onChange(index, 'time', e.target.value)}
				/>
			</div>
			<div className="flex">
				<label>תקין:</label>
				<input
					className='block-field mt-1 border border-gray-300 rounded-lg shadow-sm'
					type="checkbox"					
					onChange={(e) => isFunctional(e.target.checked)}
				/>
			</div>
		</div>
	)
}

export default BlockInput