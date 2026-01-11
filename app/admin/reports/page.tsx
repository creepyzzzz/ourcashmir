
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, FileText, Download, MoreVertical, Trash2, X, Upload, CheckCircle2 } from 'lucide-react';
import { fetchReports, createReport, deleteReport, fetchClients, uploadFile, Report, Client } from '@/lib/data';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    // Modal & Upload State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [form, setForm] = useState<{
        title: string;
        client_id: string;
        type: string;
        file: File | null;
    }>({
        title: '',
        client_id: '',
        type: 'Monthly Report',
        file: null
    });

    const loadData = async () => {
        const [reportsData, clientsData] = await Promise.all([
            fetchReports(),
            fetchClients() // Needed for dropdown
        ]);
        setReports(reportsData);
        setClients(clientsData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenUpload = () => {
        setForm({
            title: '',
            client_id: clients.length > 0 ? clients[0].id : '',
            type: 'Monthly Report',
            file: null
        });
        setUploadProgress(0);
        setIsModalOpen(true);
    };

    const handleUpload = async () => {
        if (!form.file || !form.title || !form.client_id) {
            alert('Please fill in all fields and select a file.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate progress since Supabase storage doesn't give fine-grained progress in this simple client
            const interval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const fileUrl = await uploadFile(form.file, 'project-assets'); // Reusing bucket or ideally 'reports' bucket if exists. keeping safe 'project-assets' for now or 'misc'

            clearInterval(interval);
            setUploadProgress(100);

            await createReport({
                title: form.title,
                client_id: form.client_id,
                type: form.type,
                download_url: fileUrl,
                date: new Date().toISOString()
            });

            setIsModalOpen(false);
            setIsSubmitting(false);
            loadData();
        } catch (error) {
            console.error('Error uploading report:', error);
            alert('Failed to upload report.');
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this report?')) {
            await deleteReport(id);
            setReports(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-3 lg:space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-gray-400 text-xs lg:text-sm mt-0.5 lg:mt-1">Manage client reporting and deliverable assets.</p>
                </div>
                <button
                    onClick={handleOpenUpload}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black rounded-lg text-xs lg:text-sm font-bold hover:bg-brand-secondary transition-colors w-full sm:w-auto"
                >
                    <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Upload Report
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-brand-surface border border-white/5 rounded-lg lg:rounded-xl p-3 lg:p-5 hover:border-brand-primary/20 transition-all group relative">
                        <div className="flex justify-between items-start mb-2 lg:mb-4">
                            <div className={`p-2 lg:p-3 rounded-md lg:rounded-lg ${report.type.includes('Audit') ? 'bg-purple-500/10 text-purple-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                <FileText className="w-4 h-4 lg:w-6 lg:h-6" />
                            </div>
                            <button
                                onClick={() => handleDelete(report.id)}
                                className="text-gray-500 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Report"
                            >
                                <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </button>
                        </div>

                        <h3 className="font-bold text-sm lg:text-base text-white mb-0.5 lg:mb-1 group-hover:text-brand-primary transition-colors truncate" title={report.title}>{report.title}</h3>
                        <p className="text-[10px] lg:text-xs text-gray-500 mb-3 lg:mb-4">
                            {clients.find(c => c.id === report.client_id)?.name || 'Unknown'} • {report.type}
                        </p>

                        <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-white/5">
                            <span className="text-[10px] lg:text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                            {report.download_url ? (
                                <a
                                    href={report.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs lg:text-sm font-medium text-brand-white hover:text-brand-primary flex items-center gap-1"
                                >
                                    <Download className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                    Download
                                </a>
                            ) : (
                                <span className="text-[10px] lg:text-xs text-gray-600">No file</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <button
                    onClick={handleOpenUpload}
                    className="border border-dashed border-white/10 rounded-lg lg:rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all min-h-[140px] lg:min-h-[200px]"
                >
                    <Plus className="w-6 h-6 lg:w-8 lg:h-8 mb-1.5 lg:mb-2 opacity-50" />
                    <span className="text-xs lg:text-sm font-medium">Create New Report</span>
                </button>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 lg:p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-xl w-full max-w-sm p-4 lg:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4 lg:mb-6">
                            <h3 className="font-bold text-base lg:text-lg">Upload Report</h3>
                            {!isSubmitting && (
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>
                            )}
                        </div>

                        {isSubmitting ? (
                            <div className="py-6 lg:py-8 flex flex-col items-center justify-center space-y-4 lg:space-y-6">
                                <div className="w-full bg-white/5 rounded-full h-1.5 lg:h-2 overflow-hidden relative">
                                    <div
                                        className="h-full bg-brand-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,255,128,0.5)]"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl lg:text-3xl font-bold text-white">{Math.round(uploadProgress)}%</span>
                                    <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest mt-1.5 lg:mt-2">Uploading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 lg:space-y-4">
                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Report Title</label>
                                    <input
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. January 2024 Performance"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Client</label>
                                    <select
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                        value={form.client_id}
                                        onChange={e => setForm({ ...form, client_id: e.target.value })}
                                    >
                                        <option value="" disabled>Select Client</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] lg:text-xs font-medium text-gray-400 mb-1">Report Type</label>
                                    <select
                                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:border-brand-primary text-gray-200"
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                    >
                                        <option value="Monthly Report">Monthly Report</option>
                                        <option value="Quarterly Review">Quarterly Review</option>
                                        <option value="SEO Audit">SEO Audit</option>
                                        <option value="Strategy Deck">Strategy Deck</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 rounded-lg lg:rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center text-center cursor-pointer relative transition-colors">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })}
                                    />
                                    {form.file ? (
                                        <>
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-1.5 lg:mb-2">
                                                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </div>
                                            <p className="text-xs lg:text-sm font-medium text-white max-w-[180px] lg:max-w-[200px] truncate">{form.file.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-1.5 lg:mb-2">
                                                <Upload className="w-4 h-4 lg:w-5 lg:h-5" />
                                            </div>
                                            <p className="text-xs lg:text-sm font-medium text-gray-300">Click to upload PDF</p>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 lg:gap-3 mt-4 lg:mt-6">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!form.file || !form.title || !form.client_id}
                                        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-brand-primary text-black text-xs lg:text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-brand-secondary transition-colors"
                                    >
                                        Upload & Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
