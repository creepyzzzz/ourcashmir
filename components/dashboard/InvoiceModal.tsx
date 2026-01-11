import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
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

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2, // Higher resolution
                logging: false,
                useCORS: true
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice-${invoice.id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
                {/* Header Actions */}
                <div className="flex items-center justify-between p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl sticky top-0 z-10">
                    <h2 className="font-semibold text-amber-900">Invoice Details</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Invoice Content (Ref for PDF) */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-white via-white to-amber-50/30" ref={invoiceRef}>
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-2xl" style={{ fontFamily: 'serif' }}>C</span>
                                </div>
                                <div>
                                    <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>OurCashmir</span>
                                    <p className="text-xs text-amber-600 tracking-widest uppercase">Premium Cashmere</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1 pl-1">
                                <p className="text-amber-800">Srinagar, Jammu & Kashmir</p>
                                <p className="text-amber-800">India - 190001</p>
                                <p className="text-amber-700 font-medium">hello@ourcashmir.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-light text-amber-900 mb-2 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>INVOICE</h1>
                            <p className="text-amber-700 font-medium font-mono">#{invoice.id.toUpperCase()}</p>
                            <div className={`mt-4 inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm
                                ${invoice.status === 'paid' ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200' : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200'}
                            `}>
                                {invoice.status === 'paid' ? '✓ Paid' : '◐ Pending'}
                            </div>
                        </div>
                    </div>

                    {/* Client & Date Info */}
                    <div className="grid grid-cols-2 gap-8 mb-12 p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-100">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-2">Bill To</p>
                            <h3 className="font-bold text-gray-900 text-lg">{invoice.clients?.name || 'Valued Client'}</h3>
                            {invoice.clients?.company && (
                                <p className="text-gray-600">{invoice.clients.company}</p>
                            )}
                            <p className="text-amber-700 text-sm mt-1 font-mono">{invoice.client_id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-1">Issue Date</p>
                                <p className="font-medium text-gray-900">{new Date(invoice.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-1">Due Date</p>
                                <p className="font-medium text-gray-900">{new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-amber-200">
                                    <th className="py-3 text-xs uppercase tracking-wider text-amber-700 font-semibold">Description</th>
                                    <th className="py-3 text-right text-xs uppercase tracking-wider text-amber-700 font-semibold">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-50">
                                <tr>
                                    <td className="py-5 text-gray-700">
                                        <p className="font-medium text-gray-900">{invoice.description || 'Premium Cashmere Products & Services'}</p>
                                        <p className="text-sm text-gray-500 mt-1">Handcrafted with tradition, delivered with excellence.</p>
                                    </td>
                                    <td className="py-5 text-right font-semibold text-gray-900">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end border-t-2 border-amber-100 pt-6">
                        <div className="w-72 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax (0%)</span>
                                <span className="font-medium">₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 -mx-4 px-4 py-3 rounded-lg">
                                <span className="font-bold text-amber-900 text-lg">Total Due</span>
                                <span className="font-bold text-2xl bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center border-t border-amber-100 pt-8">
                        <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                            <p className="text-amber-800 font-medium" style={{ fontFamily: 'Georgia, serif' }}>Thank you for choosing OurCashmir!</p>
                            <p className="text-sm text-amber-600 mt-1">Where tradition meets timeless elegance.</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Please reference invoice #{invoice.id.toUpperCase()} for all correspondence.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
