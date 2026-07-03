"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLocalSessionActive } from "@/lib/local-auth";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    if (isLocalSessionActive()) {
      setStatus("allowed");
      return;
    }

    const next = pathname && pathname !== "/" ? pathname : "/dashboard";
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router]);

  if (status === "checking") {
    return (
      <main className="auth-check">
        <span>D</span>
        <strong>Проверяем доступ</strong>
      </main>
    );
  }

  return children;
}
