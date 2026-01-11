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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-white">Reports</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Access detailed performance analytics and monthly summaries.</p>
                </div>
                <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-surface border border-white/10 text-gray-300 rounded-lg text-xs sm:text-sm hover:text-white transition-colors">
                    <Filter size={14} className="sm:w-4 sm:h-4" /> Filter by Project
                </button>
            </div>

            {loading ? (
                <div className="p-6 sm:p-10 text-center text-gray-500">Loading reports...</div>
            ) : (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-brand-primary/30 transition-all group">
                            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gray-800 rounded-md sm:rounded-lg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-colors shrink-0">
                                    <FileText size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-white text-sm sm:text-base md:text-lg">{report.title}</h3>
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> {report.date}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block" />
                                        <span className="hidden sm:inline">{report.type}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-dark border border-white/10 text-brand-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
                            >
                                <Download size={14} className="sm:w-4 sm:h-4" /> Download
                            </button>
                        </div>
                    ))}

                    <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-6 bg-brand-dark/30 rounded-lg sm:rounded-xl border border-dashed border-white/10 text-center">
                        <p className="text-gray-500 text-xs sm:text-sm">Older reports are archived automatically. Contact support for access.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
