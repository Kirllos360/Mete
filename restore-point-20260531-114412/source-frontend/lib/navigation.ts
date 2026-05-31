import type { NavItem, RolePermissions, UserRole } from '@/lib/types';

// ============================================
// Navigation Configuration
// ============================================

/**
 * Complete navigation tree for the sidebar.
 * Each item uses a Lucide icon name as a string.
 */
export const allNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: 'Building2',
  },
  {
    title: 'Locations',
    href: '/locations',
    icon: 'MapPin',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: 'Users',
  },
  {
    title: 'Meters',
    href: '/meters',
    icon: 'Gauge',
    children: [
      { title: 'All Meters', href: '/meters', icon: 'List' },
      { title: 'Assign Meter', href: '/meters/assign', icon: 'Link' },
      { title: 'Replace Meter', href: '/meters/replace', icon: 'RefreshCw' },
      { title: 'Terminate Meter', href: '/meters/terminate', icon: 'XCircle' },
    ],
  },
  {
    title: 'SIM Cards',
    href: '/sim-cards',
    icon: 'Wifi',
  },
  {
    title: 'Readings',
    href: '/readings',
    icon: 'FileText',
    children: [
      { title: 'All Readings', href: '/readings', icon: 'List' },
      { title: 'New Reading', href: '/readings/new', icon: 'PlusCircle' },
    ],
  },
  {
    title: 'Consumption',
    href: '/consumption',
    icon: 'Activity',
  },
  {
    title: 'Water Balance',
    href: '/water-balance',
    icon: 'Droplets',
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: 'Receipt',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: 'Banknote',
  },
  {
    title: 'Balances',
    href: '/balances',
    icon: 'Scale',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: 'Bell',
  },
  {
    title: 'Tickets',
    href: '/tickets',
    icon: 'MessageSquare',
  },
  {
    title: 'Support',
    href: '/support',
    icon: 'Headphones',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];

// ============================================
// Role Permissions
// ============================================

/**
 * Maps each role to its allowed navigation hrefs.
 * Wildcards like "meters/*" grant access to the parent
 * path and every child path under it.
 */
export const rolePermissions: RolePermissions = {
  super_admin: [
    'dashboard',
    'projects',
    'locations',
    'customers',
    'meters/*',
    'sim-cards',
    'readings/*',
    'consumption',
    'water-balance',
    'invoices/*',
    'payments',
    'balances',
    'reports',
    'alerts',
    'tickets',
    'support',
    'settings',
  ],
  project_admin: [
    'dashboard',
    'projects',
    'locations',
    'customers',
    'meters/*',
    'sim-cards',
    'readings/*',
    'consumption',
    'water-balance',
    'invoices/*',
    'payments',
    'balances',
    'reports',
    'alerts',
    'tickets',
    'support',
    'settings',
  ],
  operator: [
    'dashboard',
    'customers',
    'meters/*',
    'readings/*',
    'sim-cards',
    'locations',
  ],
  technician: [
    'dashboard',
    'meters/*',
    'sim-cards',
    'readings/*',
    'tickets',
    'alerts',
  ],
  finance: [
    'dashboard',
    'invoices/*',
    'payments',
    'balances',
    'reports',
  ],
  support: [
    'dashboard',
    'customers',
    'readings/*',
    'invoices/*',
    'payments',
    'tickets',
    'alerts',
    'support',
  ],
  customer: [
    'dashboard',
    'consumption',
    'water-balance',
    'invoices/*',
    'payments',
    'balances',
    'support',
  ],
};

// ============================================
// Permission Helpers
// ============================================

/**
 * Resolves a permission pattern against an href.
 * - "meters/*" matches "meters", "meters/assign", "meters/replace", etc.
 * - "dashboard" matches "dashboard" exactly.
 */
function permissionMatches(perm: string, normalizedHref: string): boolean {
  if (perm.endsWith('/*')) {
    const prefix = perm.slice(0, -2);
    return normalizedHref === prefix || normalizedHref.startsWith(prefix + '/');
  }
  return normalizedHref === perm;
}

function hrefMatchesRole(role: UserRole, href: string): boolean {
  const permissions = rolePermissions[role] ?? [];
  const normalizedHref = href.replace(/^\//, '');
  return permissions.some((perm) => permissionMatches(perm, normalizedHref));
}

// ============================================
// Navigation Filtering
// ============================================

/**
 * Returns the navigation tree filtered to only show items
 * that the given role is permitted to access.
 * Parent items with children are shown as long as at least
 * one child is permitted.
 */
export function getNavItemsForRole(role: UserRole): NavItem[] {
  return allNavItems
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          hrefMatchesRole(role, child.href),
        );
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter((item) => {
      if (item.children) {
        return item.children.length > 0;
      }
      return hrefMatchesRole(role, item.href);
    });
}

// ============================================
// Page Title / Breadcrumb
// ============================================

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your system' },
  '/projects': { title: 'Projects', subtitle: 'Manage your projects' },
  '/locations': { title: 'Locations', subtitle: 'Manage locations and buildings' },
  '/customers': { title: 'Customers', subtitle: 'Manage customer accounts' },
  '/meters': { title: 'Meters', subtitle: 'Manage water and electricity meters' },
  '/meters/assign': { title: 'Assign Meter', subtitle: 'Assign a meter to a unit' },
  '/meters/replace': { title: 'Replace Meter', subtitle: 'Replace an existing meter' },
  '/meters/terminate': { title: 'Terminate Meter', subtitle: 'Terminate a meter connection' },
  '/sim-cards': { title: 'SIM Cards', subtitle: 'Manage SIM cards for meters' },
  '/readings': { title: 'Readings', subtitle: 'View and manage meter readings' },
  '/readings/new': { title: 'New Reading', subtitle: 'Submit a new meter reading' },
  '/consumption': { title: 'Consumption', subtitle: 'Monitor consumption trends' },
  '/water-balance': { title: 'Water Balance', subtitle: 'Track water balance and losses' },
  '/invoices': { title: 'Invoices', subtitle: 'Manage billing invoices' },
  '/payments': { title: 'Payments', subtitle: 'Track and manage payments' },
  '/balances': { title: 'Balances', subtitle: 'View customer balances and aging' },
  '/reports': { title: 'Reports', subtitle: 'Generate and view reports' },
  '/alerts': { title: 'Alerts', subtitle: 'Monitor system alerts' },
  '/tickets': { title: 'Tickets', subtitle: 'Manage support tickets' },
  '/support': { title: 'Support', subtitle: 'Customer support center' },
  '/settings': { title: 'Settings', subtitle: 'System configuration' },
};

/**
 * Returns the title and subtitle for a given route path,
 * used for page headings and breadcrumbs.
 */
export function getPageTitle(
  path: string,
): { title: string; subtitle: string } {
  return pageTitles[path] ?? { title: 'Page', subtitle: '' };
}
