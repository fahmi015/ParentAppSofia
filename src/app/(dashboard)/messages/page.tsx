import React from 'react';
import MessagesClient from '@/components/MessagesClient';

export default function MessagesPage() {
    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Messages</h1>
            <MessagesClient />
        </div>
    );
}
