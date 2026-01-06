import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar, AdminHeader } from "@/components/admin/layout";
import { getAdminUser } from "@/lib/actions/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) redirect("/");

  return (
    <SidebarProvider className="min-h-screen w-full">
      <AdminSidebar />
      <SidebarInset className="flex flex-col bg-gray-50">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
