"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, PackageCheck, Truck, X } from "lucide-react";
import { PageSearch, PageSelect, PageToolbar } from "@/components/PageFilters";

type OrderStatus = "Согласование" | "В доставке" | "Завершен";
type StatusFilter = "all" | OrderStatus;
type SortMode = "date" | "total" | "status";

type Order = {
  id: string;
  status: OrderStatus;
  supplier: string;
  date: string;
  dateValue: string;
  total: number;
  items: string[];
  step: number;
};

const orderSteps = ["Заявка", "Согласование", "Оплата", "Доставка", "Получено"];

const orders: Order[] = [
  {
    id: "DNT-24872",
    status: "В доставке",
    supplier: 'ТОО "ДентМед КЗ"',
    date: "18 июн 2026",
    dateValue: "2026-06-18",
    total: 127000,
    items: ["Слюноотсосы Euronda", "Платки для коффердама Sanctuary", "Маски медицинские"],
    step: 4
  },
  {
    id: "DNT-24841",
    status: "Согласование",
    supplier: 'ТОО "Профи-Дент"',
    date: "16 июн 2026",
    dateValue: "2026-06-16",
    total: 86400,
    items: ["Карпульные иглы Spident", "Наконечники"],
    step: 2
  },
  {
    id: "DNT-24790",
    status: "Завершен",
    supplier: 'ТОО "Премиум Дент"',
    date: "10 июн 2026",
    dateValue: "2026-06-10",
    total: 340000,
    items: ["Импланты Straumann"],
    step: 5
  }
];

const statusOptions = [
  { value: "all", label: "Все статусы" },
  { value: "Согласование", label: "Согласование" },
  { value: "В доставке", label: "В доставке" },
  { value: "Завершен", label: "Завершен" }
] as const;

const sortOptions = [
  { value: "date", label: "Новые сначала" },
  { value: "total", label: "По сумме" },
  { value: "status", label: "По статусу" }
] as const;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
          !term || [order.id, order.status, order.supplier, ...order.items].join(" ").toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
      })
      .sort((left, right) => {
        if (sortMode === "total") {
          return right.total - left.total;
        }

        if (sortMode === "status") {
          return left.status.localeCompare(right.status, "ru");
        }

        return new Date(right.dateValue).getTime() - new Date(left.dateValue).getTime();
      });
  }, [search, sortMode, statusFilter]);

  const activeCount = orders.filter((order) => order.status !== "Завершен").length;

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  return (
    <section className="orders-directory" aria-label="Журнал заказов">
      <PageToolbar className="orders-directory-toolbar">
        <PageSearch value={search} onChange={setSearch} placeholder="Поиск по номеру, поставщику или товару" />
        <PageSelect
          ariaLabel="Статус заказа"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as StatusFilter)}
          options={statusOptions}
        />
        <PageSelect
          ariaLabel="Сортировка заказов"
          value={sortMode}
          onChange={(value) => setSortMode(value as SortMode)}
          options={sortOptions}
        />
        <Link className="orders-create-action" href="/need">
          <PackageCheck size={17} />
          Собрать заказ
        </Link>
      </PageToolbar>

      <article className="orders-table-panel">
        <div className="orders-table-summary">
          <div>
            <strong>{filteredOrders.length} заказа</strong>
            <span>{activeCount} в работе</span>
          </div>
          <span>{formatMoney(orders.reduce((sum, order) => sum + order.total, 0))}</span>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="orders-table" role="table" aria-label="Заказы">
            <div className="orders-table-head" role="row">
              <span>Заказ</span>
              <span>Поставщик</span>
              <span>Дата</span>
              <span>Статус</span>
              <span>Позиций</span>
              <span>Сумма</span>
            </div>

            {filteredOrders.map((order) => (
              <OrderRow order={order} key={order.id} onOpen={() => setSelectedOrder(order)} />
            ))}
          </div>
        ) : (
          <div className="orders-empty">
            <PackageCheck size={30} />
            <strong>Заказы не найдены</strong>
            <p>Измените поиск или выберите другой статус.</p>
          </div>
        )}
      </article>

      {selectedOrder ? <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} /> : null}
    </section>
  );
}

function OrderRow({ order, onOpen }: { order: Order; onOpen: () => void }) {
  return (
    <div
      className="orders-table-row"
      role="row"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="order-id-cell" role="cell">
        <span>
          <PackageCheck size={18} />
        </span>
        <div>
          <strong>#{order.id}</strong>
          <small>{order.items[0]}</small>
        </div>
      </div>
      <span role="cell" data-label="Поставщик">
        {order.supplier}
      </span>
      <span role="cell" data-label="Дата">
        {order.date}
      </span>
      <b className={getStatusClass(order.status)} role="cell" data-label="Статус">
        {order.status}
      </b>
      <b role="cell" data-label="Позиций">
        {order.items.length}
      </b>
      <b role="cell" data-label="Сумма">
        {formatMoney(order.total)}
      </b>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="order-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="order-modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          <X size={18} />
        </button>

        <div className="order-modal-head">
          <span>
            <PackageCheck size={24} />
          </span>
          <div>
            <h2 id="order-modal-title">Заказ #{order.id}</h2>
            <p>
              {order.supplier} · {order.date}
            </p>
          </div>
        </div>

        <div className="order-modal-kpis">
          <div>
            <span>Статус</span>
            <strong>{order.status}</strong>
          </div>
          <div>
            <span>Позиций</span>
            <strong>{order.items.length}</strong>
          </div>
          <div>
            <span>Сумма</span>
            <strong>{formatMoney(order.total)}</strong>
          </div>
        </div>

        <div className="order-modal-progress">
          {orderSteps.map((step, index) => {
            const isDone = index + 1 <= order.step;

            return (
              <div className={isDone ? "done" : ""} key={step}>
                <span>{isDone ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}</span>
                <small>{step}</small>
              </div>
            );
          })}
        </div>

        <div className="order-modal-items">
          <strong>Товары в заказе</strong>
          {order.items.map((item, index) => (
            <div key={item}>
              <span>
                <Truck size={15} />
              </span>
              <strong>{item}</strong>
              <small>{index + 1} поз.</small>
            </div>
          ))}
        </div>

        <div className="order-modal-actions">
          <Link href="/need">Собрать новый заказ</Link>
          <button type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </article>
    </div>
  );
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}

function getStatusClass(status: OrderStatus) {
  if (status === "Завершен") {
    return "success";
  }

  if (status === "В доставке") {
    return "active";
  }

  return "muted";
}
