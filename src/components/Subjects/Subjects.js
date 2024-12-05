import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const Subjects = () => {
    const options = [
        { value: 'Άλγεβρα', label: 'Άλγεβρα' },
        { value: 'Προγραμματισμός', label: 'Προγραμματισμός' },
        { value: 'Δίκτυα', label: 'Δίκτυα' },
        { value: 'Νέα Ελληνικά', label: 'Νέα Ελληνικά' },
        { value: 'Πληροφοριακά Συστήματα', label: 'Πληροφοριακά Συστήματα' },
    ]

    const [selected, setSelected] = useState(Array(options.length).fill(null))
    const [showDropdown, setShowDropdown] = useState(Array(options.length).fill(false))
    const [dropdownHeights, setDropdownHeights] = useState(Array(options.length).fill(0))
    const dropdownRefs = useRef(options.map(() => React.createRef()))

    useEffect(() => {
        const heights = dropdownRefs.current.map((ref, index) => {
            if (ref.current && showDropdown[index]) {
                return ref.current.scrollHeight
            }
            return 0
        })
        setDropdownHeights(heights)
    }, [showDropdown])

    const handleSelect = (index, opt) => {
        const newSelected = [...selected]
        newSelected[index] = opt
        setSelected(newSelected)
        handleToggleDropdown(index)
    }

    const handleToggleDropdown = (index) => {
        const newShowDropdown = [...showDropdown]
        newShowDropdown[index] = !newShowDropdown[index]
        
        // Close other open dropdowns
        newShowDropdown.forEach((_, i) => {
            if (i !== index) {
                newShowDropdown[i] = false;
            }
        });

        setShowDropdown(newShowDropdown)
    }

    return (
        <div className="flex flex-col space-y-4 text-black px-5">
            {options.map((option, index) => {
                const isOpen = showDropdown[index]
                const dropdownHeight = isOpen ? dropdownHeights[index] : 0

                return (
                    <div 
                        key={option.value} 
                        className="w-full relative"
                        style={{
                            marginBottom: isOpen ? `${dropdownHeight}px` : '0px'
                        }}
                    >
                        <div className="bg-white font-bold h-20 rounded-lg flex items-center p-4 relative z-10">
                            {selected[index]?.label || option.label}
                            <button 
                                className="absolute right-4" 
                                onClick={() => handleToggleDropdown(index)}
                            >
                                <ChevronDown 
                                    className={`w-6 h-6 transition-transform duration-300 ${
                                        isOpen ? 'rotate-180' : ''
                                    }`} 
                                />
                            </button>
                        </div>
                        <div 
                            ref={dropdownRefs.current[index]}
                            className={`absolute w-full z-0 transition-all duration-300 ease-in-out transform ${
                                isOpen 
                                    ? 'opacity-100 translate-y-0' 
                                    : 'opacity-0 -translate-y-4 pointer-events-none'
                            }`}
                        >
                            <div className="bg-gray-200 rounded-lg shadow-lg p-4 mt-2">
                                <ul className="space-y-2">
                                    {options.map((opt) => (
                                        <li 
                                            key={opt.value} 
                                            className="cursor-pointer hover:bg-gray-300 p-2 rounded" 
                                            onClick={() => handleSelect(index, opt)}
                                        >
                                            {opt.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Subjects