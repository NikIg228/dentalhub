import { AuthGate } from "@/components/AuthGate";
import { AppShell } from "@/components/AppShell";
import DashboardPage from "./(workspace)/dashboard/DashboardPage";

export default function HomePage() {
  return (
    <AuthGate>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </AuthGate>
  );
}
