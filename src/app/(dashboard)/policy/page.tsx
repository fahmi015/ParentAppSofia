import React from 'react';

export default function PolicyPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">Internal Policy</h1>
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <iframe
                    src="https://api.sofia-sahara.com/pdf.pdf"
                    className="w-full h-full border-none"
                    title="Policy PDF"
                />
            </div>
        </div>
    );
}
