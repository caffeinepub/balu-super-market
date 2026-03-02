# Balu Super Market

## Current State
A grocery store website for BALU SUPER MARKET with:
- 90+ products across 5 categories: Grocery, Fresh Fruits, Fresh Juice, Hot Items, Cold Items
- All prices in Indian Rupees
- Address: Asanur Main Road, Chettithangal - 608304
- Contact: 9585984638
- Staff login (password: balu2024) with Admin Panel
- Admin panel: add product, edit price, toggle availability, delete product
- Product images from Unsplash per-product
- The backend's `init()` requires admin authorization, so it never seeds
- Product mutations (add/update/remove) also require admin, so they fail for anonymous callers
- The frontend `useInit` is a no-op — products only show from SAMPLE_PRODUCTS static fallback
- Any changes made in admin panel are lost on page refresh (stored only in memory)

## Requested Changes (Diff)

### Add
- Backend: `init()` callable by anyone, idempotent (seeds only if empty)
- Backend: `addProduct`, `updateProductPrice`, `toggleProductAvailability`, `removeProduct` callable by anyone (frontend enforces password)

### Modify
- Frontend `useInit`: actually call `actor.init()` to seed backend on first load
- Frontend `useProducts`: after init, always read from backend as source of truth

### Remove
- Admin-only restriction on `init()` and product mutation functions

## Implementation Plan
1. Regenerate backend Motoko without admin restriction on init() and product mutations
2. Fix frontend useQueries.ts: useInit should call actor.init() properly
3. Ensure products always load from backend after init
