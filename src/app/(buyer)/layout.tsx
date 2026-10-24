'use client';

import { BuyerSidebar, BuyerTopbar } from '@/components/BuyerChrome';
import PageTransition from '@/components/PageTransition';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      {/* ==============================
           BUYER TOPBAR
      =============================== */}
      <BuyerTopbar />


      {/* ==============================
           LAYOUT: SIDEBAR + MAIN
      =============================== */}
      <div className="layout">

        <BuyerSidebar />

        <main className="main">
          <div className="container">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

      </div>

    </>
  );
}
