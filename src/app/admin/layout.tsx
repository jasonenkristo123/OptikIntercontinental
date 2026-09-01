import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/authActions';
import { LogOut, Store, Glasses } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold text-white text-lg">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Glasses className="w-5 h-5 text-white" />
              </div>
              <span>Optik Intercontinental <span className="text-xs text-blue-400 font-normal border border-blue-500/30 px-2 py-0.5 rounded-full bg-blue-500/10">Admin</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Logged in as: <strong className="text-slate-200">{user.email}</strong>
            </span>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </form>
          </div>

        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}