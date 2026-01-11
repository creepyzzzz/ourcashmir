'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        question: "What happens after I pay?",
        answer: "You will get all the onboarding details and we start the project soon after."
    },
    {
        question: "How do we communicate?",
        answer: "We do all the communication in Google Chat. Our editors and managers are always ready to answer your questions."
    },
    {
        question: "Can I request custom edits? If yes, how?",
        answer: "Yes you can request custom edits, just put the request in Google Chat and our managers will take care of it!"
    },
    {
        question: "Do you only do short-form videos?",
        answer: "That's what we do the best but our video artists can get any job done. Book a call for custom requirements."
    },
    {
        question: "Is there a guarantee for my growth?",
        answer: "With our track record in mind we will beat your existing results by a huge margin."
    },
    {
        question: "If I cancel do I get a refund?",
        answer: "Once you are onboarded and the process is started you are not eligible for refunds for the existing month but we will pause your subscription when the month ends until you want to start again."
    }
];

const FAQItem = ({ question, answer, isOpen, toggle }: { question: string, answer: string, isOpen: boolean, toggle: () => void }) => {
    return (
        <div className="border-b border-brand-white/10 last:border-none">
            <button
                onClick={toggle}
                className="w-full py-4 sm:py-5 md:py-6 flex items-center justify-between gap-3 sm:gap-4 text-left group transition-colors"
            >
                <h3 className={`text-base sm:text-lg md:text-xl font-medium transition-colors ${isOpen ? 'text-brand-primary' : 'text-brand-white group-hover:text-brand-primary/80'}`}>
                    {question}
                </h3>
                <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-white/20 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-primary border-brand-primary rotate-90' : 'group-hover:border-brand-primary/50'}`}>
                    {isOpen ? (
                        <Minus size={14} className="sm:w-4 sm:h-4 text-black" />
                    ) : (
                        <Plus size={14} className="sm:w-4 sm:h-4 text-brand-white group-hover:text-brand-primary" />
                    )}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 sm:pb-5 md:pb-6 text-gray-400 leading-relaxed text-sm sm:text-base md:text-lg">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen w-full bg-black overflow-x-hidden selection:bg-brand-primary selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full px-4 md:px-12 lg:px-20 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 max-w-screen-2xl mx-auto">
                <div className="absolute top-20 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block bg-brand-primary/10 border border-brand-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-brand-primary mb-4 sm:mb-6">
                            <HelpCircle size={10} className="sm:w-3 sm:h-3 inline mr-1.5 sm:mr-2" />
                            Here to Help
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Frequently Asked <br />
                            <span className="text-brand-primary">Questions</span>
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                            Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-brand-surface border border-brand-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-2xl backdrop-blur-sm"
                >
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            toggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </motion.div>
            </section>

            {/* CTA */}
            <section className="w-full px-4 md:px-12 lg:px-20 pb-16 sm:pb-20 md:pb-24 max-w-screen-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Still have questions?</h2>
                    <a
                        href="https://wa.me/917889676481"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-brand-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:bg-green-400 transition-colors"
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
