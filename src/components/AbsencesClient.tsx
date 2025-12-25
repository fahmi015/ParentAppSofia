'use client';

import React, { useState, useEffect } from 'react';
import { getStudentAbsences } from '@/app/actions';
import { Loader2, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface AbsencesClientProps {
    students: any[];
}

export default function AbsencesClient({ students }: AbsencesClientProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [absences, setAbsences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (students.length > 0) {
            handleStudentChange(students[0].id.toString());
        }
    }, []);

    const handleStudentChange = async (studentId: string) => {
        setSelectedStudentId(studentId);
        setLoading(true);
        try {
            const result = await getStudentAbsences(parseInt(studentId));
            if (result.success) {
                setAbsences(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const justifiedCount = absences.filter(a => a.justification != null).length;
    const unjustifiedCount = absences.filter(a => a.justification == null).length;
    const totalCount = absences.filter(a => a.type === 'absence').length;

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

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : selectedStudentId ? (
                <>
                    {/* Stats */}
                    {absences.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <span className="font-medium text-red-900">Unjustified</span>
                                </div>
                                <span className="text-2xl font-bold text-red-600">{unjustifiedCount}</span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="font-medium text-green-900">Justified</span>
                                </div>
                                <span className="text-2xl font-bold text-green-600">{justifiedCount}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">Total Absences</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-700">{totalCount}</span>
                            </div>
                        </div>
                    )}

                    {/* List */}
                    <div className="space-y-4">
                        {absences.length > 0 ? (
                            absences.map((absence, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-gray-900 text-sm">Leçon:</span>
                                            <span className="text-gray-700 text-sm">{absence.session === 1 ? 'Matin' : 'Soir'}</span>
                                        </div>
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-bold text-white",
                                            absence.type === 'delay' ? 'bg-orange-500' : 'bg-primary'
                                        )}>
                                            {absence.type === 'delay' ? 'Delay' : 'Absence'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-bold text-gray-900 text-sm">Date:</span>
                                        <span className="text-gray-700 text-sm">{absence.created_at}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-gray-900 text-sm">Justification:</span>
                                        <span className={clsx(
                                            "text-sm",
                                            absence.justification ? "text-green-600 font-medium" : "text-red-500 italic"
                                        )}>
                                            {absence.justification || 'Sans justification'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No absences recorded.
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
}
