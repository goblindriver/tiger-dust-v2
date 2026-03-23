import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiger Dust — Seminole Heights, Tampa',
  description:
    'Tiger Dust is a curiosity shop in Seminole Heights, Tampa. Curated objects, handmade jewelry, restored lamps, taxidermy, crystals, fossils, occult books, and things worth keeping. Open daily 12–7pm.',
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
