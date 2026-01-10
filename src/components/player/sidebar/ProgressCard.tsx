"use client";

type ProgressCardProps = {
  courseTitle: string;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    streak?: number;
    totalXp: number;
  };
};

const statusConfig = {
  "not-started": { label: "Эхлээгүй", className: "bg-[#6750a4]" },
  "in-progress": { label: "In progress", className: "bg-[#6750a4]" },
  completed: { label: "Дууссан", className: "bg-[#6750a4]" },
} as const;

type ProgressStatus = keyof typeof statusConfig;

export const ProgressCard = ({ courseTitle, progress }: ProgressCardProps) => {
  const status: ProgressStatus =
    progress.percentage === 0
      ? "not-started"
      : progress.percentage === 100
        ? "completed"
        : "in-progress";

  return (
    <div className="bg-[#f8f2fa] border border-[#cac4d0] rounded-[20px] p-5 overflow-hidden">
      <div className="flex flex-col gap-3">
        {/* Status Badge */}
        <div className="inline-flex">
          <span
            className={`${statusConfig[status].className} text-white text-xs font-normal px-2 py-1 rounded-full`}
          >
            {statusConfig[status].label}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-base font-normal text-[#1a1a1a]">{courseTitle}</h3>

        {/* Divider */}
        <div className="h-px bg-[#cac4d0] w-full" />
      </div>

      {/* Progress Section */}
      <div className="flex flex-col gap-3.5 mt-5">
        {/* Progress Bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-sm text-[#737373]">
            <span>Хичээлийн явц</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full">
            <div className="bg-[#e2e0f9] h-[9px] rounded overflow-hidden">
              <div
                className="bg-[#675496] h-full rounded transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak and XP */}
        <div className="flex items-center justify-between text-sm text-[#737373]">
          <span>{progress.streak || 0} өдөр стрик</span>
          <span>{progress.totalXp}XP</span>
        </div>
      </div>
    </div>
  );
};
