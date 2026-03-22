import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiger Dust v2',
  description: 'Tiger Dust public site + internal operations foundation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
