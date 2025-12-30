"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BoardIcon } from "@/icons";
import { Trophy, User, ShoppingBag, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "courses" | "achievements" | "test-results" | "profile" | "shop";

type Tab = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

type DashboardTabsProps = {
  coursesContent: React.ReactNode;
  achievementsContent: React.ReactNode;
  testResultsContent: React.ReactNode;
  profileContent: React.ReactNode;
  shopContent: React.ReactNode;
};

const tabs: Tab[] = [
  {
    id: "courses",
    label: "Миний хичээлүүд",
    icon: <BoardIcon width={24} height={24} />,
  },
  {
    id: "achievements",
    label: "Амжилтууд",
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: "test-results",
    label: "Тестийн үр дүн",
    icon: <FileBarChart className="w-6 h-6" />,
  },
  {
    id: "profile",
    label: "Профайл",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: "shop",
    label: "Дэлгүүр",
    icon: <ShoppingBag className="w-6 h-6" />,
  },
];

export const DashboardTabs = ({
  coursesContent,
  achievementsContent,
  testResultsContent,
  profileContent,
  shopContent,
}: DashboardTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tab from URL or default to "courses"
  const tabFromUrl = searchParams.get("tab") as TabId | null;
  const initialTab =
    tabFromUrl &&
    ["courses", "achievements", "test-results", "profile", "shop"].includes(
      tabFromUrl
    )
      ? tabFromUrl
      : "courses";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Sync with URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabId | null;
    if (
      urlTab &&
      ["courses", "achievements", "test-results", "profile", "shop"].includes(
        urlTab
      )
    ) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    // Update URL without page reload
    router.push(`/dashboard?tab=${tabId}`, { scroll: false });
  };

  const contentMap: Record<TabId, React.ReactNode> = {
    courses: coursesContent,
    achievements: achievementsContent,
    "test-results": testResultsContent,
    profile: profileContent,
    shop: shopContent,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg border p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-100 font-semibold"
                    : "hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    activeTab === tab.id ? "text-gray-900" : "text-gray-600"
                  )}
                >
                  {tab.icon}
                </span>
                <span
                  className={cn(
                    "text-lg",
                    activeTab === tab.id ? "text-gray-900" : "text-gray-700"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{contentMap[activeTab]}</main>
      </div>
    </div>
  );
};
