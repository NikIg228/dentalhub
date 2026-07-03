import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, ShoppingCart, TrendingUp, Truck } from "lucide-react";

type RecommendedItem = {
  name: string;
  reason: string;
  supplier: string;
  amount: number;
  quantity: string;
};

const maxVisibleRecommendations = 5;

const dashboardStats = [
  { icon: <ShoppingCart size={18} />, label: "К заказу сегодня", value: "18", detail: "позиций" },
  { icon: <Truck size={18} />, label: "В пути", value: "7", detail: "поставок" },
  { icon: <TrendingUp size={18} />, label: "Экономия месяца", value: "1.24 млн ₸", detail: "+18%" },
  { icon: <Clock3 size={18} />, label: "Риск дефицита", value: "4", detail: "товара" }
];

const recommendedItems: RecommendedItem[] = [
  {
    name: "Перчатки нитриловые M",
    reason: "хватит на 9 дней",
    supplier: "Dental Trade",
    amount: 12900,
    quantity: "12 упак."
  },
  {
    name: "Слюноотсосы одноразовые",
    reason: "ниже нормы на 18%",
    supplier: "MedExpert",
    amount: 8450,
    quantity: "8 упак."
  },
  {
    name: "Маски хирургические",
    reason: "скидка до пятницы",
    supplier: "Stom Line",
    amount: 6700,
    quantity: "6 упак."
  },
  {
    name: "Анестетик артикаин 4%",
    reason: "активный спрос",
    supplier: "Dental Trade",
    amount: 18300,
    quantity: "4 упак."
  },
  {
    name: "Композит универсальный A2",
    reason: "остаток ниже плана",
    supplier: "MedExpert",
    amount: 21600,
    quantity: "3 шт."
  }
];

const savingsByMonth = [
  { month: "Фев", value: 720000, height: 42 },
  { month: "Мар", value: 860000, height: 50 },
  { month: "Апр", value: 810000, height: 47 },
  { month: "Май", value: 1050000, height: 62 },
  { month: "Июн", value: 1240000, height: 74, current: true }
];

const attentionItems = [
  { title: "DNT-24871 ждёт согласования", meta: "MedExpert · 89 500 ₸", tone: "warning" },
  { title: "Цена изменилась у 3 позиций", meta: "Проверьте перед отправкой", tone: "neutral" },
  { title: "Поставка DNT-24872 сегодня", meta: "Dental Trade · до 18:00", tone: "success" }
];

const visibleRecommendedItems = recommendedItems.slice(0, maxVisibleRecommendations);
const recommendationSummary = getRecommendationSummary(recommendedItems, visibleRecommendedItems);

export default function DashboardPage() {
  const hasRecommendedItems = visibleRecommendedItems.length > 0;

  return (
    <>
      <section className="dashboard-stats dashboard-stats-redesigned" aria-label="Ключевые показатели">
        {dashboardStats.map((stat) => (
          <DashboardStat icon={stat.icon} label={stat.label} value={stat.value} detail={stat.detail} key={stat.label} />
        ))}
      </section>

      <section className="dashboard-workbench">
        <article className="dashboard-card recommendation-card recommendation-card-redesigned">
          <div className="panel-heading">
            <div />
            <BadgeCheck size={20} />
          </div>

          {hasRecommendedItems ? (
            <div className="recommendation-table" role="table" aria-label="Рекомендованные позиции">
              <div className="recommendation-head" role="row">
                <span>Товар</span>
                <span>Поставщик</span>
                <span>Кол-во</span>
                <span>Цена</span>
              </div>

              {visibleRecommendedItems.map((item) => (
                <div className="recommendation-row" role="row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.reason}</small>
                  </div>
                  <span>{item.supplier}</span>
                  <b>{item.quantity}</b>
                  <em>{formatMoney(item.amount)}</em>
                </div>
              ))}
            </div>
          ) : (
            <div className="recommendation-empty">
              <strong>Нет срочных рекомендаций</strong>
              <span>Остатки выглядят стабильными. Можно проверить потребность или открыть каталог.</span>
            </div>
          )}

          <div className="recommendation-footer">
            <span>{recommendationSummary}</span>
            <Link className="primary-action recommendation-action" href="/need">
              {hasRecommendedItems ? "Заказать" : "Открыть потребность"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>

        <aside className="dashboard-side-stack" aria-label="Сводка и события">
          <article className="dashboard-card savings-card savings-card-redesigned">
            <h2>1 240 000 ₸</h2>
            <p>+18% к прошлому месяцу</p>

            <div className="savings-chart" aria-label="Динамика экономии за пять месяцев">
              <div className="savings-chart-head">
                <span>Динамика</span>
                <strong>Фев - Июн</strong>
              </div>
              <div className="savings-bars">
                {savingsByMonth.map((item) => (
                  <div className={item.current ? "current" : ""} key={item.month}>
                    <span style={{ height: `${item.height}px` }}>
                      <b>{Math.round(item.value / 1000)}k</b>
                    </span>
                    <small>{item.month}</small>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="dashboard-card attention-card">
            <div className="panel-heading compact">
              <div>
                <h2>3 события</h2>
              </div>
            </div>

            <div className="attention-list">
              {attentionItems.map((item) => (
                <Link className={item.tone} href="/orders" key={item.title}>
                  <span />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </>
  );
}

function DashboardStat({
  icon,
  label,
  value,
  detail
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="dashboard-stat dashboard-stat-redesigned">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
      <em>{detail}</em>
    </article>
  );
}

function getRecommendationSummary(allItems: RecommendedItem[], visibleItems: RecommendedItem[]) {
  if (allItems.length === 0) {
    return "Рекомендаций нет";
  }

  const visibleTotal = visibleItems.reduce((sum, item) => sum + item.amount, 0);
  const visibleCountLabel = getPositionLabel(visibleItems.length);
  const countPrefix =
    allItems.length > visibleItems.length ? `${visibleItems.length} из ${allItems.length}` : String(visibleItems.length);

  return `${countPrefix} ${visibleCountLabel} · ориентир ${formatMoney(visibleTotal)}`;
}

function getPositionLabel(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "позиций";
  }

  if (lastDigit === 1) {
    return "позиция";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "позиции";
  }

  return "позиций";
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}
