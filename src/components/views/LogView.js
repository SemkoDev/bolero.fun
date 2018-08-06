import React from 'react';

export default function LogView ({ messages }) {
    messages = messages || [];
    messages.reverse();
    setTimeout(() => {
        const logview = document.getElementsByClassName('logview')[0];
        if (logview) {
            logview.scrollTop = logview.scrollHeight;
        }
    }, 10);
    return (
        <pre className='logview'>
            { messages.join('\n') }
        </pre>
    );
}
