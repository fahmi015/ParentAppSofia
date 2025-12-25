import React from 'react';
import { getExtraActivities } from '../../actions';

export default async function AnnualProgramPage() {
    const { data: activities } = await getExtraActivities();

    return (
        <div className="p-4 space-y-4 pb-20">
            <h1 className="text-2xl font-bold text-primary mb-6">Annual Program</h1>

            {activities && activities.length > 0 ? (
                <div className="space-y-4">
                    {activities.map((activity: any, index: number) => {
                        const dateParts = activity.date.split("-"); // Assuming YYYY-MM-DD
                        // Adjust based on format if needed, Flutter code did split

                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {dateParts.join(' / ')}
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                                    {activity.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p>No Activities Available</p>
                </div>
            )}
        </div>
    );
}
