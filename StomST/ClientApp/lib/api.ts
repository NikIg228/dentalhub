import type { Product, SupplierQuote } from "@/lib/catalog";
import type { Supplier } from "@/lib/suppliers";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiRequestTimeoutMs = 1800;

type LoginRequest = {
  username: string;
  password: string;
  remember: boolean;
};

type CurrentUserDto = {
  userName: string;
  employeeId: number;
  dentistryId: number;
  roles: string[];
};

type ProductListItemDto = {
  productId: number;
  productName: string;
  categoryName: string;
  brandName: string;
  manufacturerName: string;
};

type SupplierProductStockDto = {
  supplierId: number;
  supplierName: string;
  city: string;
  price: number;
  quantity: number;
  shelfLife: string;
  markup: number;
  priceDate: string;
};

type SupplierDto = {
  supplierId: number;
  supplierName: string;
  isContractSigned: boolean;
  isDiscount: boolean;
  subsuppliers: Array<{
    subsupplierId: number;
    subsupplierName: string;
    phones: string[];
    emails: string[];
  }>;
};

export async function getProducts(signal?: AbortSignal) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await getApiResponse("/api/products", signal);

  if (!response.ok) {
    return null;
  }

  const products = (await response.json()) as ProductListItemDto[];
  return products.map(toProductShell);
}

export async function login(request: LoginRequest) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as CurrentUserDto;
}

export async function getCurrentUser(signal?: AbortSignal) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await getApiResponse("/api/me", signal);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as CurrentUserDto;
}

export async function logout() {
  if (!apiBaseUrl) {
    return;
  }

  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
}

export async function getProductQuotes(productId: number, signal?: AbortSignal) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await getApiResponse(`/api/products/${productId}/stocks`, signal);

  if (!response.ok) {
    return null;
  }

  const stocks = (await response.json()) as SupplierProductStockDto[];
  return stocks.map(toSupplierQuote);
}

export async function getSuppliers(signal?: AbortSignal) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await getApiResponse("/api/suppliers", signal);

  if (!response.ok) {
    return null;
  }

  const suppliers = (await response.json()) as SupplierDto[];
  return suppliers.map(toSupplier);
}

async function getApiResponse(path: string, signal?: AbortSignal) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), apiRequestTimeoutMs);

  function abortFromParent() {
    controller.abort();
  }

  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener("abort", abortFromParent, { once: true });
  }

  try {
    return await fetch(`${apiBaseUrl}${path}`, {
      credentials: "include",
      signal: controller.signal
    });
  } finally {
    globalThis.clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromParent);
  }
}

function toProductShell(product: ProductListItemDto): Product {
  return {
    id: product.productId,
    name: product.productName,
    brand: product.brandName,
    category: product.categoryName,
    country: "",
    form: "",
    description: product.manufacturerName || "Данные товара загружены из ASP.NET API.",
    quotes: []
  };
}

function toSupplierQuote(stock: SupplierProductStockDto): SupplierQuote {
  return {
    supplier: stock.supplierName,
    city: stock.city,
    price: stock.price,
    stock: stock.quantity,
    expires: stock.shelfLife,
    discount: 0,
    multiple: 1,
    updatedAt: formatApiDate(stock.priceDate)
  };
}

function toSupplier(supplier: SupplierDto): Supplier {
  const branches = supplier.subsuppliers.map((branch) => ({
    id: branch.subsupplierId,
    name: branch.subsupplierName,
    phones: branch.phones,
    emails: branch.emails
  }));

  return {
    id: supplier.supplierId,
    name: supplier.supplierName,
    city: branches[0]?.name.split("·").at(-1)?.trim() ?? "",
    contractSigned: supplier.isContractSigned,
    hasDiscount: supplier.isDiscount,
    branches
  };
}

function formatApiDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-KZ").format(date);
}
