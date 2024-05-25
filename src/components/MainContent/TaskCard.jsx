import React from 'react';
import { Edit2 } from 'react-feather';

const TaskCard = ({ item, openModal }) => {
    return (
        <div className="item flex flex-col justify-between bg-zinc-700 p-2 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
            <div className="flex justify-between items-center">
                <span className="text-white">{item.name}</span>
                <button className="hover:bg-gray-600 p-1 rounded-sm" onClick={() => openModal(item)}>
                    <Edit2 size={16} className="text-white" />
                </button>
            </div>
            {item.description && (
                <div className="mt-2 text-sm text-gray-300">
                    <p>{item.description}</p>
                </div>
            )}
            {item.dueDate && (
                <div className="mt-1 text-sm text-gray-400">
                    <p>Due: {item.dueDate}</p>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
