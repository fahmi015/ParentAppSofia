'use client';

import React, { useState, useEffect } from 'react';
import { getStudentGroups } from '@/app/actions';
import { Loader2, User, CalendarClock } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns'; // You might need to install date-fns if not available, or just parse string

interface TimeSlotsClientProps {
    students: any[];
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

export default function TimeSlotsClient({ students }: TimeSlotsClientProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(DAYS[0]);

    // If only one student, select automatically? 
    // Flutter code doesn't seem to do that, but prompts to select.
    // We can select first one for better UX.
    useEffect(() => {
        if (students.length > 0) {
            handleStudentChange(students[0].id.toString());
        }
    }, []);

    const handleStudentChange = async (studentId: string) => {
        setSelectedStudentId(studentId);
        setLoading(true);
        try {
            const result = await getStudentGroups(parseInt(studentId));
            if (result.success) {
                setGroups(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = groups.filter((g: any) => g.day === activeTab)
        .sort((a: any, b: any) => a.session_start_at.localeCompare(b.session_start_at));

    return (
        <div className="space-y-6">
            {/* Student Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        value={selectedStudentId}
                        onChange={(e) => handleStudentChange(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value="" disabled>Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.first_name} {student.last_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            {selectedStudentId && (
                <div className="space-y-4">
                    <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
                        {DAYS.map((day) => (
                            <button
                                key={day}
                                onClick={() => setActiveTab(day)}
                                className={clsx(
                                    'px-4 py-2 font-medium text-sm whitespace-nowrap focus:outline-none transition-colors border-b-2',
                                    activeTab === day
                                        ? 'text-primary border-primary bg-primary/5'
                                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredSessions.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredSessions.map((session: any, index: number) => (
                                    <div key={index} className="p-4 flex items-center space-x-4">
                                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 text-center">
                                            <span className="text-lg font-bold text-gray-900 leading-none">
                                                {session.session_start_at_readable?.[0]}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {session.session_end_at_readable?.[1]}
                                            </span>
                                        </div>
                                        <div className="flex-shrink-0 h-10 w-1 bg-primary rounded-full"></div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {session.subject?.name}
                                            </h4>
                                            {session.user && (
                                                <p className="text-sm text-gray-500">
                                                    Prof. {session.user.first_name} {session.user.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <CalendarClock className="h-10 w-10 mb-2 opacity-50" />
                                <p>No classes scheduled for {activeTab}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
