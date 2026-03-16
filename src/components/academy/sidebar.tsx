'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Bot,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Users,
  BarChart3,
  GraduationCap,
} from 'lucide-react';

const studentLinks = [
  { href: '/academy', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/academy/progress', label: 'Voortgang', icon: Trophy },
  { href: '/academy/ai-tutor', label: 'AI Tutor', icon: Bot },
  { href: '/academy/calendar', label: 'Agenda', icon: Calendar },
  { href: '/academy/resources', label: 'Bronnen', icon: FileText },
];

const instructorLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'Studenten', icon: Users },
  { href: '/dashboard/squads', label: 'Squads', icon: GraduationCap },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/content', label: 'Content', icon: BookOpen },
  { href: '/dashboard/schedule', label: 'Planning', icon: Calendar },
];

interface SidebarProps {
  variant: 'student' | 'instructor';
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const links = variant === 'student' ? studentLinks : instructorLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy-800 border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href={variant === 'student' ? '/academy' : '/dashboard'} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shrink-0">
            <span className="text-white font-bold">W</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">AI-First Academy</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Worldline</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/academy' && link.href !== '/dashboard' && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name ?? 'User'}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name ?? 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role ?? ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/academy/settings"
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
