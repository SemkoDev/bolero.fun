import React from 'react';
import PopupMenuIcon from './PopupMenuIcon';

export default function StatusIcon ({ component, state }) {
    let icon = 'clock';
    let color = 'grey';
    let popup = state.status;
    switch (state.status) {
        case 'checking':
            icon = 'search';
            color = 'teal';
            break;
        case 'downloading':
            icon = 'download';
            color = 'orange';
            popup = component === 'Database' && state.progress.percent >= 0.99
                ? 'Extracting database - this may take a while'
                : `${state.status}: ${(state.progress.percent * 100).toFixed(2)}%`;
            break;
        case 'ready':
            icon = 'checkmark';
            color = 'olive';
            break;
        case 'starting':
            icon = 'send';
            color = 'yellow';
            break;
        case 'running':
            icon = 'play';
            color = 'green';
            break;
        case 'error':
            icon = 'frown';
            color = 'red';
            popup = `${state.status}: ${state.error}`;
            break;
        case 'stopped':
            icon = 'stop';
            color = 'grey';
            break;
        default:
            icon = 'clock';
            color = 'grey';
    }

    return (
        <PopupMenuIcon
            {...{ color, icon }}
            text={component}
            popupText={popup}
        />
    );
}
