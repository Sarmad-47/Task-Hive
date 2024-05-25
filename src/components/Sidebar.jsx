import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Plus, X, MoreHorizontal, Edit, Trash } from 'react-feather';
import { BoardContext } from '../context/BoardContext';
import PopoverMenu from './PopOverMenu';
import { auth, db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
    };
    const [boardData, setBoarddata] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [showPop, setShowPop] = useState(false);
    const { allBoard, setAllBoard,triggerFetchLists } = useContext(BoardContext);
    const [error, setError] = useState('');
    const [showOptions, setShowOptions] = useState(null);
    const [tempName, setTempName] = useState('');
    const [shouldFetchBoards, setShouldFetchBoards] = useState(true);

    const boardsRef = collection(db, 'Boards');

    const showAllBoards = useCallback(async () => {
        if (!user || !shouldFetchBoards) return;
        try {
            const q = query(boardsRef, where('uid', '==', user.uid));
            const data = await getDocs(q);
            const fetchedData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setAllBoard(prevState => ({
                ...prevState,
                boards: fetchedData
            }));
            setShouldFetchBoards(false); // Prevent further fetching until explicitly needed
        } catch (err) {
            console.error(err);
        }
    }, [user, boardsRef, setAllBoard, shouldFetchBoards]);

    useEffect(() => {
        showAllBoards();
    }, [user, showAllBoards]);

    const setActiveBoard = (i) => {
        let newBoard = { ...allBoard };
        newBoard.active = i;
        setAllBoard(newBoard);
        triggerFetchLists();
    };

    const addBoard = async () => {
        if (boardData.name.trim() === '' || boardData.bgcolor.trim() === '') {
            setError('Both fields are required.');
            return;
        }
        try {
            const q = query(boardsRef, where('uid', '==', user.uid), where('name', '==', boardData.name));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                const newBoard = {
                    name: boardData.name,
                    bgcolor: boardData.bgcolor,
                    uid: user.uid,
                    createdAt: new Date()
                };
                const docRef = await addDoc(boardsRef, newBoard);
                // Add the new board to the local state
                setAllBoard(prevState => ({
                    ...prevState,
                    boards: [...prevState.boards, { ...newBoard, id: docRef.id }]
                }));
                setShouldFetchBoards(false); // Prevent fetching again after adding
            } else {
                setError('Board with this name already exists.');
                return;
            }
            setBoarddata(blankBoard);
            setShowPop(false);
            setError('');
        } catch (error) {
            console.error('Error adding document: ', error);
            setError('Error adding board.');
        }
    };
    

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addBoard();
        }
    };

    const toggleOptions = (index) => {
        setShowOptions(showOptions === index ? null : index);
        setTempName('');
    };

    const handleRenameChange = (e) => {
        setTempName(e.target.value);
    };

    const saveRename = async (index) => {
        if (tempName.trim() === '') {
            return;
        }
        try {
            const boardId = allBoard.boards[index].id;
            const boardDoc = doc(db, 'Boards', boardId);

            // Update Firestore
            await updateDoc(boardDoc, { name: tempName });

            // Update local state
            let updatedBoards = [...allBoard.boards];
            updatedBoards[index].name = tempName;
            setAllBoard({ ...allBoard, boards: updatedBoards });
            setShowOptions(null);
            setTempName('');
        } catch (error) {
            console.error('Error updating document: ', error);
            setError('Error updating board.');
        }
    };


    const deleteBoard = async (index) => {
        try {
            const boardId = allBoard.boards[index].id;
    
            // Fetch all lists associated with the board
            const listsRef = collection(db, 'BoardsList');
            const listsQuery = query(listsRef, where('boardId', '==', boardId));
            const listsSnapshot = await getDocs(listsQuery);
            const listIds = listsSnapshot.docs.map(doc => doc.id);
    
            // Fetch all cards associated with the lists
            const cardsRef = collection(db, 'BoardsListCards');
            const cardsQuery = query(cardsRef, where('listId', 'in', listIds));
            const cardsSnapshot = await getDocs(cardsQuery);
    
            // Delete all cards
            const cardDeletionPromises = cardsSnapshot.docs.map(cardDoc => deleteDoc(doc(db, 'BoardsListCards', cardDoc.id)));
            await Promise.all(cardDeletionPromises);
    
            // Delete all lists
            const listDeletionPromises = listIds.map(listId => deleteDoc(doc(db, 'BoardsList', listId)));
            await Promise.all(listDeletionPromises);
    
            // Delete the board
            const boardDoc = doc(db, 'Boards', boardId);
            await deleteDoc(boardDoc);
    
            // Remove the deleted board from the local state
            let updatedBoards = [...allBoard.boards];
            updatedBoards.splice(index, 1);
            setAllBoard({ ...allBoard, boards: updatedBoards });
            setShowOptions(null);
        } catch (error) {
            console.error('Error deleting document: ', error);
            setError('Error deleting board.');
        }
    };
    

    return (
        <div className={`bg-[#121417] h-[calc(100vh-3rem)] border-r border-r-[#9fadbc29] transition-all linear duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`} >
            {collapsed && <div className='p-2'>
                <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-slate-600 rounded-sm'>
                    <ChevronRight size={18} />
                </button>
            </div>}
            {!collapsed && <div>
                <div className="workspace p-3 flex justify-between border-b border-b-[#9fadbc29]">
                    <h2>Task Hive Workspace</h2>
                    <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-slate-600 rounded-sm p-1'>
                        <ChevronLeft size={18} />
                    </button>
                </div>
                <div className='boardlist'>
                    <div className='flex justify-between px-3 py-2'>
                        <h6>Your Boards</h6>
                        <PopoverMenu
                            isOpen={showPop}
                            togglePopover={() => setShowPop(!showPop)}
                            content={
                                <div className='ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded'>
                                    <button
                                        onClick={() => setShowPop(!showPop)}
                                        className='absolute right-2 top-2 hover:bg-gray-500 p-1 rounded'>
                                        <X size={16} />
                                    </button>
                                    <h4 className='py-3'>Create Board</h4>
                                    {error && <p className='text-red-500 mb-2'>{error}</p>}
                                    <div className="mt-3 flex flex-col items-start w-full">
                                        <label htmlFor="title">Board Title <span>*</span></label>
                                        <input
                                            value={boardData.name}
                                            onChange={(e) => setBoarddata({ ...boardData, name: e.target.value })}
                                            onKeyDown={handleKeyPress}
                                            type='text'
                                            className='mb-2 h-8 px-2 w-full bg-gray-700'
                                        />
                                        <label htmlFor="Color">Board Color</label>
                                        <input
                                            value={boardData.bgcolor}
                                            onChange={(e) => setBoarddata({ ...boardData, bgcolor: e.target.value })}
                                            onKeyDown={handleKeyPress}
                                            type="color"
                                            className='mb-2 h-8 px-2 w-full bg-gray-700'
                                        />
                                        <button onClick={addBoard} className='w-full rounded h-8 bg-slate-700 mt-2 hover:bg-gray-500'>Create</button>
                                    </div>
                                </div>
                            }
                        >
                            <button onClick={() => setShowPop(!showPop)} className='hover:bg-slate-600 p-1 rounded-sm'>
                                <Plus size={16} />
                            </button>
                        </PopoverMenu>
                    </div>
                </div>
                <ul className='flex flex-col'>
                    {allBoard.boards && allBoard.boards.map((x, i) => {
                        return (
                            <li key={i} className='flex justify-between items-center relative py-1'>
                                {showOptions === `rename-${i}` ? (
                                    <div className='flex-grow flex items-center px-3 py-2'>
                                        <input
                                            type='text'
                                            defaultValue={x.name}
                                            onChange={handleRenameChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveRename(i);
                                                if (e.key === 'Escape') setShowOptions(null);
                                            }}
                                            className='bg-gray-700 text-white flex-grow p-1 rounded mr-2'
                                        />
                                        <button onClick={() => saveRename(i)} className='bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500'>
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setActiveBoard(i)} className='flex-grow px-3 py-2 text-sm flex items-center hover:bg-gray-500'>
                                        <span className='w-6 h-max rounded-sm mr-2' style={{ backgroundColor: `${x.bgcolor}` }}>&nbsp;</span>
                                        <span>{x.name}</span>
                                    </button>
                                )}
                                <PopoverMenu
                                    isOpen={showOptions === i}
                                    togglePopover={() => toggleOptions(i)}
                                    content={
                                        <div className='bg-gray-800 text-white rounded shadow-lg py-2' style={{ marginLeft: '10px' }}>
                                            <button onClick={() => setShowOptions(`rename-${i}`)} className='flex items-center px-3 py-2 hover:bg-gray-600'>
                                                <Edit size={16} className='mr-2' />
                                                Rename
                                            </button>
                                            <button onClick={() => deleteBoard(i)} className='flex items-center px-3 py-2 text-red-500 hover:bg-gray-600'>
                                                <Trash size={16} className='mr-2' />
                                                Delete
                                            </button>
                                        </div>
                                    }
                                >
                                    <button className='p-2 hover:bg-gray-500' onClick={() => toggleOptions(i)}>
                                        <MoreHorizontal size={16} />
                                    </button>
                                </PopoverMenu>
                            </li>
                        );
                    })}
                </ul>

            </div>}
        </div>
    );
};

export default Sidebar;
