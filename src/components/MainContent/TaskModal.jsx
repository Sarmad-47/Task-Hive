import React, { useState,useContext } from 'react';
import { X } from 'react-feather';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BoardContext } from '../../context/BoardContext';

const TaskModal = ({ task, onClose, onDelete, refreshLists }) => {
    const { allBoard } = useContext(BoardContext);
    const [title, setTitle] = useState(task.name);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');

    const boardName = allBoard.boards[allBoard.active].name;

    const handleSave = async () => {
        const taskDoc = doc(db, 'BoardsListCards', task.id);
        await updateDoc(taskDoc, { 
            name: title,
            description: description,
            dueDate: dueDate
        });
        refreshLists();
        onClose();
    };

    const handleDelete = async () => {
        const taskDoc = doc(db, 'BoardsListCards', task.id);
        await deleteDoc(taskDoc);
        onDelete(task.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 sm:mx-6 md:mx-8 lg:mx-10">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-bold text-black">Task Details</h2>
                    <button onClick={onClose} className="hover:bg-gray-300 rounded-full p-1 text-black">
                        <X size={20} />
                    </button>
                </div>
                <div className="mb-4 text-black">
                    <label className="block mb-2 font-medium text-black">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4 text-black">
                    <label className="block mb-2 font-medium text-black">Description</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-4  text-black">
                    <label className="block mb-2 font-medium text-black">Board</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded bg-gray-200"
                        value={boardName}
                        disabled
                    />
                </div>
                <div className="mb-4 text-black">
                    <label className="block mb-2 font-medium text-black">Due Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                        Delete
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
