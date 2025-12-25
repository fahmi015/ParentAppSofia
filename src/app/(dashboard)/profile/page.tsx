import React from 'react';
import { cookies } from 'next/headers';
import ProfileClient from '@/components/ProfileClient';

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const userStr = cookieStore.get('user')?.value;
    let user = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user cookie', e);
        }
    }

    if (!user) {
        return <div className="p-4">User not found. Please login again.</div>;
    }

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">My Account</h1>
            <ProfileClient user={user} />
        </div>
    );
}
