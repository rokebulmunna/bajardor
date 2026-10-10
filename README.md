# বাজার দর (BazarDor) - Commodity Price Tracking Platform

**BazarDor (বাজার দর)** is a modern, responsive, and API-driven web application designed to track and monitor daily commodity market prices across Bangladesh. Built with Next.js and Tailwind CSS, it provides real-time market insights, category-wise product breakdown, and market price summaries to help users stay informed about current daily necessity rates.

## 🛠️ Technologies Used

- **Framework**: Next.js (App Router, React 19)
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth (`useSession` client protection & OAuth support)
- **Icons & UI**: Lucide React / Emoji Utilities
- **Deployment**: Vercel
- **API Source**: RESTful API endpoints for live market pricing

## ✨ 5 Key Features

1. **🔒 Protected Product Details & Dynamic Routes**:
   - Secure access to detailed market analysis pages requiring authentication (redirects to `/signin` for unauthenticated visitors).
   - Displays real-time maximum, minimum, and average price summaries alongside market-wise price breakdown tables.

2. **📊 Category-wise Product Filtering & Sorting**:
   - Seamless dynamic routing (`/category/[slug]`) for distinct commodity groups (Rice, Vegetables, Fish, Spices, Meat, Oil, etc.).
   - Interactive sorting controls enabling price organization by *Default*, *Low to High*, and *High to Low*.

3. **⚡ Robust Fallback & Loading States**:
   - Skeleton loading states while fetching API data.
   - Clean empty states with a direct 404-style message and interactive CTA button ("হোম পেজে ফিরে যান") when categories or products are not found.

4. **🚀 Responsive Figma-Aligned UI/UX**:
   - Modern, mobile-first responsive layout matching Figma design guidelines.
   - Dynamic Bengali numeral formatting (`toBanglaDigits`) for localized representation of currency and figures.

5. **🔐 Seamless User Authentication & Sessions**:
   - Built-in session management with Better Auth including Google/GitHub OAuth login support.
   - Interactive navigation user menu with click-outside-to-close interaction and user profile display.