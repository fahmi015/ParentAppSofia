'use client';

import React, { useState } from 'react';
import { updateAvatar, updatePassword } from '@/app/actions';
import { Loader2, Camera, Lock, CheckCircle } from 'lucide-react';

interface ProfileClientProps {
    user: any;
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const [avatar, setAvatar] = useState(user.avatar);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(''); // success or error
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarLoading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                // The API likely expects pure base64 without prefix data:image/... or maybe full.
                // Flutter code uses: img64 = base64Encode(bytes). So raw base64.
                const rawBase64 = base64.split(',')[1];

                const result = await updateAvatar(rawBase64);
                if (result.success) {
                    setAvatar(result.data.avatar || base64); // Optimistic or from result
                } else {
                    console.error(result.message);
                }
                setAvatarLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage('');
        setPasswordSuccess(false);

        const result = await updatePassword({ current_password: currentPassword, new_password: newPassword });

        if (result.success) {
            setPasswordSuccess(true);
            setPasswordMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } else {
            setPasswordSuccess(false);
            setPasswordMessage(result.message || 'Failed to update password');
        }
        setPasswordLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                        {avatar ? (
                            <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-primary/90 transition-colors">
                        {avatarLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Camera className="h-5 w-5" />
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarLoading} />
                    </label>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>
                    <p className="text-gray-500">{user.user_cin}</p>
                </div>
            </div>

            {/* Password Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-gray-500" />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    {passwordMessage && (
                        <div className={`p-3 rounded-md text-sm font-medium ${passwordSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {passwordMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="text" // Shown as text in Flutter code example for visibility? User usually wants password type.
                            // Flutter code has obscureText toggle. I'll keep it simple as password type.
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {passwordLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
