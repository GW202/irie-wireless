import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Irie Wireless — The Control Plane for Global Wireless Infrastructure',
  description:
    'Irie Wireless orchestrates carrier, wholesale, and billing systems through a unified API layer — powering scalable multi-brand telecom operations worldwide.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Irie Wireless — Telecom Orchestration Platform',
    description:
      'The control plane for global wireless infrastructure. Orchestrate carrier APIs, enable multi-brand operations, and scale telecom without limits.',
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
      <body className="font-display antialiased">{children}</body>
    </html>
  );
}
