'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react'; // Added Star icon
import React from 'react';

const testimonials = [
    {
        quote: "Working with this team has been an exceptional experience. Their ability to adapt quickly is impressive. The quality of their work has consistently exceeded our expectations. We highly recommend their services.",
        author: "Abdul Majid Wani",
        role: "Doctor, Entrepreneur",
        rating: 5,
        image: "/images/ourcashmir/People/DR UNCLE.JPG"
    },
    {
        quote: "I have worked with Sufiyan. He is soft spoken responsive and skilled at his age. I would recommend work with Our Cashmir.",
        author: "Irfan Nazir",
        role: "Social Activist, Author",
        rating: 5,
        image: "/images/ourcashmir/People/IRFAN NAZIR.PNG"
    },
    {
        quote: "Sufiyan and his team has been quite adaptive to our requirements. One thing I liked about them is they take feedback positively and work on them. Their quality of work is good, we would recommend that you to take their services.",
        author: "Uzair Hameed",
        role: "Entrepreneur",
        rating: 5,
        image: "/images/ourcashmir/People/UZAIR HAMEED.jpg"
    }
];

// Updated to be a proper "Box" with background, border, and Stars
const TestimonialCard = ({ quote, author, role, rating, image }: { quote: string, author: string, role: string, rating: number, image?: string }) => (
    <div className="w-[280px] sm:w-[320px] md:w-[450px] shrink-0 px-3 md:px-4">
        <div className="h-full bg-brand-surface/50 border border-brand-white/10 p-5 md:p-8 rounded-2xl backdrop-blur-sm hover:border-brand-white/20 hover:bg-brand-surface/80 transition-all duration-300">
            {/* Stars Section */}
            <div className="flex gap-1 mb-4 md:mb-6">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-primary text-brand-primary" />
                ))}
            </div>

            {/* Quote Content - Kept the essence of the snippet but adapted to Box */}
            <blockquote className="mb-4 md:mb-6">
                <p className="text-brand-white/90 text-sm md:text-base leading-relaxed">"{quote}"</p>
            </blockquote>

            {/* Author Footer */}
            <footer className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                    {image ? (
                        <img src={image} alt={author} className="w-full h-full object-cover" />
                    ) : (
                        author.charAt(0)
                    )}
                </div>
                <div>
                    <cite className="text-brand-white not-italic font-semibold block">{author}</cite>
                    <span className="text-brand-muted text-sm">{role}</span>
                </div>
            </footer>
        </div>
    </div>
);

export default function TestimonialSection() {
    // Duplicate for seamless looping
    const activeTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="bg-brand-dark py-12 md:py-20 overflow-hidden border-t border-brand-white/5 relative">
            {/* Optional: Side gradients to fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />

            <div className="mx-auto w-full max-w-full">
                <motion.div
                    className="flex w-max"
                    initial={{ x: "-50%" }}
                    animate={{ x: "0%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 80, // Slightly slower for boxes to be readable
                    }}
                >
                    {activeTestimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
