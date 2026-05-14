import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="relative flex-1 overflow-hidden">
          <div className="aurora opacity-30" aria-hidden />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
