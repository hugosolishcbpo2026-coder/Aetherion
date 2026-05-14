export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" aria-hidden />
      <div className="absolute inset-0 noise" aria-hidden />
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
