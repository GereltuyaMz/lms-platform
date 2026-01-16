"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  FolderTree,
  ClipboardCheck,
  FileCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { signOutAdmin } from "@/lib/actions/admin/auth";
import { useRouter } from "next/navigation";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (url: string) => {
    if (url === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  const isCoursesExpanded =
    pathname.startsWith("/admin/courses") ||
    pathname.startsWith("/admin/units") ||
    pathname.startsWith("/admin/lessons");

  const handleSignOut = async () => {
    await signOutAdmin();
    router.push("/");
  };

  return (
    <Sidebar
      collapsible="none"
      className="w-64 min-w-64 max-w-64 border-r border-gray-200 bg-white"
    >
      <SidebarHeader className="border-b border-gray-100 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
            E
          </div>
          <span className="font-semibold text-gray-900">ExpontMind</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-y-scroll overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
            Агуулга
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin") && pathname === "/admin"}
                  tooltip="Хянах самбар"
                  className="cursor-pointer"
                >
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Хянах самбар</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Categories */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/categories")}
                  tooltip="Ангилал"
                  className="cursor-pointer"
                >
                  <Link href="/admin/categories">
                    <FolderTree className="h-4 w-4" />
                    <span>Ангилал</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Courses with nested Units and Lessons */}
              <Collapsible
                defaultOpen={isCoursesExpanded}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isActive("/admin/courses")}
                      tooltip="Хичээлүүд"
                      className="cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Хичээлүүд</span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/admin/courses")}
                        >
                          <Link href="/admin/courses">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Бүх хичээл</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/admin/units")}
                        >
                          <Link href="/admin/units">
                            <Layers className="h-3.5 w-3.5" />
                            <span>Бүлгүүд</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/admin/lessons")}
                        >
                          <Link href="/admin/lessons">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Сэдвүүд</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Tests */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/quizzes")}
                  tooltip="Тест"
                  className="cursor-pointer"
                >
                  <Link href="/admin/quizzes">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Тест</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Mock Tests */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/mock-tests")}
                  tooltip="Элсэлтийн шалгалт"
                  className="cursor-pointer"
                >
                  <Link href="/admin/mock-tests">
                    <FileCheck className="h-4 w-4" />
                    <span>Элсэлтийн шалгалт</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Гарах"
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Гарах</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
