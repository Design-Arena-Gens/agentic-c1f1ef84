import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Agentic YouTube Autopilot',
  description: 'Automate YouTube uploads with scheduling and metadata generation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>{process.env.NEXT_PUBLIC_APP_NAME || 'Agentic YouTube Autopilot'}</h1>
          </header>
          <main>{children}</main>
          <footer className="footer">Built for autonomous YouTube upload workflows</footer>
        </div>
      </body>
    </html>
  );
}
