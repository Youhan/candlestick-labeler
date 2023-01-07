import React from 'react';

export default function PreCode({ children }) {
    return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm font-mono">
            <code>{children}</code>
        </pre>
    );
}
