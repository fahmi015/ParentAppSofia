'use client';

import React, { useState, useEffect } from 'react';
import { getStudentStatistics } from '@/app/actions';
import { Loader2, User, BookOpen } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface ReportClientProps {
    students: any[];
}

const SEMESTERS = [
    { id: 1, name: 'Premier semestre' },
    { id: 2, name: 'Deuxième semestre' },
    { id: 3, name: 'Tout' },
];

export default function ReportClient({ students }: ReportClientProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (students.length > 0) {
            setSelectedStudentId(students[0].id.toString());
        }
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            fetchData();
        }
    }, [selectedStudentId, selectedSemester]); // Try auto-fetch on changes instead of explicit button

    const fetchData = async () => {
        setLoading(true);
        setChartData([]);
        try {
            const studentId = parseInt(selectedStudentId);
            const result = await getStudentStatistics(studentId, selectedSemester);
            if (result.success) {
                // Result is array of objects.
                // Flutter: xValueMapper: (datum, _) => datum["subject"]["name"], yValueMapper: datum["average_notes"]
                // We need to map this for Recharts
                const mappedData = result.data.map((item: any) => ({
                    name: item.subject?.name,
                    average: parseFloat(item.average_notes),
                }));
                setChartData(mappedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[500px]">
                {loading ? (
                    <div className="flex h-full justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 100, // Extra bottom for rotated labels
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                angle={-90}
                                textAnchor="end"
                                interval={0}
                                height={100}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={[0, 20]} />
                            <Tooltip />
                            <Legend verticalAlign="top" />
                            <Bar dataKey="average" fill="#511798" name="Average Grade" barSize={30} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full justify-center items-center text-gray-500">
                        No data available for chart
                    </div>
                )}
            </div>
        </div>
    );
}
