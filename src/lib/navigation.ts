export const publicNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
  { href: '/gallery', label: 'Gallery' },
] as const;

export const internalNav = [
  { href: '/app', label: 'Ops Dashboard' },
  { href: '/app/objects', label: 'Objects' },
  { href: '/app/inventory', label: 'Merch / Inventory' },
  { href: '/app/settings', label: 'Reference Data' },
  { href: '/app/auth', label: 'Auth Placeholder' },
] as const;
