export type SupplierQuote = {
  supplier: string;
  city: string;
  price: number;
  stock: number;
  expires: string;
  discount: number;
  multiple: number;
  updatedAt: string;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  country: string;
  form: string;
  description: string;
  quotes: SupplierQuote[];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Слюноотсосы Euronda",
    brand: "Euronda",
    category: "Расходные материалы",
    country: "Италия",
    form: "Упаковка",
    description: "Гибкие одноразовые слюноотсосы для ежедневной клинической работы.",
    quotes: [
      {
        supplier: "ТОО \"ДентМед КЗ\"",
        city: "Алматы",
        price: 3600,
        stock: 75,
        expires: "10.04.2027",
        discount: 7,
        multiple: 8,
        updatedAt: "29.05.2025"
      },
      {
        supplier: "ТОО \"Стом-Снаб\"",
        city: "Астана",
        price: 3820,
        stock: 42,
        expires: "18.05.2027",
        discount: 5,
        multiple: 6,
        updatedAt: "28.05.2025"
      }
    ]
  },
  {
    id: 3,
    name: "Платки для коффердама Sanctuary",
    brand: "Sanctuary",
    category: "Изоляция",
    country: "Малайзия",
    form: "36 шт",
    description: "Премиальные платки для сухого рабочего поля и эндодонтии.",
    quotes: [
      {
        supplier: "ТОО \"ДентМед КЗ\"",
        city: "Алматы",
        price: 8500,
        stock: 45,
        expires: "30.11.2026",
        discount: 10,
        multiple: 3,
        updatedAt: "28.05.2025"
      },
      {
        supplier: "ТОО \"Профи-Дент\"",
        city: "Астана",
        price: 9200,
        stock: 32,
        expires: "15.02.2027",
        discount: 12,
        multiple: 2,
        updatedAt: "26.05.2025"
      },
      {
        supplier: "ТОО \"Стом-Снаб\"",
        city: "Караганда",
        price: 8800,
        stock: 28,
        expires: "25.10.2026",
        discount: 7,
        multiple: 4,
        updatedAt: "29.05.2025"
      }
    ]
  },
  {
    id: 5,
    name: "Карпульные иглы Spident",
    brand: "Spident",
    category: "Анестезия",
    country: "Южная Корея",
    form: "100 шт",
    description: "Тонкие иглы для карпульной анестезии с устойчивым потоком.",
    quotes: [
      {
        supplier: "ТОО \"ДентТехно\"",
        city: "Алматы",
        price: 12500,
        stock: 75,
        expires: "30.06.2027",
        discount: 15,
        multiple: 2,
        updatedAt: "27.05.2025"
      },
      {
        supplier: "ТОО \"Корея-Дент\"",
        city: "Астана",
        price: 11800,
        stock: 95,
        expires: "20.04.2027",
        discount: 8,
        multiple: 3,
        updatedAt: "28.05.2025"
      }
    ]
  },
  {
    id: 8,
    name: "Импланты Straumann",
    brand: "Straumann",
    category: "Имплантология",
    country: "Швейцария",
    form: "1 ед",
    description: "Премиальная имплантационная система для сложных клинических случаев.",
    quotes: [
      {
        supplier: "ТОО \"Премиум Дент\"",
        city: "Алматы",
        price: 85000,
        stock: 15,
        expires: "31.12.2032",
        discount: 10,
        multiple: 1,
        updatedAt: "28.05.2025"
      },
      {
        supplier: "ТОО \"Швейцария Дент КЗ\"",
        city: "Астана",
        price: 82000,
        stock: 12,
        expires: "20.11.2032",
        discount: 7,
        multiple: 1,
        updatedAt: "27.05.2025"
      }
    ]
  }
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0
  }).format(value);
}

export function discountedPrice(quote: SupplierQuote) {
  return Math.round(quote.price * (1 - quote.discount / 100));
}
