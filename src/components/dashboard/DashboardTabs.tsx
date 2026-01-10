"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  UserIcon,
  VideoIcon,
  TrophyIcon,
  BookBookmarkIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { AchievementsSidebar } from "./AchievementsSidebar";
import type { BadgeWithProgress } from "@/lib/actions/badges";

type TabId = "courses" | "achievements" | "test-results" | "profile" | "shop";

type Tab = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

type DashboardTabsProps = {
  // Main content for each tab
  profileOverviewContent: React.ReactNode;
  coursesContent: React.ReactNode;
  achievementsContent: React.ReactNode;
  testResultsContent: React.ReactNode;
  shopContent: React.ReactNode;
  // Data for right sidebar
  achievements: BadgeWithProgress[];
};

const tabs: Tab[] = [
  {
    id: "profile",
    label: "Профайл",
    icon: <UserIcon size={20} />,
  },
  {
    id: "courses",
    label: "Миний хичээлүүд",
    icon: <VideoIcon size={20} />,
  },
  {
    id: "achievements",
    label: "Амжилтууд",
    icon: <TrophyIcon size={20} />,
  },
  {
    id: "test-results",
    label: "Тестийн үр дүн",
    icon: <BookBookmarkIcon size={20} />,
  },
  {
    id: "shop",
    label: "Дэлгүүр",
    icon: <StorefrontIcon size={20} />,
  },
];

export const DashboardTabs = ({
  profileOverviewContent,
  coursesContent,
  achievementsContent,
  testResultsContent,
  shopContent,
  achievements,
}: DashboardTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tab from URL or default to "profile"
  const tabFromUrl = searchParams.get("tab") as TabId | null;
  const initialTab =
    tabFromUrl &&
    ["profile", "courses", "achievements", "test-results", "shop"].includes(
      tabFromUrl
    )
      ? tabFromUrl
      : "profile";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Sync with URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabId | null;
    if (
      urlTab &&
      ["profile", "courses", "achievements", "test-results", "shop"].includes(
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
    profile: profileOverviewContent,
    courses: coursesContent,
    achievements: achievementsContent,
    "test-results": testResultsContent,
    shop: shopContent,
  };

  // Show right sidebar on profile and courses tabs only
  const showRightSidebar = activeTab === "profile" || activeTab === "courses";

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row gap-14">
        {/* Left Sidebar - Navigation */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <nav className="bg-white rounded-2xl border p-5 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-[var(--dashboard-tab-active)]"
                    : "hover:bg-gray-50"
                )}
              >
                {/* Icon with background */}
                <span
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    "bg-[var(--dashboard-icon-bg)] border border-white"
                  )}
                >
                  <span
                    className={cn(
                      activeTab === tab.id
                        ? "text-[var(--dashboard-text-active)]"
                        : "text-gray-600"
                    )}
                  >
                    {tab.icon}
                  </span>
                </span>
                {/* Label */}
                <span
                  className={cn(
                    "text-base font-medium",
                    activeTab === tab.id
                      ? "text-[var(--dashboard-text-active)]"
                      : "text-gray-700"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:max-w-[518px]">{contentMap[activeTab]}</main>

        {/* Right Sidebar - Achievements (only on profile and courses tabs) */}
        {showRightSidebar && (
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <AchievementsSidebar
              achievements={achievements}
              onViewAll={() => handleTabChange("achievements")}
            />
          </aside>
        )}
      </div>
    </div>
  );
};
