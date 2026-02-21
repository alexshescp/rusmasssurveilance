import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'

// bring the line data into the layout so that SEO snippets can reflect
// actual counts and descriptions; `linesData` is defined in lib/lines.ts
import { linesData } from '@/lib/lines'

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const _jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" });

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

// base URL used by the metadata API; override with NEXT_PUBLIC_BASE_URL
export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'
);

// compute a few summary values for metadata/JSON‑LD
const lineCount = linesData.length;
const stationCount = linesData.reduce((s, l) => s + l.stations.length, 0);
// precompute strings to avoid confusing the parser inside JSX
const aboutName = `${lineCount} линий, ${stationCount} станций`;
const aboutDescription = `Является картографическим представлением ${lineCount} направлений и более ${stationCount} объектов.`;

export const metadata: Metadata = {
  title: 'Карта инфраструктуры системы мониторинга и контроля РФ',
  description: 'Интерактивная визуализация инфраструктуры государственных систем мониторинга, контроля и обмена данными в формате карты метро.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Карта Инфраструктуры',
    title: 'Карта Инфраструктуры | Системы мониторинга и контроля',
    description:
      'Интерактивная визуализация инфраструктуры государственных систем мониторинга, контроля и обмена данными в формате карты метро.',
    // image can be replaced with a real og image; fallback to placeholder
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Интерактивная карта инфраструктуры массовой слежки и контроля в России.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Карта Инфраструктуры',
    description:
      'Интерактивная визуализация инфраструктуры государственных систем мониторинга, контроля и обмена данными в формате карты метро.',
    images: ['/placeholder-logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    // Apple touch icons with explicit sizes
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
}

// ensure the entire app is rendered statically
export const dynamic = 'force-static';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Favicons and touch icons provided by the user */}
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        {/* structured data for search engines */}
        {/* use Next.js Script with afterInteractive to avoid SSR/client mismatch in dev */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: metadataBase.href,
              name: metadata.title,
              description: metadata.description,
              // include some of the site-specific numbers
              potentialAction: {
                "@type": "SearchAction",
                target: `${metadataBase.href}?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              about: {
                "@type": "Thing",
                name: aboutName,
                description: aboutDescription,
              },
            }),
          }}
        />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${_inter.variable} ${_jetbrains.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
