import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CreatorApplication: React.FC = () => {
    return (
        <section className="w-full px-4 border-t border-gray-900 bg-black">
            <div className="max-w-screen-2xl mx-auto py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">

                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Ready to take the next step?
                    </h2>
                    <p className="text-gray-400">
                        Join our exclusive network of managed creators.
                    </p>
                </div>

                <a
                    href="mailto:contact@ourcashmir.com?subject=Apply to become a managed creator"
                    className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-5 rounded-full font-bold text-lg tracking-wide hover:bg-brand-primary transition-colors duration-300"
                >
                    Apply to become a managed creator
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

            </div>
        </section>
    );
};

export default CreatorApplication;
