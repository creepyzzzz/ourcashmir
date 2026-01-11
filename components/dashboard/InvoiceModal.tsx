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
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl sticky top-0 z-10">
                    <h2 className="font-semibold text-gray-700">Invoice Details</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Invoice Content (Ref for PDF) */}
                <div className="p-8 md:p-12 bg-white" ref={invoiceRef}>
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight">Starship</span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>123 Marketing Ave, Suite 400</p>
                                <p>Creative City, ST 12345</p>
                                <p>billing@starship.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-light text-gray-900 mb-2">INVOICE</h1>
                            <p className="text-gray-500 font-medium">#{invoice.id.toUpperCase()}</p>
                            <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                ${invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                            `}>
                                {invoice.status}
                            </div>
                        </div>
                    </div>

                    {/* Client & Date Info */}
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Bill To</p>
                            <h3 className="font-bold text-gray-900">{invoice.clients?.name || 'Valued Client'}</h3>
                            {invoice.clients?.company && (
                                <p className="text-gray-600">{invoice.clients.company}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">{invoice.client_id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Date</p>
                                <p className="font-medium text-gray-900">{new Date(invoice.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Due Date</p>
                                <p className="font-medium text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Description</th>
                                    <th className="py-3 text-right text-xs uppercase tracking-wider text-gray-400 font-semibold">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="py-4 text-gray-700">
                                        <p className="font-medium">{invoice.description || 'Marketing Services'}</p>
                                        <p className="text-sm text-gray-500 mt-1">Professional services rendered for the period.</p>
                                    </td>
                                    <td className="py-4 text-right font-medium text-gray-900">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end border-t border-gray-100 pt-6">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax (0%)</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-xl text-gray-900">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.amount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-sm text-gray-400 border-t border-gray-100 pt-8">
                        <p>Thank you for your business!</p>
                        <p className="mt-1">Please include invoice number on your check.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
