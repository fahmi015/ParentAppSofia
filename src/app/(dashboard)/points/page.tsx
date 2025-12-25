import React from 'react';
import { getStudents } from '../../actions';
import PointsClient from '@/components/PointsClient';

export default async function PointsPage() {
    const { data: students } = await getStudents();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Student Points</h1>
            <PointsClient students={students || []} />
        </div>
    );
}
