"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type BreadcrumbContextType = {
  entityLabel: string | null;
  setEntityLabel: (label: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [entityLabel, setEntityLabel] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ entityLabel, setEntityLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
};
