import type { Metadata, Viewport } from 'next';
import { Sidebar } from '@/components/common/sidebar';
import { Header } from '@/components/common/header';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Life Dashboard',
  description: 'Track your daily goals, habits, and progress',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <Sidebar />
        <div className="md:ml-64">
          <Header />
          <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
