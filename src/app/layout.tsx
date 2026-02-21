import type { Metadata } from 'next';
import { Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Irie Wireless — The Control Plane for Global Wireless Infrastructure',
  description:
    'Irie Wireless orchestrates carrier, wholesale, and billing systems through a unified API layer — powering scalable multi-brand telecom operations worldwide.',
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
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="font-display antialiased">{children}</body>
    </html>
  );
}
