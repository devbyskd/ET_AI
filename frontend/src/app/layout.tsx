import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import EmergencyModal from '@/components/EmergencyModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZeroHarm AI Dashboard',
  description: 'Enterprise Industrial Safety Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#020816] text-slate-300 antialiased overflow-hidden`}>
        
        {/* Global Emergency Modal overlay */}
        <EmergencyModal />

        <div className="flex h-screen w-full">
          {/* Left Sidebar (fixed width) */}
          <Sidebar />

          {/* Main Content Area (takes remaining width) */}
          <div className="flex-1 ml-64 flex flex-col h-screen">
            <TopNav />
            
            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
