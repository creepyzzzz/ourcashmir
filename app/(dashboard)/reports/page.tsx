'use client';

import { useEffect, useState } from 'react';
import { fetchReports, Report } from '@/lib/data';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports().then(data => {
            setReports(data);
            setLoading(false);
        });
    }, []);

    const handleDownload = () => {
        alert('Downloading report... (Mock Function)');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-brand-white">Reports</h2>
                    <p className="text-gray-400 text-sm mt-1">Access detailed performance analytics and monthly summaries.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-white/10 text-gray-300 rounded-lg text-sm hover:text-white transition-colors">
                    <Filter size={16} /> Filter by Project
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-500">Loading reports...</div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-brand-surface border border-brand-primary/10 rounded-xl p-5 flex items-center justify-between hover:border-brand-primary/30 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-white text-lg">{report.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {report.date}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span>{report.type}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-brand-dark border border-white/10 text-brand-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Download size={16} /> Download
                            </button>
                        </div>
                    ))}

                    <div className="mt-8 p-6 bg-brand-dark/30 rounded-xl border border-dashed border-white/10 text-center">
                        <p className="text-gray-500 text-sm">Older reports are archived automatically. Contact support for access.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
