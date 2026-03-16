import { AuthProvider } from '@/lib/auth/context';
import { Sidebar } from '@/components/academy/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex">
        <Sidebar variant="instructor" />
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
