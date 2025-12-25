'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:hidden sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="p-2 -ms-2 me-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
                <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{t(title)}</h1>
        </header>
    );
}
