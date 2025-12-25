import React from 'react';
import { getStudents } from '../../actions';
import TimeSlotsClient from '@/components/TimeSlotsClient';

export default async function TimeSlotsPage() {
    const { data: students } = await getStudents();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Time Slots</h1>
            <TimeSlotsClient students={students || []} />
        </div>
    );
}
