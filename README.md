# ShopLite — E-Commerce Client for EXORA

**ShopLite** is a realistic, modern e-commerce frontend built with **React**, **TypeScript**, and **Vite**.

It is an example client application designed to demonstrate the capabilities of **EXORA**, an API simulation platform. ShopLite consumes mock REST APIs provided by EXORA to illustrate how frontend applications can be developed, tested, and demonstrated independently of a live backend.

---

## Features

- **Header**: Logo, search bar, product quick links, live API status indicator, orders link, and shopping cart drawer toggle.
- **Hero Section**: High-impact introduction highlighting backend-independent architecture and EXORA integration.
- **Product Catalog**: Dynamic catalog rendering products fetched via `fetch()`, including category filtering, in-stock filtering, and sorting.
- **Loading State**: Visual skeleton cards and loading banner during network requests.
- **Error State**: Displays `"Unable to load products"` with a Retry button and an optional Demo Fallback toggle.
- **Empty State**: Handles empty arrays or empty search results with helpful recovery options.
- **API Status Indicator**: Live indicator showing `"API Connected"`, `"API Unavailable"`, or `"Demo Fallback"`.
- **Interactive Cart & Orders**: Fully functional client-side cart and mock order placement.

---

## 1. How to Install

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

Clone or open the repository, then install the dependencies:

```bash
npm install
```

---

## 2. How to Run

To start the Vite development server:

```bash
npm run dev
```

By default, Vite will start the application at:

```
http://localhost:5173
```

To create a production build:

```bash
npm run build
npm run preview
```

---

## 3. How to Configure `VITE_API_BASE_URL`

ShopLite retrieves mock products dynamically from EXORA using the `VITE_API_BASE_URL` environment variable.

1. Create a `.env` file in the root directory (a `.env.example` is provided for reference):

```bash
cp .env.example .env
```

2. Specify your EXORA server URL:

```env
# Base URL of your running EXORA mock API instance
VITE_API_BASE_URL=http://localhost:8080
```

If `VITE_API_BASE_URL` is omitted, ShopLite defaults to `http://localhost:8080`.

To change the endpoint path (default is `/mock/products`), you can edit `API_CONFIG.productsEndpoint` in [`src/services/api.ts`](file:///c:/Users/akhil/shoplite/src/services/api.ts).

---

## 4. How ShopLite Communicates with EXORA

### Architecture Overview

```
┌─────────────────────────────────┐           HTTP GET            ┌─────────────────────────────┐
│            ShopLite             │ ────────────────────────────> │            EXORA            │
│  (React + TypeScript + Vite)    │                               │   (API Simulation Engine)   │
│                                 │ <──────────────────────────── │                             │
│   src/services/api.ts           │       JSON Mock Products      │   http://localhost:8080     │
└─────────────────────────────────┘                               └─────────────────────────────┘
```

1. **Request Endpoint**:
   When the catalog loads or refreshes, `src/services/api.ts` performs a standard `fetch()` request:
   ```http
   GET ${VITE_API_BASE_URL}/mock/products
   Accept: application/json
   ```

2. **Expected Response Format**:
   ShopLite expects EXORA to return a JSON payload with a `products` array matching the following schema:
   ```json
   {
     "products": [
       {
         "id": 1,
         "name": "Laptop",
         "price": 55000,
         "inStock": true,
         "description": "High-performance ultra-thin laptop",
         "category": "Computers"
       },
       {
         "id": 2,
         "name": "Headphones",
         "price": 2000,
         "inStock": true,
         "description": "Studio-quality over-ear headphones",
         "category": "Audio"
       }
     ]
   }
   ```

3. **Connection Handling & Fallback**:
   - **When EXORA is running**: The API status indicator shows **API Connected** (green), and live mock items are rendered in the catalog.
   - **When EXORA is unavailable**: The application transitions to the Error State displaying **"Unable to load products"** and marks the status as **API Unavailable** (red). A **Retry Connection** button allows reconnecting once EXORA is launched.
   - **Demo / Standalone Evaluation**: If EXORA is not yet running, users can click **"Load Demo Mock Data"** (or use the API Architecture modal) to immediately evaluate the interface using separated fallback mock items.

---

## Project Structure

```
shoplite/
├── src/
│   ├── components/
│   │   ├── ApiInfoModal.tsx    # EXORA connection inspector & mode switcher
│   │   ├── CartDrawer.tsx      # Slide-out interactive shopping cart
│   │   ├── EmptyState.tsx      # Graceful empty catalog / filter state
│   │   ├── ErrorState.tsx      # "Unable to load products" + retry action
│   │   ├── Footer.tsx          # Clean modern footer
│   │   ├── Header.tsx          # Nav, search, logo, cart, & status pill
│   │   ├── Hero.tsx            # Modern hero showcase section
│   │   ├── LoadingSkeleton.tsx # Shimmer skeleton cards for loading state
│   │   ├── OrdersModal.tsx     # Session order history viewer
│   │   ├── ProductCard.tsx     # Card with image, price, stock & add button
│   │   ├── ProductSection.tsx  # Catalog container, filters & sorting
│   │   └── StatusIndicator.tsx # API status pill (Connected / Unavailable / Demo)
│   ├── services/
│   │   ├── api.ts              # Fetch service consuming ${VITE_API_BASE_URL}/mock/products
│   │   └── mockData.ts         # Separated fallback dataset
│   ├── types/
│   │   └── product.ts          # TypeScript interfaces (Product, Order, CartItem, etc.)
│   ├── App.css                 # Clean, responsive e-commerce styles
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Design tokens, reset & typography
│   └── main.tsx                # React root mount
├── .env                        # Local environment variables
├── .env.example                # Example environment variables template
├── package.json
└── tsconfig.json
```
