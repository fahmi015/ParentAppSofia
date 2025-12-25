import React from 'react';
import { getInvoices } from '../../actions';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export default async function InvoicesPage() {
    const { data: invoices } = await getInvoices();

    let totalRestAmount = 0;
    if (invoices) {
        invoices.forEach((inv: any) => {
            if (inv.rest_amount) totalRestAmount += inv.rest_amount;
        });
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Paid';
            case 'unpaid': return 'Unpaid';
            case 'semipaid': return 'Partially Paid';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-600 bg-green-50 border-green-200';
            case 'unpaid': return 'text-red-600 bg-red-50 border-red-200';
            case 'semipaid': return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };


    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span className="font-semibold text-gray-700">Total Due</span>
                <span className="text-xl font-bold text-red-600">{totalRestAmount} MAD</span>
            </div>

            <h1 className="text-2xl font-bold text-primary">Invoices</h1>

            {invoices && invoices.length > 0 ? (
                <div className="space-y-4">
                    {invoices.map((invoice: any) => (
                        <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{invoice.opertion_code}</span>
                                <span className={clsx("px-2 py-1 rounded-md text-xs font-bold border", getStatusColor(invoice.status))}>
                                    {getStatusLabel(invoice.status)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">{invoice.amount} MAD</span>
                                <span className="text-sm text-gray-500">
                                    {/* Format date if needed, assuming ISO string */}
                                    {invoice.created_at ? invoice.created_at.split('T')[0] : ''}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="font-semibold text-gray-700 text-sm">Operation Type</span>
                                <span className="text-sm text-gray-900">
                                    {invoice.type === 'registration_payment' ? 'Registration' : invoice.type === 'monthly_payment' ? 'Monthly' : invoice.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    No invoices found.
                </div>
            )}
        </div>
    );
}
