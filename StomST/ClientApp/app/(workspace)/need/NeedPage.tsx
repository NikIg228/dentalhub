"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Minus, Package, Plus, ShoppingBag, X } from "lucide-react";
import { PageCheckbox, PageFilterGroup, PageSearch, PageSelect, PageToolbar } from "@/components/PageFilters";

type NeedPriority = "critical" | "soon" | "planned";

type NeedItem = {
  id: number;
  name: string;
  category: string;
  cabinet: string;
  stock: number;
  minStock: number;
  unit: string;
  daysLeft: number;
  recommendedQty: number;
  priority: NeedPriority;
  estimatedPrice: number;
};

const needItems: NeedItem[] = [
  {
    id: 1,
    name: "Перчатки нитриловые M",
    category: "Расходные материалы",
    cabinet: "Кабинет 2",
    stock: 8,
    minStock: 24,
    unit: "упак.",
    daysLeft: 3,
    recommendedQty: 16,
    priority: "critical",
    estimatedPrice: 12900
  },
  {
    id: 2,
    name: "Слюноотсосы одноразовые",
    category: "Расходные материалы",
    cabinet: "Склад",
    stock: 12,
    minStock: 30,
    unit: "упак.",
    daysLeft: 5,
    recommendedQty: 18,
    priority: "critical",
    estimatedPrice: 8450
  },
  {
    id: 3,
    name: "Анестетик артикаин 4%",
    category: "Анестезия",
    cabinet: "Хирургия",
    stock: 6,
    minStock: 14,
    unit: "упак.",
    daysLeft: 7,
    recommendedQty: 8,
    priority: "soon",
    estimatedPrice: 18300
  },
  {
    id: 4,
    name: "Маски хирургические",
    category: "Защита",
    cabinet: "Склад",
    stock: 18,
    minStock: 36,
    unit: "упак.",
    daysLeft: 9,
    recommendedQty: 18,
    priority: "soon",
    estimatedPrice: 6700
  },
  {
    id: 5,
    name: "Композит универсальный A2",
    category: "Терапия",
    cabinet: "Кабинет 1",
    stock: 3,
    minStock: 8,
    unit: "шт.",
    daysLeft: 11,
    recommendedQty: 5,
    priority: "planned",
    estimatedPrice: 21600
  },
  {
    id: 6,
    name: "Коффердам Sanctuary",
    category: "Изоляция",
    cabinet: "Кабинет 3",
    stock: 4,
    minStock: 10,
    unit: "упак.",
    daysLeft: 12,
    recommendedQty: 6,
    priority: "planned",
    estimatedPrice: 9200
  }
];

const priorityOptions = [
  { value: "all", label: "Все" },
  { value: "critical", label: "Критично" },
  { value: "soon", label: "Скоро закончится" },
  { value: "planned", label: "Планово" }
] as const;

const priorityMeta: Record<NeedPriority, { label: string; className: string }> = {
  critical: { label: "Критично", className: "critical" },
  soon: { label: "Скоро", className: "soon" },
  planned: { label: "Планово", className: "planned" }
};

export default function NeedPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [priority, setPriority] = useState<(typeof priorityOptions)[number]["value"]>("all");
  const [onlyBelowMin, setOnlyBelowMin] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>(needItems.map((item) => item.id));
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(needItems.map((item) => [item.id, item.recommendedQty]))
  );

  const categories = useMemo(() => ["Все", ...Array.from(new Set(needItems.map((item) => item.category)))], []);
  const categoryOptions = useMemo(() => categories.map((item) => ({ label: item, value: item })), [categories]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return needItems.filter((item) => {
      const matchesSearch =
        !term || [item.name, item.category, item.cabinet].join(" ").toLowerCase().includes(term);
      const matchesCategory = category === "Все" || item.category === category;
      const matchesPriority = priority === "all" || item.priority === priority;
      const matchesStock = !onlyBelowMin || item.stock < item.minStock;

      return matchesSearch && matchesCategory && matchesPriority && matchesStock;
    });
  }, [category, onlyBelowMin, priority, search]);

  const selectedItems = needItems.filter((item) => selectedIds.includes(item.id));
  const selectedTotal = selectedItems.reduce((sum, item) => sum + (quantities[item.id] ?? 0) * item.estimatedPrice, 0);
  const selectedLineCount = selectedItems.length;
  const selectedUnitCount = selectedItems.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0);
  const criticalCount = needItems.filter((item) => item.priority === "critical").length;

  function toggleItem(itemId: number) {
    setSelectedIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]
    );
  }

  function updateQuantity(itemId: number, nextQuantity: number) {
    setQuantities((current) => ({ ...current, [itemId]: Math.max(0, nextQuantity) }));
  }

  function resetFilters() {
    setSearch("");
    setCategory("Все");
    setPriority("all");
    setOnlyBelowMin(true);
  }

  return (
    <section className="need-collector" aria-label="Потребности по остаткам">
      <PageToolbar className="need-collector-toolbar">
        <PageSearch value={search} onChange={setSearch} placeholder="Поиск по товару, категории или кабинету" />

        <PageFilterGroup>
          <PageSelect ariaLabel="Категория" value={category} onChange={setCategory} options={categoryOptions} />
          <PageSelect
            ariaLabel="Приоритет"
            value={priority}
            onChange={(value) => setPriority(value as typeof priority)}
            options={priorityOptions}
          />
          <PageCheckbox checked={onlyBelowMin} onChange={setOnlyBelowMin}>
            Только ниже нормы
          </PageCheckbox>
        </PageFilterGroup>
      </PageToolbar>

      <div className="need-collector-layout">
        <article className="need-deficit-panel">
          <div className="need-panel-head">
            <div>
              <h2>Заканчивающиеся товары</h2>
            </div>
            <span className="need-count">{filteredItems.length}</span>
          </div>

          <div className="need-deficit-table" role="table" aria-label="Список заканчивающихся товаров">
            <div className="need-deficit-head" role="row">
              <span>Товар</span>
              <span>Остаток</span>
              <span>Хватит</span>
              <span>Докупить</span>
              <span>Приоритет</span>
            </div>

            {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const quantity = quantities[item.id] ?? item.recommendedQty;
              const priorityInfo = priorityMeta[item.priority];

              return (
                <div className={isSelected ? "need-deficit-row selected" : "need-deficit-row"} role="row" key={item.id}>
                  <div className="need-product-cell">
                    <button
                      className="need-select-toggle"
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-label={isSelected ? "Убрать из заявки" : "Добавить в заявку"}
                    >
                      {isSelected ? <Check size={15} /> : <Plus size={15} />}
                    </button>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {item.category} · {item.cabinet}
                      </small>
                    </div>
                  </div>

                  <div className="need-stock-cell">
                    <strong>
                      {item.stock} / {item.minStock}
                    </strong>
                    <small>{item.unit}</small>
                  </div>

                  <span className="need-days">{item.daysLeft} дн.</span>

                  <div className="need-qty-control" aria-label={`Количество для ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, quantity - 1)} aria-label="Уменьшить">
                      <Minus size={13} />
                    </button>
                    <input
                      value={quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 0)}
                      inputMode="numeric"
                      aria-label="Количество"
                    />
                    <button type="button" onClick={() => updateQuantity(item.id, quantity + 1)} aria-label="Увеличить">
                      <Plus size={13} />
                    </button>
                  </div>

                  <span className={`need-priority ${priorityInfo.className}`}>{priorityInfo.label}</span>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className="need-empty">
              <Package size={30} />
              <strong>По фильтрам ничего не найдено</strong>
              <p>Сбросьте фильтры или проверьте поисковый запрос.</p>
              <button type="button" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            </div>
          ) : null}
        </article>

        <aside className="need-request-summary">
          <div className="need-panel-head compact">
            <div>
              <h2>Корзина</h2>
            </div>
            <ShoppingBag size={20} />
          </div>

          <div className="need-summary-metrics">
            <span>
              <strong>{selectedLineCount}</strong>
              позиций
            </span>
            <span>
              <strong>{selectedUnitCount}</strong>
              ед.
            </span>
            <span>
              <strong>{criticalCount}</strong>
              критично
            </span>
          </div>

          {selectedItems.length > 0 ? (
            <div className="need-selected-list">
              {selectedItems.map((item) => (
                <div className="need-selected-line" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {quantities[item.id] ?? item.recommendedQty} {item.unit}
                    </small>
                  </div>
                  <button type="button" onClick={() => toggleItem(item.id)} aria-label="Убрать позицию">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="need-empty compact">
              <AlertTriangle size={26} />
              <strong>Заявка пустая</strong>
              <p>Выберите позиции из списка дефицита.</p>
            </div>
          )}

          <div className="need-summary-total">
            <span>Ориентир</span>
            <strong>{formatMoney(selectedTotal)}</strong>
          </div>

          <button className="need-submit" type="button" disabled={selectedItems.length === 0}>
            Сформировать заявку
          </button>
        </aside>
      </div>
    </section>
  );
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}
