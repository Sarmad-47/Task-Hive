import React from 'react';

const BoardHeader = ({ boardData, searchQuery, setSearchQuery }) => (
    <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
        <h2 className='text-lg'>{boardData.name}</h2>
        <div className='flex items-center justify-center'>
            <div className='flex items-center ml-4'>
                <input
                    type="text"
                    className="p-2 border rounded w-64 bg-white text-black"
                    placeholder="Search by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    </div>
);

export default BoardHeader;
