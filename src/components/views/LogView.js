import React from 'react';

export default function LogView ({ messages }) {
    messages = messages || [];
    return (
        <pre className='logview'>
            { messages.join('\n') }
        </pre>
    );
}
