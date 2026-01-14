"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl border-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 font-[family-name:var(--font-nunito)]",

          title: "font-semibold text-base",

          description: "text-sm opacity-90",

          actionButton:
            "rounded-lg px-3 py-2 text-sm font-semibold bg-[#29cc57] text-white hover:bg-[#24b84e] transition-colors cursor-pointer",

          cancelButton:
            "rounded-lg px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer",

          closeButton:
            "rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors !border-0 cursor-pointer",

          success:
            "!bg-[#29cc57]/10 !border-[#29cc57] !text-foreground !border-l-4 dark:!bg-[#29cc57]/15",

          error:
            "!bg-[#ef4444]/10 !border-[#ef4444] !text-foreground !border-l-4 dark:!bg-[#ef4444]/15",

          warning:
            "!bg-[#f59e0b]/10 !border-[#f59e0b] !text-foreground !border-l-4 dark:!bg-[#f59e0b]/15",

          info:
            "!bg-[#3b82f6]/10 !border-[#3b82f6] !text-foreground !border-l-4 dark:!bg-[#3b82f6]/15",

          loading:
            "!bg-white !border-gray-300 !text-foreground dark:!bg-gray-800 dark:!border-gray-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
