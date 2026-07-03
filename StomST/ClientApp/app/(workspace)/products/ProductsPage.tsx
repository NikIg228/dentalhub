"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Package, X } from "lucide-react";
import { SkeletonList } from "@/components/FeedbackState";
import { PageSearch, PageSelect, PageToolbar } from "@/components/PageFilters";
import { getProducts } from "@/lib/api";
import { discountedPrice, formatMoney, products as fallbackProducts, type Product } from "@/lib/catalog";

type StockFilter = "all" | "available" | "empty";
type SortMode = "name" | "price" | "stock";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [brand, setBrand] = useState("Все");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProducts(controller.signal)
      .then((apiProducts) => {
        if (apiProducts?.length) {
          setItems(apiProducts);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setItems(fallbackProducts);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => ["Все", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))], [items]);
  const brands = useMemo(() => ["Все", ...Array.from(new Set(items.map((item) => item.brand).filter(Boolean)))], [items]);
  const categoryOptions = useMemo(() => categories.map((item) => ({ label: item, value: item })), [categories]);
  const brandOptions = useMemo(() => brands.map((item) => ({ label: item, value: item })), [brands]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const stock = getProductStock(item);
        const matchesSearch =
          !term || [item.name, item.brand, item.category, item.form, item.country].join(" ").toLowerCase().includes(term);
        const matchesCategory = category === "Все" || item.category === category;
        const matchesBrand = brand === "Все" || item.brand === brand;
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "available" && stock > 0) ||
          (stockFilter === "empty" && stock === 0);

        return matchesSearch && matchesCategory && matchesBrand && matchesStock;
      })
      .sort((left, right) => {
        if (sortMode === "price") {
          return getLowestPrice(left) - getLowestPrice(right);
        }

        if (sortMode === "stock") {
          return getProductStock(right) - getProductStock(left);
        }

        return left.name.localeCompare(right.name, "ru");
      });
  }, [brand, category, items, search, sortMode, stockFilter]);

  function resetFilters() {
    setSearch("");
    setCategory("Все");
    setBrand("Все");
    setStockFilter("all");
    setSortMode("name");
  }

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  return (
    <section className="products-directory" aria-label="Справочник товаров">
      <PageToolbar className="products-directory-toolbar">
        <PageSearch value={search} onChange={setSearch} placeholder="Поиск по названию, бренду или категории" />
        <PageSelect ariaLabel="Категория" value={category} onChange={setCategory} options={categoryOptions} />
        <PageSelect ariaLabel="Бренд" value={brand} onChange={setBrand} options={brandOptions} />
        <PageSelect
          ariaLabel="Наличие"
          value={stockFilter}
          onChange={(value) => setStockFilter(value as StockFilter)}
          options={[
            { value: "all", label: "Все остатки" },
            { value: "available", label: "В наличии" },
            { value: "empty", label: "Без остатка" }
          ]}
        />
        <PageSelect
          ariaLabel="Сортировка"
          value={sortMode}
          onChange={(value) => setSortMode(value as SortMode)}
          options={[
            { value: "name", label: "По названию" },
            { value: "price", label: "По цене" },
            { value: "stock", label: "По остатку" }
          ]}
        />
      </PageToolbar>

      <article className="products-directory-panel">
        <div className="products-directory-head">
          <div>
            <h2>Справочник каталога</h2>
          </div>
          <span>{filteredItems.length} из {items.length}</span>
        </div>

        {isLoading ? (
          <SkeletonList rows={6} />
        ) : filteredItems.length > 0 ? (
          <div className="products-table" role="table" aria-label="Товары">
            <div className="products-table-head" role="row">
              <span>Товар</span>
              <span>Категория</span>
              <span>Бренд</span>
              <span>Форма</span>
              <span>Поставщики</span>
              <span>Мин. цена</span>
              <span>Остаток</span>
              <span />
            </div>

            {filteredItems.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} />
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <Package size={30} />
            <strong>Товар не найден</strong>
            <p>Измените поисковый запрос или сбросьте фильтры.</p>
            <button type="button" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
        )}
      </article>

      {selectedProduct ? (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      ) : null}
    </section>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const suppliers = product.quotes.length;
  const stock = getProductStock(product);
  const lowestPrice = getLowestPrice(product);
  const hasStock = stock > 0;
  const hasPrice = lowestPrice > 0;

  return (
    <div
      className="products-table-row"
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
      <div className="products-product-cell">
        <span>
          <Package size={18} />
        </span>
        <div>
          <strong>{product.name}</strong>
          <small>{product.country || "Страна не указана"}</small>
        </div>
      </div>
      <span data-label="Категория">{product.category || "Без категории"}</span>
      <span data-label="Бренд">{product.brand || "Не указан"}</span>
      <span data-label="Форма">{product.form || "Не указана"}</span>
      <b data-label="Поставщики">{suppliers || "—"}</b>
      <b className={hasPrice ? "" : "muted"} data-label="Мин. цена">
        {hasPrice ? formatMoney(lowestPrice) : "Нет цены"}
      </b>
      <b className={hasStock ? "" : "muted"} data-label="Остаток">
        {hasStock ? stock : "Нет остатка"}
      </b>
      <Link href={`/need?product=${product.id}`} onClick={(event) => event.stopPropagation()}>
        В потребность
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function ProductDetailsModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const suppliers = product.quotes.length;
  const stock = getProductStock(product);
  const lowestPrice = getLowestPrice(product);
  const bestQuote = getBestQuote(product);

  return (
    <div className="product-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="product-modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          <X size={18} />
        </button>

        <div className="product-modal-media" aria-label="Фото товара">
          <Package size={56} />
          <span>Фото товара</span>
        </div>

        <div className="product-modal-content">
          <div className="product-modal-title">
            <div>
              <h2 id="product-modal-title">{product.name}</h2>
              <p>{product.description || "Описание товара будет добавлено после синхронизации каталога."}</p>
            </div>
            <Link href={`/need?product=${product.id}`}>
              В потребность
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-modal-metrics">
            <span>
              <small>Мин. цена</small>
              <strong>{lowestPrice > 0 ? formatMoney(lowestPrice) : "Нет цены"}</strong>
            </span>
            <span>
              <small>Остаток</small>
              <strong>{stock || "Нет остатка"}</strong>
            </span>
            <span>
              <small>Поставщики</small>
              <strong>{suppliers || "—"}</strong>
            </span>
          </div>

          <dl className="product-modal-params">
            <div>
              <dt>Категория</dt>
              <dd>{product.category || "Без категории"}</dd>
            </div>
            <div>
              <dt>Бренд</dt>
              <dd>{product.brand || "Не указан"}</dd>
            </div>
            <div>
              <dt>Форма выпуска</dt>
              <dd>{product.form || "Не указана"}</dd>
            </div>
            <div>
              <dt>Страна</dt>
              <dd>{product.country || "Не указана"}</dd>
            </div>
          </dl>

          <div className="product-modal-offer">
            <span>Лучшее предложение</span>
            {bestQuote ? (
              <div>
                <strong>{bestQuote.supplier}</strong>
                <small>
                  {bestQuote.city} · остаток {bestQuote.stock} · до {bestQuote.expires}
                </small>
              </div>
            ) : (
              <div>
                <strong>Предложений пока нет</strong>
                <small>Цены и остатки появятся после загрузки поставщиков.</small>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function getProductStock(product: Product) {
  return product.quotes.reduce((sum, quote) => sum + quote.stock, 0);
}

function getLowestPrice(product: Product) {
  const prices = product.quotes.map((quote) => discountedPrice(quote)).filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
}

function getBestQuote(product: Product) {
  return product.quotes.slice().sort((left, right) => discountedPrice(left) - discountedPrice(right))[0];
}
