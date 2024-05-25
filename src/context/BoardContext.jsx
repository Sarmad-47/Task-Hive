import React, { createContext, useState } from "react";

export const BoardContext = createContext({});
export const BoardProvider = ({ children }) => {
  
    const [allBoard, setAllBoard] = useState({ boards: [] });
    const [shouldFetchLists, setShouldFetchLists] = useState(false);

    const triggerFetchLists = () => {
        setShouldFetchLists(true);
    };

    return (
        <BoardContext.Provider value={{ allBoard, setAllBoard,shouldFetchLists, setShouldFetchLists, triggerFetchLists}}>
            {children}
        </BoardContext.Provider>
    );
};
