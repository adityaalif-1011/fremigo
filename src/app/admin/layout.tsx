'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import PageTransition from '@/components/PageTransition';

type AdminMenuItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const menu: AdminMenuItem[] = [
  {
    href: '/admin',
    label: 'Overview',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/admin/produk',
    label: 'Produk',
    icon: (
      <svg {...iconProps}>
        <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
        <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    href: '/admin/laporan',
    label: 'Laporan',
    icon: (
      <svg {...iconProps}>
        <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" />
      </svg>
    ),
  },
  {
    href: '/admin/pengguna',
    label: 'Pengguna',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="app">

      {/* ==============================
           ADMIN TOPBAR
      =============================== */}
      <header className="topbar">

        <Link className="logo" href="/admin">
          pre<span>migo</span>.id
        </Link>

        <span
          style={{
            fontWeight: 800,
            fontSize: 14,
            color: 'var(--muted)',
            padding: '6px 12px',
            borderRadius: 999,
            background: 'var(--green-soft)',
          }}
        >
          Admin Panel
        </span>

        <div style={{ flex: 1 }} />

        <button
          className="btn btn-outline"
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>

      </header>


      {/* ==============================
           ADMIN LAYOUT
      =============================== */}
      <div className="layout">


        {/* ==============================
             SIDEBAR
        =============================== */}
        <aside className="sidebar">

          {menu.map(item => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={active ? 'side-link active' : 'side-link'}
                href={item.href}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

        </aside>


        {/* ==============================
             MAIN CONTENT
        =============================== */}
        <main className="main">
          <div className="container">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

      </div>

    </div>
  );
}
