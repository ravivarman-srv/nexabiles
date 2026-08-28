'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, Menu, Settings as SettingsIcon, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'WhatsApp',
  '/contacts': 'Contacts',
  '/pipelines': 'Pipelines',
  '/broadcasts': 'Broadcasts',
  '/automations': 'Automations',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.entries(pageTitles).find(([path]) =>
    pathname.startsWith(path)
  );
  return match ? match[1] : 'Dashboard';
}

interface HeaderProps {
  /** Wired to the shell's drawer state. Used only on mobile — the
   *  hamburger button is hidden on lg+. */
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const title = getPageTitle(pathname);

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ??
    profile?.email?.charAt(0)?.toUpperCase() ??
    'U';

  return (
    <header className="border-border bg-background flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — mobile only. 44×44 hit target per Apple HIG. */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-10 w-10 items-center justify-center rounded-md transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-foreground truncate text-lg font-semibold">
          {title}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="hover:bg-accent focus:bg-accent data-[state=open]:bg-accent flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors focus:outline-none sm:gap-3 sm:pr-3 sm:pl-1.5"
          aria-label="Open account menu"
        >
          <Avatar className="border-border size-8 border">
            {profile?.avatar_url ? (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name ?? 'Avatar'}
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground hidden text-sm font-medium sm:inline">
            {profile?.full_name ?? 'User'}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-56">
          <div className="px-3 py-2">
            <p className="text-foreground truncate text-sm font-medium">
              {profile?.full_name ?? 'User'}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {profile?.email ?? ''}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href="/settings?tab=profile" className="w-full" />}
          >
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/settings?tab=whatsapp" className="w-full" />}
          >
            <SettingsIcon className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="text-destructive mr-2 size-4" />
            <span className="text-destructive">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
