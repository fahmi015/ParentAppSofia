'use client';

import React from 'react';
import Image from 'next/image';
import { FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface Activity {
    id: number;
    title: string;
    description: string;
    type: string;
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
        role: string;
    };
    groups: { id: number; name: string }[];
    links: string[];
    images: {
        id: number;
        original_url: string;
        mime_type: string;
    }[];
}

interface ActivityCardProps {
    activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                                {activity.user.first_name} {activity.user.last_name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                                {activity.user.role}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                    </div>
                </div>
                <span className="text-blue-500 text-xs font-bold uppercase">
                    {activity.type === 'activity' ? 'Activité' : 'Annonce'}
                </span>
            </div>

            {/* Groups */}
            {activity.groups.length > 0 && (
                <div className="mb-3">
                    <span className="text-sm text-gray-600 font-medium">Les Groupes : </span>
                    <span className="text-sm text-gray-800">
                        {activity.groups.map((g) => g.name).join(', ')}
                    </span>
                </div>
            )}

            {/* Content */}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h4>
            {activity.description && (
                <div className="text-gray-700 whitespace-pre-wrap mb-4">
                    {activity.description}
                </div>
            )}

            {/* Links */}
            {activity.links && activity.links.length > 0 && (
                <div className="mb-4 space-y-1">
                    {activity.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline text-sm"
                        >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            {link}
                        </a>
                    ))}
                </div>
            )}

            {/* Attachments/Images */}
            {activity.images && activity.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {activity.images.map((img, idx) => {
                        const isImage = img.mime_type.startsWith('image/');
                        const isPdf = img.mime_type === 'application/pdf';
                        const isWord = img.mime_type.includes('wordprocessingml');

                        if (isImage) {
                            return (
                                <a key={idx} href={img.original_url} target="_blank" rel="noopener noreferrer" className="block relative h-48 w-full">
                                    <Image
                                        src={img.original_url}
                                        alt="Attachment"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-md border border-gray-200"
                                    />
                                </a>
                            );
                        }

                        return (
                            <a
                                key={idx}
                                href={img.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {isPdf ? (
                                    <FileText className="h-8 w-8 text-red-500 mr-3" />
                                ) : isWord ? (
                                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                ) : (
                                    <FileText className="h-8 w-8 text-gray-500 mr-3" />
                                )}
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    View Document
                                </span>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
