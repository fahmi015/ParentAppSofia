import React from 'react';
import { getPublications } from '@/app/actions';
import ActivityCard from '@/components/ActivityCard';

export default async function DevoirPage() {
    const { data: publications, success } = await getPublications();

    if (!success) {
        return (
            <div className="text-center text-red-500 p-4">
                Failed to load devoirs
            </div>
        );
    }

    const devoirs = publications?.filter((item: any) => item.type === 'devoir') || [];

    if (devoirs.length === 0) {
        return (
            <div className="text-center text-gray-500 p-8">
                No Devoirs Available
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4 pb-20 p-4">
            <h1 className="text-2xl font-bold text-primary mb-6">Devoirs</h1>
            {devoirs.map((devoir: any) => (
                <ActivityCard key={devoir.id} activity={devoir} />
            ))}
        </div>
    );
}
