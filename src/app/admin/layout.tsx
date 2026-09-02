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
    <div className="min-h-screen bg-cream-100 text-charcoal-900 flex flex-col">
      {/* Top Admin Navigation */}
      <header className="border-b border-cream-300 bg-cream-50/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold text-charcoal-900 text-lg">
              <div className="p-1.5 bg-charcoal-900 rounded-lg">
                <Glasses className="w-5 h-5 text-cream-50" />
              </div>
              <span className="font-serif">Optik Intercontinental <span className="text-xs text-charcoal-900 font-sans font-normal border border-charcoal-900/30 px-2 py-0.5 rounded-full bg-stone-200/50">Admin</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500 hidden sm:inline-block">
              Logged in as: <strong className="text-stone-700">{user.email}</strong>
            </span>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-700 px-3 py-2 rounded-lg transition"
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