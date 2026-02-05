import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md h-16 fixed top-0 right-0 left-64 z-10">
            <div className="h-full px-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dashboard Administration
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Admin</span>
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};
