import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileNav />
        <main className="@container p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}