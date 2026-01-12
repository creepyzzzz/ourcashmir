import React from 'react';
import BlogLayoutClient from '@/components/blog-panel/BlogLayoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog Management | Starship',
    description: 'Internal Blog Management Panel',
    robots: {
        index: false,
        follow: false,
    },
};

export default function BlogPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BlogLayoutClient>
            {children}
        </BlogLayoutClient>
    );
}
