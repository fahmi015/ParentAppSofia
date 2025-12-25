import React from 'react';
import { getStudents } from '../../actions';
import ReportClient from '@/components/ReportClient';

export default async function ReportPage() {
    const { data: students } = await getStudents();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Statistical Report</h1>
            <ReportClient students={students || []} />
        </div>
    );
}
