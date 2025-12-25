import React from 'react';
import { getStudents } from '../../actions';
import AbsencesClient from '@/components/AbsencesClient';

export default async function AbsencesPage() {
    const { data: students } = await getStudents();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Absences</h1>
            <AbsencesClient students={students || []} />
        </div>
    );
}
