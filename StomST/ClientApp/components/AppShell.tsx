"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  Home,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  User
} from "lucide-react";
import { DashboardGreeting } from "@/components/DashboardGreeting";
import { clearLocalSession } from "@/lib/local-auth";

export type AppSection = "dashboard" | "need" | "products" | "suppliers" | "orders" | "discounts";

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { id: "dashboard", href: "/dashboard", label: "Обзор", icon: Home },
  { id: "need", href: "/need", label: "Потребность", icon: ClipboardList },
  { id: "products", href: "/products", label: "Товары", icon: Package },
  { id: "suppliers", href: "/suppliers", label: "Поставщики", icon: Building2 },
  { id: "orders", href: "/orders", label: "Заказы", icon: Boxes },
  { id: "discounts", href: "/discounts", label: "Скидки", icon: BadgePercent }
] as const;

const mobileNavItems = navItems.filter((item) =>
  ["need", "products", "suppliers", "orders"].includes(item.id)
);

const SIDEBAR_COLLAPSED_KEY = "dentalhub.sidebar.collapsed";
const clinicName = "Atlas Dental";

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const active =
    pathname === "/"
      ? "dashboard"
      : navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.id;

  useEffect(() => {
    setIsSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
  }, []);

  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  function toggleSidebar() {
    setIsSidebarCollapsed((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }

  function prefetchRoute(href: string) {
    router.prefetch(href);
  }

  return (
    <main className={isSidebarCollapsed ? "app-layout sidebar-collapsed" : "app-layout"}>
      <aside className="app-sidebar">
        <div className="sidebar-head">
          <Link className="sidebar-brand" href="/dashboard" title="DentHub">
            <span>D</span>
            <strong>DENTALHUB</strong>
          </Link>

          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? "Развернуть меню" : "Свернуть меню"}
            aria-pressed={isSidebarCollapsed}
            title={isSidebarCollapsed ? "Развернуть меню" : "Свернуть меню"}
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Основная навигация">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className={item.id === active ? "active" : ""}
                href={item.href}
                key={item.id}
                onFocus={() => prefetchRoute(item.href)}
                onMouseEnter={() => prefetchRoute(item.href)}
                prefetch
                title={item.label}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <span>
            <User size={16} />
          </span>
          <div>
            <strong>Atlas Dental</strong>
            <small>Клиника</small>
          </div>
          <button
            type="button"
            aria-label="Выйти"
            title="Выйти"
            onClick={() => {
              clearLocalSession();
              router.replace("/login");
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className={active === "dashboard" || active === "need" || active === "products" || active === "suppliers" || active === "orders" || active === "discounts" ? "app-topbar with-greeting" : "app-topbar"}>
          {active === "dashboard" ? <DashboardGreeting clinicName={clinicName} variant="topbar" /> : null}
          {active === "need" ? (
            <div className="topbar-page-title" aria-label="Название страницы">
              <strong>Потребности</strong>
            </div>
          ) : null}
          {active === "products" ? (
            <div className="topbar-page-title" aria-label="Название страницы">
              <strong>Товары</strong>
            </div>
          ) : null}
          {active === "suppliers" ? (
            <div className="topbar-page-title" aria-label="Название страницы">
              <strong>Поставщики</strong>
            </div>
          ) : null}
          {active === "orders" ? (
            <div className="topbar-page-title" aria-label="Название страницы">
              <strong>Заказы</strong>
            </div>
          ) : null}
          {active === "discounts" ? (
            <div className="topbar-page-title" aria-label="Название страницы">
              <strong>Скидки</strong>
            </div>
          ) : null}
          <div className="topbar-search">
            <Search size={17} />
            <input placeholder="Поиск по товарам, поставщикам, заказам..." />
          </div>
          <button type="button" aria-label="Уведомления">
            <Bell size={18} />
          </button>
          <button type="button" aria-label="Профиль">
            <User size={18} />
          </button>
        </header>
        {children}
      </section>

      <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={item.id === active ? "active" : ""}
              href={item.href}
              key={item.id}
              onFocus={() => prefetchRoute(item.href)}
              onMouseEnter={() => prefetchRoute(item.href)}
              prefetch
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
