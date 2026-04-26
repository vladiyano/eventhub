import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Discover events. Reserve a seat.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a href="/" className="brand">EventHub</a>
          <nav>
            <a href="/">Events</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
