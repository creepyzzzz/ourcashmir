import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { Invoice } from '@/lib/data';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoiceModalProps {
    invoice: Invoice | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !invoice) return null;

    // Custom Invoice ID Formatter: OCR-DDMMYYYY-XXX
    const formatInvoiceId = (inv: Invoice) => {
        const date = new Date(inv.created_at);
        const dd = date.getDate().toString().padStart(2, '0');
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = date.getFullYear();

        // Generate a deterministic 3-digit sequence based on the UUID for display consistency
        // In a real app, this should be a DB sequence field
        const hash = inv.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const sequence = (hash % 900) + 100; // Guaranteed 3 digits (100-999)

        return `OCR-${dd}${mm}${yyyy}-${sequence}`;
    };

    const formattedId = formatInvoiceId(invoice);

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 3, // High resolution for crisp text
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${formattedId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                        Invoice Details
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-primary hover:text-black transition-all"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Invoice Content (Ref for PDF) */}
                <div className="p-12 md:p-16 bg-white min-h-[800px] flex flex-col justify-between" ref={invoiceRef}>
                    <div>
                        {/* Top Branding Section */}
                        <div className="flex justify-between items-start mb-20">
                            <div className="flex flex-col gap-6">
                                <img
                                    src="/favicon/logo.png"
                                    alt="Logo"
                                    className="h-10 w-auto object-contain"
                                />
                                <div className="space-y-1 text-xs text-gray-500 font-medium tracking-wide">
                                    <p className="text-gray-900 font-bold text-sm">OurCashmir Marketing</p>
                                    <p>Srinagar, Jammu & Kashmir</p>
                                    <p>India - 190001</p>
                                    <p className="text-brand-primary">info@ourcashmir.com</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">INVOICE NO.</p>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-mono">{formattedId}</h1>

                                <div className="mt-4 flex justify-end gap-2">
                                    <div className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest
                                        ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}
                                    `}>
                                        {invoice.status === 'paid' ? 'PAID' : 'PENDING'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To & Details */}
                        <div className="flex justify-between gap-12 mb-20 border-t border-gray-100 pt-8">
                            <div className="flex-1">
                                <p className="text-[10px] bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-widest text-gray-500 font-bold mb-4">Billed To</p>
                                <h3 className="font-bold text-gray-900 text-xl">{invoice.clients?.name || 'Valued Client'}</h3>
                                {invoice.clients?.company && (
                                    <p className="text-gray-500 font-medium mt-1">{invoice.clients.company}</p>
                                )}
                                <p className="text-gray-400 text-xs font-mono mt-2">{invoice.client_id}</p>
                            </div>
                            <div className="flex gap-12 text-right">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Issue Date</p>
                                    <p className="font-bold text-gray-900">{new Date(invoice.created_at).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Due Date</p>
                                    <p className="font-bold text-gray-900">{new Date(invoice.due_date).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="mb-12">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-black">
                                        <th className="py-4 text-xs uppercase tracking-widest text-black font-bold">Item Description</th>
                                        <th className="py-4 text-right text-xs uppercase tracking-widest text-black font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-8 text-gray-900">
                                            <p className="font-bold text-lg mb-2">{invoice.description || 'Marketing Services'}</p>
                                            <p className="text-sm text-gray-500 max-w-md leading-relaxed">Professional services rendered as per the agreed contract terms and conditions.</p>
                                        </td>
                                        <td className="py-8 text-right font-bold text-gray-900 text-lg align-top">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Summary & Totals */}
                        <div className="flex justify-end">
                            <div className="w-72">
                                <div className="flex justify-between py-3 border-b border-gray-50 text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-50 text-sm">
                                    <span className="text-gray-500 font-medium">Tax (0%)</span>
                                    <span className="font-bold text-gray-900">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <span className="text-xs uppercase tracking-widest font-bold text-gray-900">Total Due</span>
                                    <span className="font-bold text-3xl text-brand-primary">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Bottom Aligned */}
                    <div className="mt-auto pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-1">
                            <p className="font-bold text-sm text-gray-900">Bank Details</p>
                            <p className="text-xs text-gray-500">Bank: J&K Bank</p>
                            <p className="text-xs text-gray-500">Account: 1234567890</p>
                            <p className="text-xs text-gray-500">IFSC: JAKA0PADSHA</p>
                        </div>
                        <div className="text-right space-y-2">
                            <p className="text-2xl font-bold font-mono tracking-tighter text-gray-900">OurCashmir.</p>
                            <p className="text-xs text-gray-400">Transforming ideas into reality.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
