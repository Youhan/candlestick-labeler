export function Button({ children, ...props }) {
    return (
        <button
            className="bg-violet-600 hover:bg-violet-700 active:bg-violet-400 text-white py-1 px-4 rounded flex items-center space-x-2"
            {...props}
        >
            {children}
        </button>
    );
}
