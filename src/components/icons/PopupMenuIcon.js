import React from 'react';
import { Menu, Icon, Popup } from 'semantic-ui-react';

export default function PopupMenuIcon ({ text, color, icon, onClick, popupText }) {
    const item = (
        <Menu.Item name={text} {...{ color, onClick }}>
            <Icon name={icon} {...{ color }} />
            {text}
        </Menu.Item>
    );

    return (
        <Popup trigger={item} content={popupText} wide />
    );
}

PopupMenuIcon.defaultProps = {
    onClick: () => {}
};
