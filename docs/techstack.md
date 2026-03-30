## 1. Frontend (Aplikacja Kliencka)

* **React** (v19.x)
* **Vite** (v7.x)
* **TypeScript** (v5.x)
* **TanStack Query / React Query** (v5.90.x)
* **Tailwind CSS** (v4.0.x) 
* **React Router** (v7.x)

## 2. Backend (API & BFF)

* **Node.js** (v22.x LTS)
* **NestJS** (v11.x)
* **TypeScript** (v5.x)
* **Prisma ORM** (v6.19.x)

## 3. Baza Danych
* **PostgreSQL** (v17.x)

## 4. Architektura i Integracja (Decyzje)
* **API Communication:** Frontend komunikuje się **wyłącznie** z wewnętrznym Backendem po protokole HTTP/REST.
* **Autoryzacja:** sesje HTTP-only cookie + Redis (store sesji)
* **Integracja zewnętrzna (SSoT):** Backend odpowiada za autoryzację zapytania do Systemu Logistycznego (przy użyciu sekretnego `X-API-KEY`, doc: openapi.yaml ) oraz łączenie danych w locie ("miękkie" relacje po zewnętrznych numerach ID).