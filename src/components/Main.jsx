import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { BoardContext } from '../context/BoardContext';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import BoardHeader from './MainContent/BoardHeader';
import AddList from './MainContent/AddList';
import TaskModal from './MainContent/TaskModal';
import FilterSearchModal from './MainContent/FilterSearchModal';
import ShowList from './MainContent/ShowList';

const Main = () => {
    const { allBoard, shouldFetchLists, setShouldFetchLists } = useContext(BoardContext);
    const [user] = useAuthState(auth);
    const [showOptions, setShowOptions] = useState(null);
    const [tempTitle, setTempTitle] = useState('');
    const [modalTask, setModalTask] = useState(null);
    const [lists, setLists] = useState([]);
    const [originalLists, setOriginalLists] = useState([]); // Store original lists
    const { searchQuery, setSearchQuery } = FilterSearchModal({
        lists,
        setFilteredLists: setLists
    });

    const fetchLists = useCallback(async () => {
        if (!user || !allBoard.boards[allBoard.active]?.id || !shouldFetchLists) return;
        try {
            const boardId = allBoard.boards[allBoard.active].id;
            const listsRef = collection(db, 'BoardsList');
            const q = query(listsRef, where('uid', '==', user.uid), where('boardId', '==', boardId));
            const data = await getDocs(q);

            const listsWithCards = [];
            for (const doc of data.docs) {
                const listData = { ...doc.data(), id: doc.id };
                const cardsRef = collection(db, 'BoardsListCards');
                const cardsQuery = query(cardsRef, where('listId', '==', doc.id));
                const cardsData = await getDocs(cardsQuery);
                const fetchedCards = cardsData.docs.map(cardDoc => ({
                    ...cardDoc.data(),
                    id: cardDoc.id
                }));
                listsWithCards.push({ ...listData, items: fetchedCards });
            }

            setLists(listsWithCards);
            setOriginalLists(listsWithCards); // Store the original lists
            setShouldFetchLists(false); // Reset the fetch trigger

        } catch (err) {
            console.error(err);
        }
    }, [user, allBoard, shouldFetchLists]);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setLists(originalLists); // Reset lists to original when search query is cleared
        }
    }, [searchQuery, originalLists]);

    const boardData = allBoard.boards[allBoard.active];

    if (!boardData) {
        return <div>No active board selected</div>;
    }

    const toggleOptions = (index) => {
        if (showOptions === index) {
            setShowOptions(null);
        } else {
            setShowOptions(index);
        }
    };
    
    
    const handleEditClick = (index) => {
        setShowOptions(`rename-${index}`);
        setTempTitle(lists[index].name);
    };
    

    const handleRenameChange = (e) => {
        setTempTitle(e.target.value);
    };

    const saveRename = (index) => {
        renameList(index, tempTitle);
    };

    const renameList = async (index, newTitle) => {
        if (newTitle.trim() === '') return;
        const listId = lists[index].id;
        const listDoc = doc(db, 'BoardsList', listId);
        await updateDoc(listDoc, { name: newTitle });
        setTempTitle('');
        setShowOptions(null);
        setShouldFetchLists(true); // Mark for refetch
    };

    const deleteList = async (index) => {
        const listId = lists[index].id;
        try {
            // Fetch all cards associated with the list
            const cardsRef = collection(db, 'BoardsListCards');
            const cardsQuery = query(cardsRef, where('listId', '==', listId));
            const cardsSnapshot = await getDocs(cardsQuery);
    
            // Delete all cards
            const cardDeletionPromises = cardsSnapshot.docs.map(cardDoc => deleteDoc(doc(db, 'BoardsListCards', cardDoc.id)));
            await Promise.all(cardDeletionPromises);
    
            // Delete the list
            const listDoc = doc(db, 'BoardsList', listId);
            await deleteDoc(listDoc);
    
            // Remove the deleted list from the local state
            setLists(lists.filter((_, i) => i !== index));
            setShouldFetchLists(true); // Mark for refetch
        } catch (error) {
            console.error('Error deleting list: ', error);
        }
    };
    

    const openModal = (task) => {
        setModalTask(task);
    };

    const closeModal = () => {
        setModalTask(null);
    };

    const handleDeleteTask = (taskId) => {
        let updatedLists = lists.map((list) => ({
            ...list,
            items: list.items.filter((item) => item.id !== taskId),
        }));
        setLists(updatedLists);
    };

    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const s_id = parseInt(source.droppableId);
        const d_id = parseInt(destination.droppableId);

        if (s_id === d_id) {
            const list = lists[s_id];
            const [movedItem] = list.items.splice(source.index, 1);
            list.items.splice(destination.index, 0, movedItem);
            setLists([...lists]);
        } else {
            const sourceList = lists[s_id];
            const destList = lists[d_id];
            const [movedItem] = sourceList.items.splice(source.index, 1);
            destList.items.splice(destination.index, 0, movedItem);
            setLists([...lists]);
            const taskDoc = doc(db, 'BoardsListCards', movedItem.id);
            await updateDoc(taskDoc, { listId: destList.id });
        }
    };

    return (
        <div className='flex flex-col w-full' style={{ backgroundColor: `${boardData.bgcolor}` }}>
            <BoardHeader boardData={boardData} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className='flex flex-col w-full flex-grow relative'>
                <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {lists.map((x, ind) => (
                            <ShowList
                                key={ind}
                                x={x}
                                ind={ind}
                                showOptions={showOptions}
                                toggleOptions={toggleOptions}
                                handleRenameChange={handleRenameChange}
                                saveRename={saveRename}
                                deleteList={deleteList}
                                openModal={openModal}
                                tempTitle={tempTitle}
                                setShowOptions={setShowOptions}
                                fetchLists={fetchLists}
                                boardData={boardData}
                                handleEditClick={handleEditClick}
                            />
                        ))}
                    </DragDropContext>
                    <AddList boardId={boardData.id} refreshLists={() => setShouldFetchLists(true)} />
                </div>
            </div>
            {modalTask && <TaskModal task={modalTask} onClose={closeModal} onDelete={handleDeleteTask} refreshLists={() => setShouldFetchLists(true)} />}
        </div>
    );
};

export default Main;
