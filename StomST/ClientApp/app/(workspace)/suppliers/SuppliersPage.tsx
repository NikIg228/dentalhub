"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Mail, MapPin, Phone, Search, ShieldCheck, Tag, X } from "lucide-react";
import { LoadingBadge, SkeletonList } from "@/components/FeedbackState";
import { PageSearch, PageSelect, PageToolbar } from "@/components/PageFilters";
import { getSuppliers } from "@/lib/api";
import { suppliers as fallbackSuppliers, type Supplier } from "@/lib/suppliers";

const filters = ["Все", "С договором", "Нужен договор", "Со скидкой"] as const;
const filterOptions = filters.map((item) => ({ label: item, value: item }));

export default function SuppliersPage() {
  const [items, setItems] = useState<Supplier[]>(fallbackSuppliers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Все");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getSuppliers(controller.signal)
      .then((apiSuppliers) => {
        if (apiSuppliers?.length) {
          setItems(apiSuppliers);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setItems(fallbackSuppliers);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedSupplier) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSupplier(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedSupplier]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((supplier) => {
      const matchesStatus =
        filter === "Все" ||
        (filter === "С договором" && supplier.contractSigned) ||
        (filter === "Нужен договор" && !supplier.contractSigned) ||
        (filter === "Со скидкой" && supplier.hasDiscount);

      if (!matchesStatus) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        supplier.name,
        supplier.city,
        ...supplier.branches.flatMap((branch) => [branch.name, ...branch.phones, ...branch.emails])
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [filter, items, search]);

  const branchCount = items.reduce((sum, supplier) => sum + supplier.branches.length, 0);

  return (
    <section className="suppliers-directory">
      <PageToolbar className="suppliers-clean-toolbar">
        <PageSearch value={search} onChange={setSearch} placeholder="Поиск по поставщику, городу, телефону или email" />
        <PageSelect
          ariaLabel="Фильтр поставщиков"
          value={filter}
          onChange={(value) => setFilter(value as (typeof filters)[number])}
          options={filterOptions}
        />
      </PageToolbar>

      <section className="suppliers-table-panel">
        <div className="suppliers-table-summary">
          <strong>{filteredItems.length} поставщика</strong>
          <span>{branchCount} филиалов в справочнике</span>
        </div>

        {isLoading ? <LoadingBadge /> : null}

        <div className="suppliers-table" role="table" aria-label="Поставщики">
          <div className="suppliers-table-head" role="row">
            <span>Поставщик</span>
            <span>Город</span>
            <span>Договор</span>
            <span>Скидка</span>
            <span>Филиалы</span>
            <span>Контакт</span>
          </div>

          {isLoading ? (
            <SkeletonList rows={4} />
          ) : (
            filteredItems.map((supplier) => (
              <SupplierRow supplier={supplier} key={supplier.id} onOpen={() => setSelectedSupplier(supplier)} />
            ))
          )}
        </div>

        {!isLoading && filteredItems.length === 0 ? (
          <div className="suppliers-empty">
            <Search size={28} />
            <strong>Поставщики не найдены</strong>
            <p>Измените поиск или выберите другой фильтр.</p>
          </div>
        ) : null}
      </section>

      {selectedSupplier ? (
        <SupplierDetailsModal supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
      ) : null}
    </section>
  );
}

function SupplierRow({ supplier, onOpen }: { supplier: Supplier; onOpen: () => void }) {
  const mainBranch = supplier.branches[0];
  const phone = mainBranch?.phones[0] ?? "Телефон не указан";

  return (
    <div
      className="suppliers-table-row"
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
      <div className="supplier-name-cell" role="cell">
        <span>
          <Building2 size={18} />
        </span>
        <div>
          <strong>{supplier.name}</strong>
          <small>{mainBranch?.name ?? "Филиал не указан"}</small>
        </div>
      </div>
      <span role="cell" data-label="Город">
        {supplier.city || "—"}
      </span>
      <b className={supplier.contractSigned ? "success" : "muted"} role="cell" data-label="Договор">
        {supplier.contractSigned ? "Подписан" : "Нужен"}
      </b>
      <b className={supplier.hasDiscount ? "success" : "muted"} role="cell" data-label="Скидка">
        {supplier.hasDiscount ? "Есть" : "Нет"}
      </b>
      <b role="cell" data-label="Филиалы">
        {supplier.branches.length}
      </b>
      <span role="cell" data-label="Контакт">
        {phone}
      </span>
    </div>
  );
}

function SupplierDetailsModal({ supplier, onClose }: { supplier: Supplier; onClose: () => void }) {
  const mainBranch = supplier.branches[0];
  const mainPhone = mainBranch?.phones[0];
  const mainEmail = mainBranch?.emails[0];

  return (
    <div className="supplier-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="supplier-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="supplier-modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          <X size={18} />
        </button>

        <div className="supplier-modal-head">
          <span>
            <Building2 size={24} />
          </span>
          <div>
            <h2 id="supplier-modal-title">{supplier.name}</h2>
            <p>
              <MapPin size={15} />
              {supplier.city || "Город не указан"}
            </p>
          </div>
        </div>

        <div className="supplier-modal-status">
          <span className={supplier.contractSigned ? "success" : "muted"}>
            <ShieldCheck size={16} />
            {supplier.contractSigned ? "Договор подписан" : "Нужен договор"}
          </span>
          <span className={supplier.hasDiscount ? "success" : "muted"}>
            <Tag size={16} />
            {supplier.hasDiscount ? "Есть скидка" : "Скидка не указана"}
          </span>
          <span>
            <Building2 size={16} />
            {supplier.branches.length} {getBranchWord(supplier.branches.length)}
          </span>
        </div>

        <div className="supplier-modal-kpis">
          <div>
            <span>Договор</span>
            <strong>{supplier.contractSigned ? "Подписан" : "Нужен"}</strong>
          </div>
          <div>
            <span>Скидка</span>
            <strong>{supplier.hasDiscount ? "Есть" : "Нет"}</strong>
          </div>
          <div>
            <span>Город</span>
            <strong>{supplier.city || "—"}</strong>
          </div>
          <div>
            <span>Филиалы</span>
            <strong>{supplier.branches.length}</strong>
          </div>
        </div>

        <div className="supplier-modal-contact">
          <div>
            <span>Основной контакт</span>
            <strong>{mainBranch?.name ?? "Филиал не указан"}</strong>
          </div>
          <div className="supplier-modal-contact-links">
            {mainPhone ? (
              <a href={`tel:${normalizePhoneHref(mainPhone)}`}>
                <Phone size={15} />
                {mainPhone}
              </a>
            ) : (
              <span>
                <Phone size={15} />
                Телефон не указан
              </span>
            )}
            {mainEmail ? (
              <a href={`mailto:${mainEmail}`}>
                <Mail size={15} />
                {mainEmail}
              </a>
            ) : (
              <span>
                <Mail size={15} />
                Email не указан
              </span>
            )}
          </div>
        </div>

        <div className="supplier-branches">
          <strong>Филиалы и контакты</strong>
          {supplier.branches.map((branch) => (
            <div className="supplier-branch-row" key={branch.id}>
              <h3>{branch.name}</h3>
              <div>
                {branch.phones[0] ? (
                  <a href={`tel:${normalizePhoneHref(branch.phones[0])}`}>
                    <Phone size={15} />
                    {branch.phones[0]}
                  </a>
                ) : (
                  <span>
                    <Phone size={15} />
                    Телефон не указан
                  </span>
                )}
                {branch.emails[0] ? (
                  <a href={`mailto:${branch.emails[0]}`}>
                    <Mail size={15} />
                    {branch.emails[0]}
                  </a>
                ) : (
                  <span>
                    <Mail size={15} />
                    Email не указан
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="supplier-modal-actions">
          <button type="button">Открыть товары поставщика</button>
          <button type="button">Создать заказ</button>
        </div>
      </article>
    </div>
  );
}

function normalizePhoneHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function getBranchWord(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "филиал";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "филиала";
  }

  return "филиалов";
}
