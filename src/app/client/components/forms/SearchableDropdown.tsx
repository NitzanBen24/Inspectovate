import { ListOption, PdfField } from '@/app/utils/types/formTypes';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';


interface Props {
	field: PdfField;
	options: string[] | ListOption[];
	text: string;
	value?:string;
	onValueChange: (value: string, name: string, id?: number) => void;
}

export interface SearchableDropdownHandle {
  clear: () => void;
}

const SearchableDropdown = forwardRef<SearchableDropdownHandle, Props>(
  	({ field, options, text, value, onValueChange }: Props, ref) => {
	
		const [query, setQuery] = useState(value);
		const [isOpen, setIsOpen] = useState(false);
		const dropdownRef = useRef<HTMLDivElement>(null);

		const normalizedOptions = useMemo(
			() =>
				Array.isArray(options)
				? options.map((option) =>
						typeof option === 'string' ? { val: option } : option
					)
				: [],
			[options]
		);

    	// Filtered options are derived dynamically from `normalizedOptions` and `query`.
		const filteredOptions = useMemo(
			() =>
				query
				? normalizedOptions.filter((option) =>
						option.val.toLowerCase().includes(query.toLowerCase())
					)
				: normalizedOptions,
			[query, normalizedOptions]
		);
//console.log('options=.>',options)
    // todo: check if needed
    /**
     * useEffect(() => {
      setQuery(value || '');
    }, [value]);
     */

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const input = e.target.value;
			setQuery(input);
		};

		const handleOptionClick = (option: ListOption) => {
			setQuery(option.val);
			onValueChange(option.val, field.name, option?.id);
			setIsOpen(false);
		};

		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
    
		useEffect(() => {    
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [options]);

		useImperativeHandle(ref, () => ({
			clear: () => setQuery(''),
		}));

		const showDropdown = isOpen && filteredOptions.length > 0;

		//console.log('droDown.render=>')

		return (
			<div ref={dropdownRef} className="relative w-full">
				<input
					type="text"
					className="form-field mt-1 w-full border border-gray-300 rounded-md shadow-sm"
					placeholder={`${text}...`}
					key={ field.name }
					name={ field.name }
					value={query}
					onChange={handleInputChange}
					onFocus={() => setIsOpen(true)}
				/>
				{showDropdown && (
					<ul className="absolute w-full mt-2 z-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
						{filteredOptions.map((option) => (
							<li
								key={option.val + 'li'}
								className="p-2 hover:bg-gray-100 cursor-pointer"
								onClick={() => handleOptionClick(option)}
							>
								{option.val}
							</li>
						))}
					</ul>
				)}
			</div>
		);
  }
);

export default SearchableDropdown;

