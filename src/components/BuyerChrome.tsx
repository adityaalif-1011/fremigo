'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

/* ==============================
     SHARED SVG ICON STYLING
   (simple line icons, Lucide/Heroicons style)
============================== */
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

export const BuyerIcons = {
  home: (
    <svg {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  ),
  catalog: (
    <svg {...iconProps}>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  receipt: (
    <svg {...iconProps}>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
      <path d="M9 7h6M9 11h6" />
    </svg>
  ),
  bell: (
    <svg {...iconProps}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2.5 2.5 0 0 0 4 0" />
    </svg>
  ),
  gift: (
    <svg {...iconProps}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v9h14v-9M12 8v13" />
      <path d="M12 8s-4-.5-4-2.8A1.9 1.9 0 0 1 12 3.8 1.9 1.9 0 0 1 16 5.2C16 7.5 12 8 12 8Z" />
    </svg>
  ),
  cart: (
    <svg {...iconProps}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2.5 11h10L20 7H6.5" />
    </svg>
  ),
  user: (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
  search: (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  scale: (
    <svg {...iconProps}>
      <path d="M12 5v14M8 19h8M4 8h16" />
      <path d="M7 8l-3 6a3 3 0 0 0 6 0L7 8ZM17 8l-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </svg>
  ),
  check: (
    <svg {...iconProps}>
      <path d="M4.5 12.5 9 17l10.5-10.5" />
    </svg>
  ),
  phone: (
    <svg {...iconProps}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
};


/* ==============================
     SIDEBAR
============================== */
type SidebarItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const buyerMenu: SidebarItem[] = [
  { href: '/', label: 'Beranda', icon: BuyerIcons.home },
  { href: '/katalog', label: 'Katalog', icon: BuyerIcons.catalog },
  { href: '/riwayat', label: 'Riwayat', icon: BuyerIcons.receipt },
  { href: '/notifications', label: 'Notifikasi', icon: BuyerIcons.bell },
  { href: '/reward', label: 'Poin Reward', icon: BuyerIcons.gift },
];

export function BuyerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {buyerMenu.map(item => {
        const active =
          item.href === '/'
            ? pathname === '/'
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
  );
}


/* ==============================
     TOPBAR
============================== */
type SearchConfig = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
};

export function BuyerTopbar({ search }: { search?: SearchConfig }) {
  const router = useRouter();

  const isControlled =
    search !== undefined && search.value !== undefined && search.onChange !== undefined;

  return (
    <header className="topbar">

      <Link className="logo" href="/">
        pre<span>migo</span>.id
      </Link>

      {search && (
        <div className="search">
          <span className="search-icon">
            {BuyerIcons.search}
          </span>

          {isControlled ? (
            <input
              placeholder={search.placeholder}
              value={search.value}
              onChange={(e) => search.onChange!(e.target.value)}
            />
          ) : (
            <input
              placeholder={search.placeholder}
              onClick={search.onClick}
            />
          )}
        </div>
      )}

      <div className="top-actions">

        <button
          className="icon-btn badge"
          data-badge="2"
          aria-label="Notifikasi"
          onClick={() => router.push('/notifications')}
        >
          {BuyerIcons.bell}
        </button>

        <button
          className="icon-btn"
          aria-label="Keranjang"
          onClick={() => router.push('/checkout')}
        >
          {BuyerIcons.cart}
        </button>

        <button
          className="icon-btn"
          aria-label="Akun"
          onClick={() => router.push('/account')}
        >
          {BuyerIcons.user}
        </button>

      </div>

    </header>
  );
}
