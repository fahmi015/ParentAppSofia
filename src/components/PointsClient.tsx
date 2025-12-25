'use client';

import React, { useState, useEffect } from 'react';
import { getStudentNotes, getStudentFinalExam } from '@/app/actions';
import { Loader2, User, BookOpen, GraduationCap } from 'lucide-react';

interface PointsClientProps {
    students: any[];
}

const SEMESTERS = [
    { id: 1, name: 'Premier semestre' },
    { id: 2, name: 'Deuxième semestre' },
    { id: 3, name: 'Tout' },
];

const EXAMS = [
    { id: 1, name: 'Premier exam' },
    { id: 2, name: 'Deuxième exam' },
    { id: 3, name: 'La troisième exam' },
    { id: 4, name: 'La quatrième exam' },
    { id: 5, name: 'Contrôle continu' },
    { id: 6, name: 'Examen normalisé local' },
    { id: 7, name: 'Moyen général' },
];

export default function PointsClient({ students }: PointsClientProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [selectedExam, setSelectedExam] = useState<number>(1);

    const [notes, setNotes] = useState<any[]>([]);
    const [finalNote, setFinalNote] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (students.length > 0) {
            setSelectedStudentId(students[0].id.toString());
        }
    }, []);

    // Fetch when selections change
    useEffect(() => {
        if (selectedStudentId) {
            fetchData();
        }
    }, [selectedStudentId, selectedSemester, selectedExam]);

    const fetchData = async () => {
        setLoading(true);
        setNotes([]);
        setFinalNote(null);
        try {
            const studentId = parseInt(selectedStudentId);

            if (selectedExam === 7) {
                // Final Exam / Average
                const result = await getStudentFinalExam(studentId, selectedSemester);
                if (result.success) {
                    setFinalNote(result.data.semster_note);
                }
            } else {
                // Normal Notes
                const result = await getStudentNotes(studentId, selectedExam);
                if (result.success) {
                    // Filter by semester if needed, though API might return all?
                    // Flutter code filters client side: notes.where((element) => element['semester']=="${semisId}").toList()
                    // Wait, note['semester'] is "1" or "2". 
                    // If selectedSemester is 3 (All), we show all? Flutter logic is a bit specific.
                    // Flutter logic: `notes.where((element) => element['semester']=="${semisId}")`
                    // So it strictly filters by semester ID even if we fetched content.
                    // But if Semister is 3 "Tout", what does it do? 
                    // In Flutter `getSemister` sets `semisId`.
                    // The list view uses `notes.where((element) => element['semester']=="${semisId}")`.
                    // So if semisId is 3, it tries to match "3"? That might return nothing if API only has "1" and "2".
                    // Let's implement filtering logic similar to what's expected.

                    let fetchedNotes = result.data;
                    if (selectedSemester !== 3) {
                        fetchedNotes = fetchedNotes.filter((n: any) => n.semester == selectedSemester);
                    }
                    setNotes(fetchedNotes);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getSemesterName = (id: any) => {
        if (id == 1) return 'First Semester';
        if (id == 2) return 'Second Semester';
        return 'Unknown';
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                {/* Student */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="block w-full pl-9 py-2 text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Semester */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                            className="block w-full pl-9 py-2 text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            {SEMESTERS.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Exam */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                    <div className="relative">
                        <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(parseInt(e.target.value))}
                            className="block w-full pl-9 py-2 text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            {EXAMS.map((e) => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-4">
                    {selectedExam === 7 ? (
                        // Final Note Display
                        finalNote !== null && finalNote !== 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-bold text-gray-700">Full Name</span>
                                        <span className="text-gray-900 font-medium">
                                            {students.find(s => s.id == selectedStudentId)?.first_name} {students.find(s => s.id == selectedStudentId)?.last_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-bold text-gray-700">Semester</span>
                                        <span className="text-gray-900 font-medium">
                                            {selectedSemester === 1 ? 'First Semester' : 'Second Semester'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-700 text-lg">General Average</span>
                                        <span className="text-primary font-bold text-xl">
                                            {Number(finalNote).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">No data available for average.</div>
                        )
                    ) : (
                        // Notes List
                        notes.length > 0 ? (
                            notes.map((note, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">Subject:</span>
                                            <span className="text-gray-900 font-medium capitalize">{note.subject?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">Assignment:</span>
                                            <span className="text-gray-900 font-medium">{note.exam_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">Grade:</span>
                                            <span className="text-primary font-bold">{note.note}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-700">Semester:</span>
                                            <span className="text-gray-500 text-sm">{getSemesterName(note.semester)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">No grades found for this selection.</div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
