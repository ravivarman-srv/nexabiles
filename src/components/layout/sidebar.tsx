'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useTotalUnread } from '@/hooks/use-total-unread';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  GitBranch,
  Radio,
  Zap,
  Settings,
  LogOut,
  User,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inbox', label: 'WhatsApp', icon: MessageSquare },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/pipelines', label: 'Pipelines', icon: GitBranch },
  { href: '/broadcasts', label: 'Broadcasts', icon: Radio },
  { href: '/automations', label: 'Automations', icon: Zap },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/support', label: 'Support', icon: HelpCircle },
];

interface SidebarProps {
  /** Controlled on mobile by the Header's hamburger button. Ignored on lg+. */
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const totalUnread = useTotalUnread();

  // Close the drawer when route changes — users opened it to navigate,
  // so once they pick a destination the drawer should get out of the way.
  useEffect(() => {
    onClose?.();
    // Only pathname drives this — onClose identity doesn't need to re-run it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll and allow Escape to close while the drawer is open on
  // mobile. No-ops on desktop because the sidebar isn't positioned there.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop — only exists on mobile and only when open. Clicking
          it closes the drawer. Hidden from lg+ since the sidebar is
          part of the main flex row there. */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          'bg-background fixed inset-0 z-30 backdrop-blur-sm transition-opacity lg:hidden',
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          // Mobile: fixed drawer that slides in from the left.
          'border-border bg-sidebar fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r',
          'transition-all duration-300 ease-in-out will-change-transform',
          open ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static, always visible — reset all the mobile framing.
          'lg:static lg:z-0 lg:translate-x-0',
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        )}
        aria-label="Primary"
      >
        {/* Logo row. On mobile we put a close button here; on desktop the
            close button is hidden since the sidebar is always-visible. */}
        <div className="border-sidebar-border flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-2 overflow-hidden',
              isCollapsed ? 'lg:hidden' : ''
            )}
          >
            <span className="text-foreground truncate text-xl font-bold tracking-tight uppercase">
              NEXA
              <span className="to-primary bg-gradient-to-r from-blue-500 bg-clip-text text-transparent">
                BILIS
              </span>
            </span>
          </Link>

          {/* Logo replacement when collapsed on desktop */}
          <Link
            href="/dashboard"
            className={cn(
              'text-foreground hidden items-center justify-center overflow-hidden text-xl font-bold',
              isCollapsed ? 'w-full lg:flex' : 'hidden'
            )}
          >
            N
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-sidebar-foreground hover:bg-sidebar-accent flex h-9 w-9 items-center justify-center rounded-md lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              const showUnreadDot =
                item.href === '/inbox' && totalUnread > 0 && !isActive;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      // Taller on mobile so fingers can hit the row reliably (≥44px).
                      'flex items-center gap-3 overflow-hidden rounded-md px-3 py-2.5 text-sm font-medium transition-all lg:py-2.5',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      isCollapsed ? 'lg:justify-center lg:px-0' : ''
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isCollapsed ? 'lg:h-5 lg:w-5' : ''
                      )}
                    />
                    <span
                      className={cn(
                        'flex-1 truncate',
                        isCollapsed ? 'lg:hidden' : ''
                      )}
                    >
                      {item.label}
                    </span>
                    {showUnreadDot && (
                      <span
                        aria-label={`${totalUnread} unread conversation${totalUnread === 1 ? '' : 's'}`}
                        className={cn(
                          'relative flex h-2 w-2',
                          isCollapsed ? 'lg:absolute lg:top-2 lg:right-2' : ''
                        )}
                      >
                        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                        <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-sidebar-border my-6 border-t" />

          <ul className="flex flex-col gap-1.5">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 overflow-hidden rounded-md px-3 py-2.5 text-sm font-medium transition-all lg:py-2.5',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      isCollapsed ? 'lg:justify-center lg:px-0' : ''
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isCollapsed ? 'lg:h-5 lg:w-5' : ''
                      )}
                    />
                    <span
                      className={cn('truncate', isCollapsed ? 'lg:hidden' : '')}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-sidebar-border relative shrink-0 border-t p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent absolute top-[-14px] -right-3 hidden h-7 w-7 items-center justify-center rounded-full border shadow-sm lg:flex'
            )}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                'hover:bg-sidebar-accent focus:bg-sidebar-accent data-[state=open]:bg-sidebar-accent flex w-full items-center gap-3 rounded-md py-2.5 text-left transition-colors focus:outline-none',
                isCollapsed ? 'px-0 lg:justify-center' : 'px-3'
              )}
            >
              <Avatar className="border-sidebar-border size-8 shrink-0 border">
                {profile?.avatar_url ? (
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={profile.full_name ?? 'Avatar'}
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() ??
                    profile?.email?.charAt(0)?.toUpperCase() ??
                    'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'min-w-0 flex-1 overflow-hidden',
                  isCollapsed ? 'lg:hidden' : ''
                )}
              >
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  {profile?.full_name ?? 'User'}
                </p>
                <p className="text-sidebar-foreground/60 truncate text-xs">
                  {profile?.email ?? ''}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-56"
            >
              <DropdownMenuItem
                render={
                  <Link
                    href="/settings?tab=profile"
                    onClick={onClose}
                    className="w-full"
                  />
                }
              >
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <Link
                    href="/settings?tab=whatsapp"
                    onClick={onClose}
                    className="w-full"
                  />
                }
              >
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="text-destructive mr-2 size-4" />
                <span className="text-destructive">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
