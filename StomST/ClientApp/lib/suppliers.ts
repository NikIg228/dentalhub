export type SupplierBranch = {
  id: number;
  name: string;
  phones: string[];
  emails: string[];
};

export type Supplier = {
  id: number;
  name: string;
  city: string;
  contractSigned: boolean;
  hasDiscount: boolean;
  branches: SupplierBranch[];
};

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "ТОО \"ДентМед КЗ\"",
    city: "Алматы",
    contractSigned: true,
    hasDiscount: true,
    branches: [
      {
        id: 11,
        name: "ДентМед КЗ · Центр",
        phones: ["+7 727 244 18 20"],
        emails: ["orders@dentmed.kz"]
      },
      {
        id: 12,
        name: "ДентМед КЗ · Склад",
        phones: ["+7 727 244 18 21"],
        emails: ["stock@dentmed.kz"]
      }
    ]
  },
  {
    id: 2,
    name: "ТОО \"Профи-Дент\"",
    city: "Астана",
    contractSigned: true,
    hasDiscount: true,
    branches: [
      {
        id: 21,
        name: "Профи-Дент · Астана",
        phones: ["+7 7172 51 40 90"],
        emails: ["sales@profident.kz"]
      }
    ]
  },
  {
    id: 3,
    name: "ТОО \"Стом-Снаб\"",
    city: "Караганда",
    contractSigned: false,
    hasDiscount: true,
    branches: [
      {
        id: 31,
        name: "Стом-Снаб · Караганда",
        phones: ["+7 7212 37 88 10"],
        emails: ["info@stomsnab.kz"]
      }
    ]
  },
  {
    id: 4,
    name: "ТОО \"Премиум Дент\"",
    city: "Алматы",
    contractSigned: true,
    hasDiscount: false,
    branches: [
      {
        id: 41,
        name: "Премиум Дент · Имплантология",
        phones: ["+7 727 355 09 10"],
        emails: ["implant@premiumdent.kz"]
      }
    ]
  }
];
