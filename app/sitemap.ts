import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.ourcashmir.com'

    // Static routes
    const routes = [
        '',
        '/blog',
        '/contact',
        '/faq',
        '/influencers',
        '/clients',
        '/portfolio',
        '/privacy',
        '/terms',
        '/refunds',
        '/shipping',
        '/login',
        '/auth/register', // Assuming register page exists under auth
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}
