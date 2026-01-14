"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import {
  UserIcon,
  VideoIcon,
  TrophyIcon,
  BookBookmarkIcon,
  StorefrontIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { AchievementsSidebar } from "./AchievementsSidebar";
import { ProfileCompletionBanner } from "./ProfileCompletionBanner";
import type { BadgeWithProgress } from "@/lib/actions/badges";

// Context for tab navigation
type DashboardNavContextType = {
  navigateToSettings: () => void;
};

const DashboardNavContext = createContext<DashboardNavContextType | null>(null);

export const useDashboardNav = () => {
  const context = useContext(DashboardNavContext);
  if (!context) {
    throw new Error("useDashboardNav must be used within DashboardTabs");
  }
  return context;
};

export type TabId =
  | "courses"
  | "achievements"
  | "test-results"
  | "profile"
  | "shop"
  | "settings";

type Tab = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

type DashboardTabsProps = {
  // Initial tab from server (prevents hydration flash)
  initialTab: TabId;
  // Main content for each tab
  profileOverviewContent: React.ReactNode;
  coursesContent: React.ReactNode;
  achievementsContent: React.ReactNode;
  testResultsContent: React.ReactNode;
  shopContent: React.ReactNode;
  settingsContent: React.ReactNode;
  // Data for right sidebar
  achievements: BadgeWithProgress[];
  isProfileComplete: boolean;
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
  {
    id: "settings",
    label: "Тохиргоо",
    icon: <GearIcon size={20} />,
  },
];

export const DashboardTabs = ({
  initialTab,
  profileOverviewContent,
  coursesContent,
  achievementsContent,
  testResultsContent,
  shopContent,
  settingsContent,
  achievements,
  isProfileComplete,
}: DashboardTabsProps) => {
  const searchParams = useSearchParams();

  // Use server-provided initialTab to prevent hydration flash
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Sync with URL changes (for client-side navigation like back/forward)
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabId | null;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    // Update URL without triggering Next.js navigation (prevents flash)
    window.history.pushState(null, "", `/dashboard?tab=${tabId}`);
  };

  const navigateToSettings = () => handleTabChange("settings");

  const contentMap: Record<TabId, React.ReactNode> = {
    profile: profileOverviewContent,
    courses: coursesContent,
    achievements: achievementsContent,
    "test-results": testResultsContent,
    shop: shopContent,
    settings: settingsContent,
  };

  // Show right sidebar on profile and courses tabs only
  const showRightSidebar = activeTab === "profile" || activeTab === "courses";

  // Wider content for test-results tab
  const mainContentMaxWidth =
    activeTab === "test-results" ? "lg:max-w-[802px]" : "lg:max-w-[518px]";

  return (
    <DashboardNavContext.Provider value={{ navigateToSettings }}>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-14">
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
          <main className={`flex-1 min-w-0 ${mainContentMaxWidth}`}>
            {contentMap[activeTab]}
          </main>

          {/* Right Sidebar - Profile Completion + Achievements (only on profile and courses tabs) */}
          {showRightSidebar && (
            <aside className="hidden lg:block lg:w-80 flex-shrink-0 space-y-6">
              {/* Profile Completion Banner */}
              <ProfileCompletionBanner
                isProfileComplete={isProfileComplete}
                onNavigateToSettings={navigateToSettings}
              />

              {/* Achievements Sidebar */}
              <AchievementsSidebar
                achievements={achievements}
                onViewAll={() => handleTabChange("achievements")}
              />
            </aside>
          )}
        </div>
      </div>
    </DashboardNavContext.Provider>
  );
};
