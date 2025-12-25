import React from 'react';
import { getPublications } from '@/app/actions';
import ActivityCard from '@/components/ActivityCard';

export default async function ActivitiesPage() {
    const { data: activities, success } = await getPublications();

    if (!success) {
        return (
            <div className="text-center text-red-500 p-4">
                Failed to load activities
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center text-gray-500 p-8">
                No Activities Available
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4 pb-20 p-4">
            <h1 className="text-2xl font-bold text-primary mb-6">Activities</h1>
            {activities.map((activity: any) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
        </div>
    );
}
