"use client";

import { useEffect, useState } from "react";

type DashboardGreetingProps = {
  clinicName: string;
  variant?: "hero" | "topbar";
};

function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Доброе утро";
  }

  if (hour >= 12 && hour < 17) {
    return "Добрый день";
  }

  if (hour >= 17 && hour < 23) {
    return "Добрый вечер";
  }

  return "Доброй ночи";
}

export function DashboardGreeting({ clinicName, variant = "hero" }: DashboardGreetingProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const greeting = getGreeting(now);

  if (variant === "topbar") {
    return (
      <div className="topbar-greeting" aria-label="Приветствие">
        <strong suppressHydrationWarning>
          {greeting}, {clinicName}
        </strong>
      </div>
    );
  }

  return (
    <>
      <h1 suppressHydrationWarning>
        {greeting}, {clinicName}
      </h1>

      <p className="dashboard-command-lead">
        Система нашла товары с риском дефицита, активные поставки и предложения, где можно сохранить
        бюджет.
      </p>
    </>
  );
}
