"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

type MockTestTimerProps = {
  endTime: string;
  onTimeExpired: () => void;
};

export const MockTestTimer = ({
  endTime,
  onTimeExpired,
}: MockTestTimerProps) => {
  const calculateRemaining = (): number => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diffMs = end - now;
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateRemaining());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeExpiredRef = useRef(onTimeExpired);

  // Keep the callback ref updated without restarting the timer
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  useEffect(() => {
    // Update timer every second
    intervalRef.current = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onTimeExpiredRef.current();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endTime]);

  // Format time as HH:MM:SS
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  // Warning states
  const isWarning = timeRemaining < 600; // Last 10 minutes
  const isCritical = timeRemaining < 300; // Last 5 minutes

  return (
    <div
      className={`flex items-center gap-2 font-mono text-lg font-bold ${
        isCritical
          ? "text-red-600 animate-pulse"
          : isWarning
            ? "text-orange-600"
            : "text-gray-700"
      }`}
    >
      <Clock className="w-5 h-5" />
      <span>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
