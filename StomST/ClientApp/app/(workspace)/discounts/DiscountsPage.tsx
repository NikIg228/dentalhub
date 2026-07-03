"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgePercent, PackageSearch, X } from "lucide-react";
import { PageSearch, PageSelect, PageToolbar } from "@/components/PageFilters";

type OfferType = "percent" | "bundle";
type TypeFilter = "all" | OfferType;
type SortMode = "discount" | "brand" | "type";

type DiscountOffer = {
  brand: string;
  value: string;
  note: string;
  type: OfferType;
  discountScore: number;
};

const offers: DiscountOffer[] = [
  { brand: "Straumann", value: "-15%", note: "На всю продукцию", type: "percent", discountScore: 15 },
  { brand: "3M", value: "-10%", note: "На расходные материалы", type: "percent", discountScore: 10 },
  { brand: "Kerr", value: "2+1", note: "На композитные материалы", type: "bundle", discountScore: 12 },
  { brand: "Dentium", value: "-20%", note: "На импланты", type: "percent", discountScore: 20 },
  { brand: "Voco", value: "-15%", note: "На все материалы", type: "percent", discountScore: 15 }
];

const typeOptions = [
  { value: "all", label: "Все типы" },
  { value: "percent", label: "Процент" },
  { value: "bundle", label: "Комплект" }
] as const;

const sortOptions = [
  { value: "discount", label: "По скидке" },
  { value: "brand", label: "По бренду" },
  { value: "type", label: "По типу" }
] as const;

const typeLabels: Record<OfferType, string> = {
  percent: "Процент",
  bundle: "Комплект"
};

export default function DiscountsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("discount");
  const [selectedOffer, setSelectedOffer] = useState<DiscountOffer | null>(null);

  const filteredOffers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return offers
      .filter((offer) => {
        const matchesType = typeFilter === "all" || offer.type === typeFilter;
        const matchesSearch = !term || [offer.brand, offer.value, offer.note, typeLabels[offer.type]].join(" ").toLowerCase().includes(term);

        return matchesType && matchesSearch;
      })
      .sort((left, right) => {
        if (sortMode === "brand") {
          return left.brand.localeCompare(right.brand, "ru");
        }

        if (sortMode === "type") {
          return typeLabels[left.type].localeCompare(typeLabels[right.type], "ru");
        }

        return right.discountScore - left.discountScore;
      });
  }, [search, sortMode, typeFilter]);

  useEffect(() => {
    if (!selectedOffer) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedOffer(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedOffer]);

  return (
    <section className="discounts-directory" aria-label="Скидки и акции">
      <PageToolbar className="discounts-directory-toolbar">
        <PageSearch value={search} onChange={setSearch} placeholder="Поиск по бренду, скидке или условию" />
        <PageSelect
          ariaLabel="Тип скидки"
          value={typeFilter}
          onChange={(value) => setTypeFilter(value as TypeFilter)}
          options={typeOptions}
        />
        <PageSelect
          ariaLabel="Сортировка скидок"
          value={sortMode}
          onChange={(value) => setSortMode(value as SortMode)}
          options={sortOptions}
        />
      </PageToolbar>

      <article className="discounts-table-panel">
        <div className="discounts-table-summary">
          <strong>{filteredOffers.length} активных предложений</strong>
          <span>Максимальная скидка {Math.max(...offers.map((offer) => offer.discountScore))}%</span>
        </div>

        {filteredOffers.length > 0 ? (
          <div className="discounts-table" role="table" aria-label="Скидки">
            <div className="discounts-table-head" role="row">
              <span>Бренд</span>
              <span>Скидка</span>
              <span>Условие</span>
              <span>Тип</span>
              <span />
            </div>

            {filteredOffers.map((offer) => (
              <DiscountRow offer={offer} key={`${offer.brand}-${offer.value}`} onOpen={() => setSelectedOffer(offer)} />
            ))}
          </div>
        ) : (
          <div className="discounts-empty">
            <BadgePercent size={30} />
            <strong>Скидки не найдены</strong>
            <p>Измените поиск или выберите другой тип предложения.</p>
          </div>
        )}
      </article>

      {selectedOffer ? <DiscountDetailsModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} /> : null}
    </section>
  );
}

function DiscountRow({ offer, onOpen }: { offer: DiscountOffer; onOpen: () => void }) {
  return (
    <div
      className="discounts-table-row"
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
      <div className="discount-brand-cell" role="cell">
        <span>
          <BadgePercent size={18} />
        </span>
        <strong>{offer.brand}</strong>
      </div>
      <b role="cell" data-label="Скидка">
        {offer.value}
      </b>
      <span role="cell" data-label="Условие">
        {offer.note}
      </span>
      <span role="cell" data-label="Тип">
        {typeLabels[offer.type]}
      </span>
      <Link href="/products" onClick={(event) => event.stopPropagation()}>
        Товары
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function DiscountDetailsModal({ offer, onClose }: { offer: DiscountOffer; onClose: () => void }) {
  return (
    <div className="discount-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="discount-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="discount-modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          <X size={18} />
        </button>

        <div className="discount-modal-head">
          <span>
            <BadgePercent size={24} />
          </span>
          <div>
            <h2 id="discount-modal-title">{offer.brand}</h2>
            <p>{offer.note}</p>
          </div>
        </div>

        <div className="discount-modal-kpis">
          <div>
            <span>Скидка</span>
            <strong>{offer.value}</strong>
          </div>
          <div>
            <span>Тип</span>
            <strong>{typeLabels[offer.type]}</strong>
          </div>
          <div>
            <span>Условие</span>
            <strong>{offer.note}</strong>
          </div>
        </div>

        <div className="discount-modal-note">
          <PackageSearch size={18} />
          <div>
            <strong>Применение скидки</strong>
            <span>Откройте каталог товаров, чтобы выбрать позиции этого бренда и сравнить предложения поставщиков.</span>
          </div>
        </div>

        <div className="discount-modal-actions">
          <Link href="/products">Смотреть товары</Link>
          <button type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </article>
    </div>
  );
}
