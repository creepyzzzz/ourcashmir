import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/blog-panel/', '/dashboard/'],
        },
        sitemap: 'https://www.ourcashmir.com/sitemap.xml',
    }
}
