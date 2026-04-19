import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qurt or Dimash? | Image Classifier',
  description:
    'A Next.js landing page and image demo for a fastai classifier that predicts whether an uploaded image is Qurt or Dimash Kudaibergen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
