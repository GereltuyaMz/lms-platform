/**
 * Formatting utilities for Mongolian locale
 * Handles dates, numbers, currency, and text formatting
 */

/**
 * Format date in Mongolian format (locale-safe to avoid SSR hydration issues)
 * @param date - Date string or Date object
 * @param format - Format type: 'short' | 'medium' | 'long' | 'relative'
 * @returns Formatted date string in Mongolian
 */
export function formatDateMongolian(
  date: string | Date,
  format: "short" | "medium" | "long" | "relative" = "medium"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  if (format === "relative") {
    return formatRelativeTime(dateObj);
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();

  const monthNames = [
    "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
    "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
  ];

  const monthNamesLong = [
    "Нэгдүгээр сар", "Хоёрдугаар сар", "Гуравдугаар сар", "Дөрөвдүгээр сар",
    "Тавдугаар сар", "Зургадугаар сар", "Долдугаар сар", "Наймдугаар сар",
    "Есдүгээр сар", "Аравдугаар сар", "Арван нэгдүгээр сар", "Арван хоёрдугаар сар"
  ];

  if (format === "short") {
    return `${year}.${String(month + 1).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  } else if (format === "medium") {
    return `${year} оны ${monthNames[month]} ${day}`;
  } else {
    return `${year} оны ${monthNamesLong[month]}ын ${day}`;
  }
}

/**
 * Format date in simple YYYY.MM.DD format (safe for SSR)
 */
export function formatDateSimple(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * Format relative time (e.g., "2 өдрийн өмнө")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return "саяхан";
  } else if (diffMin < 60) {
    return `${diffMin} минутын өмнө`;
  } else if (diffHour < 24) {
    return `${diffHour} цагийн өмнө`;
  } else if (diffDay === 1) {
    return "өчигдөр";
  } else if (diffDay < 7) {
    return `${diffDay} өдрийн өмнө`;
  } else if (diffWeek < 4) {
    return `${diffWeek} долоо хоногийн өмнө`;
  } else if (diffMonth < 12) {
    return `${diffMonth} сарын өмнө`;
  } else {
    return `${diffYear} жилийн өмнө`;
  }
}

/**
 * Format number with Mongolian thousands separator
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("mn-MN").format(num);
}

/**
 * Format currency in Mongolian Tugrik (₮)
 * @param amount - Amount in tugrik
 * @param showSymbol - Whether to show ₮ symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = formatNumber(amount);
  return showSymbol ? `${formatted}₮` : formatted;
}

/**
 * Format percentage
 * @param value - Value between 0-100
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration in hours/minutes (Mongolian)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} цаг ${minutes} минут`;
    }
    return `${hours} цаг`;
  } else if (minutes > 0) {
    if (secs > 0) {
      return `${minutes} минут ${secs} секунд`;
    }
    return `${minutes} минут`;
  } else {
    return `${secs} секунд`;
  }
}

/**
 * Format duration in short format (00:00)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (MM:SS or HH:MM:SS)
 */
export function formatDurationShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
}

/**
 * Format course level in Mongolian
 */
export function formatCourseLevel(
  level: "Beginner" | "Intermediate" | "Advanced"
): string {
  const levelMap = {
    Beginner: "Анхан шат",
    Intermediate: "Дунд шат",
    Advanced: "Ахисан шат",
  };

  return levelMap[level] || level;
}

/**
 * Convert Mongolian course level back to English database value
 */
export function parseCourseLevelToDb(
  level: string
): "Beginner" | "Intermediate" | "Advanced" | null {
  const levelMap: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
    "Анхан шат": "Beginner",
    "Дунд шат": "Intermediate",
    "Ахисан шат": "Advanced",
  };

  return levelMap[level] || null;
}

/**
 * Format lesson type in Mongolian
 */
export function formatLessonType(
  type: "video" | "quiz" | "text" | "assignment"
): string {
  const typeMap = {
    video: "Видео",
    quiz: "Тест",
    text: "Унших материал",
    assignment: "Даалгавар",
  };

  return typeMap[type] || type;
}

/**
 * Format payment method in Mongolian
 */
export function formatPaymentMethod(
  method: "qpay" | "social_pay" | "card"
): string {
  const methodMap = {
    qpay: "QPay",
    social_pay: "SocialPay",
    card: "Карт",
  };

  return methodMap[method] || method;
}

/**
 * Format purchase status in Mongolian
 */
export function formatPurchaseStatus(
  status: "pending" | "completed" | "failed" | "refunded"
): string {
  const statusMap = {
    pending: "Хүлээгдэж буй",
    completed: "Амжилттай",
    failed: "Амжилтгүй",
    refunded: "Буцаагдсан",
  };

  return statusMap[status] || status;
}

/**
 * Pluralize Mongolian words
 * @param count - Number of items
 * @param singular - Singular form
 * @param suffix - Plural suffix (default: "ууд")
 * @returns Pluralized string with count
 */
export function pluralize(
  count: number,
  singular: string,
  suffix: string = "ууд"
): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${singular}${suffix}`;
}

/**
 * Format course count
 */
export function formatCourseCount(count: number): string {
  return pluralize(count, "хичээл", "");
}

/**
 * Format lesson count
 */
export function formatLessonCount(count: number): string {
  return pluralize(count, "хичээл", "");
}

/**
 * Format student count
 */
export function formatStudentCount(count: number): string {
  return pluralize(count, "суралцагч", "");
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get ordinal number in Mongolian
 * @param num - Number
 * @returns Ordinal string (e.g., "1-р", "2-р")
 */
export function getOrdinal(num: number): string {
  return `${num}-р`;
}

/**
 * Format badge rarity in Mongolian
 */
export function formatBadgeRarity(
  rarity: "bronze" | "silver" | "gold" | "platinum"
): string {
  const rarityMap = {
    bronze: "Хүрэл",
    silver: "Мөнгө",
    gold: "Алт",
    platinum: "Платин",
  };

  return rarityMap[rarity] || rarity;
}

/**
 * Format streak days message
 * @param days - Number of streak days
 * @returns Formatted message
 */
export function formatStreakDays(days: number): string {
  if (days === 0) {
    return "Танд хараахан cтрик байхгүй байна";
  } else if (days === 1) {
    return "1 өдрийн cтрик";
  } else {
    return `${days} өдрийн cтрик`;
  }
}
