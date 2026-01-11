
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, FileText, Download, MoreVertical } from 'lucide-react';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        setReports([]);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage client reporting and deliverable assets.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors">
                    <Plus size={16} />
                    Upload Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-brand-surface border border-white/5 rounded-xl p-5 hover:border-brand-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
                                <FileText size={24} />
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <h3 className="font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{report.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">Client ID: {report.clientId} • {report.type}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                            <button className="text-sm font-medium text-brand-white hover:text-brand-primary flex items-center gap-1">
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <button className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                    <Plus size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">Create New Report</span>
                </button>
            </div>
        </div>
    );
}
