import React from 'react';

const RenameInput = ({ currentName, handleRenameChange, saveRename, index, setShowOptions }) => (
    <div className='flex-grow flex items-center px-3 py-2'>
        <input
            type='text'
            value={currentName}
            onChange={handleRenameChange}
            onKeyDown={(e) => {
                if (e.key === 'Enter') saveRename(index);
                if (e.key === 'Escape') setShowOptions(null);
            }}
            className='bg-gray-700 text-white flex-grow p-1 rounded mr-2'
        />
    </div>
);

export default RenameInput;
