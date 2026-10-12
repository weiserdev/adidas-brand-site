# 👟 Adidas Brand Site

A fully responsive **Adidas brand showcase** built with **Next.js 15**, **React 19**, and **TypeScript**, combining modern web technologies with **AI-powered search, recommendations, and comparisons**.

This project reimagines the Adidas experience through design, interactivity, and intelligent functionality — bringing together heritage, style, and machine learning.

---

## 🚀 Features

### 🧠 AI Capabilities

- **Brand Chat** – Powered by `moonshotai/Kimi-K2-Instruct:novita`, scoped to Adidas-related knowledge only.
- **Natural-Language Search** – Type queries like _“black shoes for men under 80 euros”_; the system detects the language, translates, and finds matching products using **sentence-transformers/all-mpnet-base-v2** embeddings.
- **On-Page Recommendations** – Similar items suggested dynamically via vector similarity.
- **AI Comparison** – Compare shoes side-by-side with generative model insights on design, comfort, and heritage.

### 🖥️ Core Site

- **Dynamic Routes** – `/shoes/[slug]` pages generated with metadata for every product.
- **Interactive 3D Models** – Built using **React Three Fiber** and **@react-three/drei**.
- **Animations & Motion** – Smooth transitions via **GSAP**, **Framer Motion**, and **Animate.css**.
- **Toast Feedback & Loading States** – Handled by `react-hot-toast` and custom `<Loading />` component.
- **Store Locator** – Map integration for nearby Adidas locations with Street View support.

---

## 🧩 Tech Stack

| Category             | Libraries / Tools                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Framework**        | Next.js 15, React 19, TypeScript                                                                                       |
| **Styling & Motion** | Tailwind CSS 4, GSAP, Framer Motion, Animate.css                                                                       |
| **3D / Graphics**    | three.js, @react-three/fiber, @react-three/drei                                                                        |
| **AI / NLP**         | moonshotai/Kimi-K2-Instruct:novita, sentence-transformers/all-mpnet-base-v2, @vitalets/google-translate-api, franc-min |
| **State & Data**     | @tanstack/react-query v5, PostgreSQL (pg)                                                                              |
| **Validation**       | Zod                                                                                                                    |
| **UX Enhancements**  | react-hot-toast, Typed.js                                                                                              |
| **Hosting**          | Vercel                                                                                                                 |

---

## 🧠 Architecture Overview

```plaintext
src/
 ├── app/
 │    ├── layout.tsx
 │    ├── not-found.tsx
 │    ├── page.tsx                    # Home
 │    ├── providers.tsx
 │    ├── history/page.tsx            # History
 │    ├── promo/page.tsx              # Promotions
 │    ├── shoes/
 │    │    ├── page.tsx               # Product list
 │    │    └── [slug]/page.tsx        # Individual product
 │    │    └── compare/page.tsx       # Shoe Comparison
 │    └── stores/page.tsx             # Store Locator
 │
 ├── components/
 │    ├── common/                     # Chat, Footer, Header, Loading, etc.
 │    ├── compare/                    # AICompare, CompareButton, etc.
 │    ├── home/                       # Hero, Model, Slide, Video, etc.
 │    ├── promo/                      # Figure, Info, ScatterLogo, etc.
 │    ├── shoe/                       # Banner, Details, Recommendation, etc.
 │    ├── shoes/                      # FilterPanel, ShoeCard, ShoeGrid, etc.
 │    ├── stores/                     # Content: map and street view
 │    └── history/
 │         ├── desktop/               # Desktop layout
 │         ├── small-screen/          # Small screen layout
 │         └── Content.tsx
 │
 ├── context/
 │    ├── CompareContext.tsx.         # Comparison context
 │    └── ToastContext.tsx            # React hot toast context
 │
 ├── data/                            # about, countries, partners, etc.
 ├── fonts/                           # font collection
 ├── hooks/
 │    ├── useCompareAnalysis.ts       # AI shoe comparison request
 │    ├── useDisableScroll.ts         # Disable page scrolling
 │    ├── useShoeBySlugQuery.ts       # Fetch shoe by slug
 │    ├── useShoeImagesQuery.ts       # Fetch shoe images
 │    ├── useShoeQuery.ts             # Query shoe list
 │    └── useStoreSearch.ts           # Search store locations
 │
 ├── lib/
 │    ├── extract-constraints/        # Natural language query parsing
 │    ├── search-shoes/               # AI-driven and SQL-based product search engine
 │    ├── queryClient.ts
 │    └── mergeMetaData.ts
 │
 ├── styles/
 ├── types/
 │
 └── api/
      ├── chat/route.ts               # AI chat API route
      ├── compare/route.ts            # AI text-generator compare API route
      ├── recommendations/route.ts    # AI recommendations API route
      ├── stores/route.ts             # Store locator API route
      └── shoes/
            ├── route.ts              # Shoe Collection API route
            └── [slug]/
                  ├──route.ts         # Dynamic Shoe API route
                  └──images/route.ts  # Dynamic images API route

```

---

## 🔍 SEO & Metadata

Each page includes optimized metadata:

| Route            | Title                 | Canonical                                     |
| ---------------- | --------------------- | --------------------------------------------- |
| `/`              | **Adidas Brand Site** | https://weiser-adidas.vercel.app              |
| `/history`       | **History**           | https://weiser-adidas.vercel.app/history      |
| `/shoes`         | **Shoe Collection**   | https://weiser-adidas.vercel.app/shoes        |
| `/shoes/[slug]`  | **Dynamic Shoe Page** | https://weiser-adidas.vercel.app/shoes/[slug] |
| `/shoes/compare` | **Shoe Comparison**   | https://weiser-adidas.vercel.app/compare      |
| `/promo`         | **Promotions**        | https://weiser-adidas.vercel.app/promo        |
| `/stores`        | **Stores**            | https://weiser-adidas.vercel.app/stores       |

All metadata uses `mergeOpenGraph()` to unify base OG properties and dynamic per-page overrides.

---

## 🧠 AI Flow Summary

```plaintext
User Query → Language Detection (franc-min)
           → Translation (Google Translate API)
           → Embedding (sentence-transformers/all-mpnet-base-v2)
           → Semantic Search / Vector Match
           → AI Response (moonshotai/Kimi-K2-Instruct)
```

---

## 🖼️ Open Graph Preview

Social-share image:

```
https://weiser-adidas.vercel.app/og-image.png
```

![OG Image](https://weiser-adidas.vercel.app/og-image.png)

---

## 🧑‍💻 Author

**Peter Weiser**  
[GitHub @weiserdev](https://github.com/weiserdev) · [Portfolio](https://peterweiser.com)

---

## ⚖️ License

This project is for educational and showcase purposes only.  
Adidas® is a registered trademark of Adidas AG. This site is **not affiliated with or endorsed by Adidas AG**.
