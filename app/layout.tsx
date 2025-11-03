import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viral Shorts Generator',
  description: 'Analyze any YouTube video to auto-generate viral shorts with SEO-optimized titles, descriptions and tags.',
  icons: {
    icon: [{ url: '/favicon.ico' }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
