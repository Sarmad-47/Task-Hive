import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Edit, Trash, MoreHorizontal } from 'react-feather';
import PopoverMenu from '../PopOverMenu';
import RenameInput from './RenameInput';
import TaskCard from './TaskCard';
import Card from './Card';

const ShowList = ({ x, ind, showOptions, toggleOptions, handleRenameChange, saveRename, deleteList, openModal, tempTitle, setShowOptions, fetchLists, boardData, handleEditClick}) => (
    <Droppable key={ind} droppableId={ind.toString()}>
        {(provided, snapshot) => (
            <div className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
                <div className="list-body">
                    <div className='flex justify-between p-1'>
                        <span>{x.name}</span>
                        <PopoverMenu
                            isOpen={showOptions === ind}
                            togglePopover={() => toggleOptions(ind)}
                            content={
                                <div className='bg-gray-800 text-white rounded shadow-lg py-2'>
                                    <button onClick={() => handleEditClick(ind)} className='flex items-center px-3 py-2 hover:bg-gray-600'>
                                        <Edit size={16} className='mr-2' />
                                        Rename
                                    </button>
                                    <button onClick={() => deleteList(ind)} className='flex items-center px-3 py-2 text-red-500 hover:bg-gray-600'>
                                        <Trash size={16} className='mr-2' />
                                        Delete
                                    </button>
                                </div>
                            }
                        >
                            <button className='hover:bg-gray-500 p-1 rounded-sm' onClick={() => toggleOptions(ind)}>
                                <MoreHorizontal size={16} />
                            </button>
                        </PopoverMenu>
                    </div>
                    {showOptions === `rename-${ind}` && (
                        <RenameInput
                            currentName={tempTitle}
                            handleRenameChange={handleRenameChange}
                            saveRename={saveRename}
                            index={ind}
                            setShowOptions={setShowOptions}
                        />
                    )}
                    <div className='py-1'
                        ref={provided.innerRef}
                        style={{ backgroundColor: snapshot.isDraggingOver ? '#222' : 'transparent' }}
                        {...provided.droppableProps}
                    >
                        {x.items && x.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <TaskCard item={item} openModal={openModal} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    <Card index={ind} listId={x.id} boardId={boardData.id} refreshLists={fetchLists} />
                </div>
            </div>
        )}
    </Droppable>
);

export default ShowList;
