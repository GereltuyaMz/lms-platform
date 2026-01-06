"use client";

import { useEffect, type ReactNode } from "react";
import { useBreadcrumb } from "@/components/admin/layout/BreadcrumbContext";

type CategoryEditWrapperProps = {
  categoryName: string | null;
  children: ReactNode;
};

export const CategoryEditWrapper = ({ categoryName, children }: CategoryEditWrapperProps) => {
  const { setEntityLabel } = useBreadcrumb();

  useEffect(() => {
    if (categoryName) {
      setEntityLabel(categoryName);
    }
    return () => setEntityLabel(null);
  }, [categoryName, setEntityLabel]);

  return <>{children}</>;
};
