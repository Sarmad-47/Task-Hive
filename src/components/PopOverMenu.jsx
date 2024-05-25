import React from 'react';
import { Popover } from 'react-tiny-popover';

const PopOverMenu = ({ isOpen, togglePopover, content, children }) => {
    return (
        <Popover
            isOpen={isOpen}
            align='start'
            positions={['bottom', 'right','top','left']} // preferred positions by priority // Currently bottom is being applied here. 
            //to apply other positions 
            padding={10}
            onClickOutside={togglePopover}
            content={content}
        >
            {children}
        </Popover>
    );
};

export default PopOverMenu;
