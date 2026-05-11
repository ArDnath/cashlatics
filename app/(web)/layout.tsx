import { Sidebar } from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row">
      <Sidebar />

      {/*
        On mobile, we use pt-16 or similar to account for the floating menu button.
        On desktop (lg:), we apply ml-56 to make room for the fixed sidebar.
      */}
      <div className="flex-1 lg:ml-56 transition-all duration-300">
        <main className="min-h-screen bg-stone-50 p-4 lg:p-8">
          {/* Added a spacer for mobile so the content doesn't sit under the menu trigger */}
          <div className="h-14 lg:hidden" />

          {children}
        </main>
      </div>
    </div>
  );
}
