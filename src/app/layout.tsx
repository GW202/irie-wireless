import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Irie Wireless — Provider-Agnostic Telecom Infrastructure for Rapid MVNO Deployment',
  description:
    'Irie Wireless is a BSS abstraction and orchestration layer that decouples digital telecom brands from legacy systems — enabling rapid MVNO deployment without vendor lock-in.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Irie Wireless — Telecom Integration Platform',
    description:
      'A provider-agnostic telecom infrastructure layer that abstracts BSS complexity, enabling brands to launch, scale, and switch providers without technical disruption.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-display antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}
