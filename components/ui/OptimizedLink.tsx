import Link from 'next/link';
import { ComponentProps } from 'react';

export const OptimizedLink = ({ className, ...props }: ComponentProps<typeof Link>) => (
    <Link className={className} {...props} />
);
