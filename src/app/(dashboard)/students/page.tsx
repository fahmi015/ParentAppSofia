import React from 'react';
import { getStudents } from '../../actions';

export default async function StudentsPage() {
    const { data: students } = await getStudents();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Students List</h1>

            {students && students.length > 0 ? (
                <div className="space-y-4">
                    {students.map((student: any) => (
                        <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {student.avatar ? (
                                    <img src={student.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-gray-100" />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Img
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{student.first_name} {student.last_name}</h3>
                                <div className="text-sm text-gray-700 mt-1">
                                    <span className="font-semibold">Code Massar:</span> {student.massar_code}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    No students found.
                </div>
            )}
        </div>
    );
}
