"use client";

import { Search } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type PageToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

type PageSearchProps = {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

type PageSelectProps = {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  value: string;
};

type PageCheckboxProps = {
  checked: boolean;
  children: React.ReactNode;
  onChange: (checked: boolean) => void;
};

export function PageToolbar({ children, className = "" }: PageToolbarProps) {
  return <div className={`page-filter-toolbar ${className}`.trim()}>{children}</div>;
}

export function PageFilterGroup({ children }: { children: React.ReactNode }) {
  return <div className="page-filter-group">{children}</div>;
}

export function PageSearch({ onChange, placeholder, value }: PageSearchProps) {
  return (
    <div className="page-search">
      <Search size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function PageSelect({ ariaLabel, onChange, options, value }: PageSelectProps) {
  return (
    <select className="page-select" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export function PageCheckbox({ checked, children, onChange }: PageCheckboxProps) {
  return (
    <label className="page-checkbox">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      {children}
    </label>
  );
}
