'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/context/LanguageContext';
import { menuItems } from '@/lib/navigation';
import {
    LogOut,
    Globe,
    ChevronDown,
    X,
    Check,
    User
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { t, setLanguage, language, dir } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    return (
        <>
            {/* Overlay */}
            <div
                className={clsx(
                    'fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={clsx(
                    'fixed inset-y-0 z-50 w-72 bg-gradient-to-br from-[#511798] to-purple-800 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
                    isOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'),
                    dir === 'rtl' ? 'right-0 border-l border-white/10' : 'left-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* User Header */}
                    <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-800">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="Avatar"
                                        className="h-16 w-16 rounded-full border-2 border-white object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white shrink-0">
                                        <User className="h-8 w-8 text-white" />
                                    </div>
                                )}
                                <div className={clsx(dir === 'rtl' ? 'mr-4' : '')}>
                                    <h3 className="font-medium text-lg truncate w-32">
                                        {user?.first_name} {user?.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-200">{user?.cin}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="lg:hidden text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-200">
                            <div className="flex items-center"> </div>
                            <button onClick={logout} className="flex items-center hover:text-white transition-colors">
                                <LogOut className={clsx("h-4 w-4", dir === 'rtl' ? 'ml-1' : 'mr-1')} />
                                {t('Logout')}
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={clsx(
                                                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-gray-100 hover:bg-white/5 hover:text-white',
                                                isActive && (dir === 'rtl' ? 'border-r-4 border-white' : 'border-l-4 border-white')
                                            )}
                                            onClick={() => onClose()}
                                        >
                                            <Icon className={clsx("h-5 w-5", dir === 'rtl' ? 'ml-3' : 'mr-3')} />
                                            {t(item.name)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Language Switcher */}
                    <div className="p-4 border-t border-white/10 relative">
                        <div
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="border border-white/30 rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center">
                                <Globe className="h-5 w-5 mx-2" />
                                <span>{t('Change Language')}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </div>

                        {isLangMenuOpen && (
                            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                                <button
                                    onClick={() => { setLanguage('fr'); setIsLangMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {language === 'fr' && <Check className="h-4 w-4 mr-2 text-primary" />}
                                    <span className={language !== 'fr' ? 'ml-6' : ''}>Français</span>
                                </button>
                                <button
                                    onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {language === 'ar' && <Check className="h-4 w-4 mr-2 text-primary" />}
                                    <span className={language !== 'ar' ? 'ml-6' : ''}>العربية</span>
                                </button>
                                <button
                                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {language === 'en' && <Check className="h-4 w-4 mr-2 text-primary" />}
                                    <span className={language !== 'en' ? 'ml-6' : ''}>English</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
