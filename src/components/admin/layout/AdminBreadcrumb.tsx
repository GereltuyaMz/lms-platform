"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "./BreadcrumbContext";

const routeLabels: Record<string, string> = {
  admin: "Хянах самбар",
  categories: "Ангилал",
  courses: "Хичээлүүд",
  units: "Бүлэгүүд",
  lessons: "Хичээлүүд",
  quiz: "Шалгалт үүсгэгч",
  new: "Шинэ",
  edit: "Засах",
};

export const AdminBreadcrumb = () => {
  const pathname = usePathname();
  const { entityLabel } = useBreadcrumb();
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    // Check if this is a dynamic segment (UUID or 'new')
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

    let label = routeLabels[segment] || segment;

    // For UUIDs, use entityLabel from context if available
    if (isUuid) {
      label = entityLabel ? `Засах: ${entityLabel}` : "Засах";
    }

    return {
      href,
      label,
      isLast,
      isUuid,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin" className="flex items-center text-gray-500 hover:text-gray-700">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.slice(1).map((item) => (
          <React.Fragment key={item.href}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="text-gray-900 font-medium">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="text-gray-500 hover:text-gray-700">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
