import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SessionProvider } from "@/components/session-provider";
import { getStaff } from "@/lib/data";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const staff = user.role === "admin" ? await getStaff() : [];

  return (
    <SessionProvider user={user} staff={staff}>
      <div className="min-h-screen bg-background md:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileNav />
          <main className="@container p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
