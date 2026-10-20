# 🎁 Giftly — Sri Lanka's AI Gift Discovery & Shop Aggregation Platform

> **“Find the perfect gift. From the right shop.”**

Giftly is a gift discovery and shop aggregation platform for Sri Lanka, **NOT** an e-commerce store. It answers the question: *“What should I gift this person, and where can I find it?”*

Users describe the person, occasion, budget, interests, and preferred gift style. Giftly calculates the match score and connects them directly with authentic Sri Lankan florists, bakeries, artisan creators, and boutiques via WhatsApp, Instagram, and official websites.

---

## 🚀 Key Features

1. **AI Natural Language Gift Assistant** (`/ai-assistant` & `/api/ai/gift-search`)
   - Natural conversational queries (e.g. *“Birthday gift for my girlfriend under LKR 5,000, she likes flowers and skincare”*).
   - Searches verified database listings and returns match scores with clear reasoning.
   - Strictly recommends real products from verified shops.

2. **“I Don't Know What to Buy 😭” Quiz** (`/quiz`)
   - 5 guided multi-step questions to determine the gift archetype (e.g., *Thoughtful + Romantic*).
   - Generates top tailored recommendations with price matching in LKR.

3. **Gift Discovery & Multi-Filter Catalog** (`/gifts`)
   - Filters: Occasions, Recipients, Categories, Gift Vibes, Price Slider (LKR 2,000 - 25,000+), Districts (Colombo, Kandy, Galle, Gampaha).
   - Sorting: Recommended, Price Low to High, Price High to Low, Most Popular, Newest.

4. **Product Details Page** (`/gifts/[id]`)
   - Image gallery, verified shop snippet, seller reference price in LKR, recipient & occasion compatibility badges.
   - Direct Outbound Buttons: **Order on WhatsApp**, **Message on Instagram**, **Visit Website**.
   - Clear non-e-commerce discovery disclaimer.

5. **Shop Directory & Dedicated Shop Pages** (`/shops`, `/shops/[slug]`)
   - Verified checkmark, district, cover photo, category tags, direct social channels, and complete listed catalog.

6. **Recipient Profiles** (`/recipients`)
   - Save profiles for loved ones (e.g., *“My Girlfriend ❤️”*, *“Amma 💐”*, *“Bestie Kasun ☕”*) with birthdays, interests, and budgets.
   - 1-click **“Find a gift for her/him”** search.

7. **Side-by-Side Gift Comparison** (`/compare`)
   - Compare up to 4 selected gifts simultaneously across price, shop location, category, style, and contact options.

8. **Favorites Shortlist** (`/favorites`)
   - Save both gift items and local shops to revisit anytime.

9. **Shop Owner Dashboard** (`/shop-portal`)
   - Add/manage gift discovery listings and track outbound WhatsApp/Instagram inquiry counts.

10. **Admin Console** (`/admin`)
    - Platform oversight, shop verification management, listing approvals, search logs, and metrics.

---

## 🛠️ Technology Stack

- **Frontend & Routing:** Next.js 14 App Router, TypeScript, React 18
- **Styling:** Tailwind CSS, Custom Design System tokens, Glassmorphism, Google Fonts (*Plus Jakarta Sans* & *Playfair Display*)
- **Icons:** Lucide React
- **Data & Persistence Layer:** Pure Node.js persistent data engine (`src/lib/db/index.ts`) with typed repository methods, JSON file persistence in `.data/db.json` with in-memory fallback.
- **AI Recommendation Engine:** Intelligent multi-factor scoring (Budget 30%, Occasion 20%, Recipient 20%, Interest 20%, Style 10%) with reasoning generation (`src/lib/ai/recommendation-engine.ts`).

---

## 🏃‍♂️ Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Role Switcher

Use the role pill in the top navigation bar to test all user perspectives:
- **Shopper Mode (Siluni):** Browse, test AI assistant, save favorites & recipient profiles.
- **Shop Owner (Bloom House):** Add gifts, update shop details, view lead analytics.
- **Platform Admin:** Verify shops, review metrics, monitor search queries.
