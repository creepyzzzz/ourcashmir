import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CreatorApplication: React.FC = () => {
    return (
        <section className="w-full px-4 border-t border-gray-900 bg-black">
            <div className="max-w-screen-2xl mx-auto py-8 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                        Ready to take the next step?
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Join our exclusive network of managed creators.
                    </p>
                </div>

                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSf9sgwNp-Y-NcUGepaU3yEdaDZzMcgyF_5Z66Ajhtz7gfMrPQ/viewform?usp=send_form&pli=1&authuser=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 md:gap-3 bg-white text-black px-6 py-3 md:px-8 md:py-5 rounded-full font-bold text-sm md:text-lg tracking-wide hover:bg-brand-primary transition-colors duration-300 w-full md:w-auto justify-center"
                >
                    Apply to become a managed creator
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

            </div>
        </section>
    );
};

export default CreatorApplication;
