"use client";

import { useState, useEffect } from "react";

type FormattedDateProps = {
  date: string;
  className?: string;
};

const formatMongolianDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year} оны ${month} сарын ${day}`;
};

export const FormattedDate = ({ date, className }: FormattedDateProps) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(formatMongolianDate(new Date(date)));
  }, [date]);

  return <span className={className}>{formattedDate || "\u00A0"}</span>;
};
