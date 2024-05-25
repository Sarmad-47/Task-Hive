import { useState, useEffect } from 'react';

const FilterSearchModal = ({ lists, setFilteredLists }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredLists(lists);
            return;
        }

        const filteredLists = lists.map(list => {
            const filteredItems = list.items.filter(card => {
                const nameMatch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
                const descriptionMatch = card.description ? card.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
                return nameMatch || descriptionMatch;
            });
            return { ...list, items: filteredItems };
        }).filter(list => list.items.length > 0);

        setFilteredLists(filteredLists);
    }, [searchQuery, lists, setFilteredLists]);

    return {
        searchQuery,
        setSearchQuery,
    };
};

export default FilterSearchModal;
