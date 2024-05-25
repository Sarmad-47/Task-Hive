import React, { useState } from 'react';
import { Plus, X } from 'react-feather';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const Card = ({ index, listId, boardId, refreshLists }) => {
    const [show, setShow] = useState(false);
    const [card, setCard] = useState('');

    const saveCard = async () => {
        if (!card) {
            return;
        }
        try {
            await addDoc(collection(db, 'BoardsListCards'), {
                name: card,
                boardId: boardId,
                listId: listId,
                uid: auth.currentUser.uid,
                createdAt: new Date()
            });
            refreshLists(listId);
            setCard('');
            setShow(!show);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const closeBtn = () => {
        setCard('');
        setShow(!show);
    };

    return (
        <div>
            <div className="flex flex-col">
                {show && <div>
                    <textarea value={card} onChange={(e) => setCard(e.target.value)}
                        className='p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900'
                        cols="30"
                        rows="2"
                        placeholder='Enter Card Title...'>
                    </textarea>

                    <div className='flex p-1'>
                        <button onClick={saveCard} className='p-1 rounded bg-sky-600 text-white mr-2'>Add Card</button>
                        <button onClick={closeBtn} className='p-1 rounded hover:bg-gray-600'><X size={16} /></button>
                    </div>

                </div>}
                {!show && <button onClick={() => setShow(!show)} className='flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-gray-500 h-8'>
                    <Plus />
                    Add a Card
                </button>}
            </div>
        </div>
    );
}

export default Card;
