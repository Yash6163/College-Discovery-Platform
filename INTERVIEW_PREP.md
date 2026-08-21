# Campus Compass — Loom and Interview Preparation

Use this as a speaking guide, not a script to memorise word-for-word. Keep your tone natural and explain decisions in your own words.

## 1. The 7–8 minute Loom walkthrough

### 0:00–0:35 — Problem and product

"Students often have college data spread across multiple places: fees in one place, placement information somewhere else, and cutoff data elsewhere. Campus Compass brings those decision factors together. It is a college discovery MVP where a student can search colleges, inspect detailed information, compare options, and get transparent rank-based suggestions."

"The data is deliberately labelled as generated demo data. I do not claim that it is official admission data."

### 0:35–1:20 — Show the home page and user journeys

Open `/`.

"I kept the landing page focused. It gives users three direct paths: explore colleges, compare, or use the predictor. I avoided dashboard-style decorative UI because the student needs to reach useful information quickly."

Show the header links.

"The four core flows are connected rather than being isolated pages: discovery can lead to college details, details provide decision context, comparison helps shortlist, and predictor helps users start a shortlist from their rank."

### 1:20–2:30 — College discovery

Open `/colleges`. Search for a college or location, choose a state, choose a type, change sorting, and clear filters.

Say:

"This filter screen is backed by `GET /api/colleges`, not frontend array filtering. The browser sends query parameters such as `search`, `state`, `minRating`, `page`, and `sort`. The route handler validates them using Zod, the service builds a Prisma `where` condition, and PostgreSQL applies filtering and pagination."

"This matters because real datasets can become large. Pagination avoids loading every college in one response, and the source of truth stays in the database."

Point out loading cards, empty state, error/retry state, result total, previous/next pagination, and responsive sidebar behavior.

### 2:30–3:30 — College detail page

Open one college.

"Each public page uses a stable, unique slug such as `/colleges/iit-delhi`, while Prisma still uses a CUID primary key internally. The detail query loads only the related data needed: courses, latest placement records, cutoff snapshots, and recent reviews."

Walk through overview, courses, placement, cutoffs, and reviews.

"Courses and placements are separate tables because fees differ by course and placement figures change each year. Reviews are also separate, and the API validates title, body, author name, and rating before creating one."

### 3:30–4:30 — Compare colleges

Go back to listing, add 2–3 colleges, then open Compare.

"The UI keeps only selected college slugs in lightweight local state. It does not keep a copy of college records. On comparison, the app calls `GET /api/colleges/compare?ids=...` and the backend verifies that there are 2–3 unique IDs and that each college exists."

"The comparison table is row-oriented so a student can compare one decision factor across institutions. On mobile it uses horizontal scrolling instead of squeezing columns into unreadable cards."

Mention validation: duplicate IDs and more than three IDs return `400`; missing IDs return `404`.

### 4:30–5:45 — Predictor

Open `/predictor`, select JEE Main, and enter `25000`.

"I intentionally chose a rule-based predictor instead of making an unsubstantiated AI claim. Each cutoff record has an exam, category, year, opening rank, and closing rank. A lower rank is better."

"For closing rank C and user rank R: Safe means R is at most 85% of C; Moderate means R is within C; Ambitious means R is within 115% of C. Results outside that range are excluded. Each recommendation includes the historical closing rank and an explanation."

"This is transparent and testable, but it is not an official admission predictor because it does not model counselling rounds, branch selection, seat availability, state quota, or yearly changes."

Try invalid rank `0` once if time permits.

### 5:45–6:50 — Architecture and data model

Open `prisma/schema.prisma` or use the diagram below.

```text
React UI / Next.js App Router
             ↓
Next.js API route handlers
             ↓
Services: filtering, comparison, predictor logic
             ↓
Prisma ORM
             ↓
PostgreSQL / Neon
```

"This is a modular monolith. For an internship MVP, Next.js route handlers are simpler than microservices or NestJS, while services prevent API routes from becoming large and make business logic easy to test."

"College has one-to-many relationships with Course, Placement, Review, and Cutoff. Database indexes support name/location discovery, fee and rating sorting, and predictor lookups by exam and closing rank."

### 6:50–7:40 — Quality, security, and tradeoffs

"Zod validates all external query parameters and review input. Prisma parameterized queries protect against SQL injection. APIs return structured errors and do not expose database errors. Secrets are configured through `DATABASE_URL` and ignored by Git."

"I added Vitest tests for predictor bands, invalid rank, invalid/inverted fee ranges, and pagination defaults. I also ran Prisma validation and a production build."

"I intentionally deferred authentication and saved colleges. Those are valuable, but adding them would have reduced focus on the four required flows."

### 7:40–8:00 — Close

"The next production steps would be integrating verified admission sources, review moderation, authenticated saved lists, richer filters such as category and course-specific cutoffs, and search improvements for a much larger dataset."

## 2. Key technical explanations in Hinglish

### Why Next.js API routes?

"Maine Next.js App Router use kiya because frontend aur backend ek deployable application mein manage ho jate hain. MVP ke liye NestJS ya separate microservices additional complexity create karte. API routes future mobile app ke liye bhi reusable contracts provide karti hain."

### Why PostgreSQL + Prisma?

"Data relational hai: ek college ke multiple courses, placements, reviews aur cutoffs hote hain. PostgreSQL relations aur filtering ke liye strong fit hai. Prisma schema ko TypeScript types se connect karta hai, migrations manageable banata hai, aur parameterized queries se SQL injection risk reduce hota hai."

### Why service layer?

"Route handler ka role HTTP request validate karna aur response dena hai. Business rules, jaise predictor classification ya comparison IDs validate karna, service mein hain. Isse code focused rehta hai aur service tests likhna easier hota hai."

### Why no Redux/Zustand?

"Comparison selection bahut small UI state hai. React local state enough hai. Global state library add karna abhi unnecessary dependency aur complexity hoti. Database data API se hi aata hai."

### Why pagination?

"Agar 10,000 colleges hon aur saare ek API call mein bhejein, response slow hoga aur memory/network waste honge. API `page` aur `limit` use karti hai, maximum limit 50 hai, and response total pages return karta hai."

### Why indexes?

"Indexes frequently queried fields par hain: state/city filter, rating and fee sort, and predictor ke liye exam plus closing rank. Har column par index nahi lagaya because indexes writes ko slower aur storage-heavy bana sakte hain."

## 3. Likely interviewer questions and strong answers

### Q: What happens when multiple filters are selected?

"The client sends all selected values as query parameters. Zod parses and validates them. The service adds those conditions to one Prisma `where` object, so PostgreSQL applies them with AND semantics; search itself matches name, city, or state with OR semantics."

### Q: How do you prevent duplicate comparison colleges?

"The frontend avoids adding a slug already selected, which improves UX. But I do not trust that alone: the comparison API also checks `new Set(ids).size` and returns a 400 error for duplicate IDs."

### Q: Why use slugs and CUIDs together?

"CUID is a stable internal primary key and avoids exposing sequential numeric IDs. Slug gives a readable public URL. The slug has a database unique constraint."

### Q: Is the predictor accurate?

"It is not an official predictor and I explicitly label it as demo historical/generated data. Its value is that the logic is transparent: students can see why a college is Safe, Moderate, or Ambitious. A real version would use verified year-, branch-, quota-, and category-specific datasets."

### Q: How do you avoid N+1 database queries?

"For listing and detail views I use Prisma `include`/`select` to load related records in the main query shape instead of querying courses or placements once per college. I also limit related placement and review records where only the latest/recent records are needed."

### Q: How would you make search work at scale?

"The MVP uses indexed case-insensitive matching because the seed dataset is small. At scale I would add PostgreSQL trigram or full-text search with ranking, while keeping the API contract and service interface unchanged. Elasticsearch would be premature initially."

### Q: Why not authentication?

"It was intentionally out of scope. The evaluation emphasizes discovery, detail, comparison, and prediction. I documented saved colleges and authentication as the next extension rather than shipping a shallow auth implementation."

### Q: What is validated?

"Pagination has positive bounded values. Fees cannot be negative or inverted. Ratings are 0–5. Predictor exam values are an enum and rank is a positive integer. Reviews have minimum/maximum lengths and a 1–5 rating."

### Q: What HTTP status codes do you use?

"200 for successful reads, 400 for malformed query/body values, 404 for a missing college or invalid comparison ID, 500 for unexpected failures. Error responses are structured and do not reveal raw database errors."

### Q: What would you change for production?

"Verified data ingestion, moderation and authentication, rate limiting especially for review creation, observability, error tracking, end-to-end API integration tests against a test database, and caching for frequently viewed college records."

## 4. Honest limitations to state proactively

- The dataset is generated for demonstration and should not be used for real admissions decisions.
- The review endpoint is validated but unauthenticated; a production product needs accounts, moderation, and rate limiting.
- Predictor currently defaults to open-category historical records and does not provide branch/quota/counselling-round modelling.
- Automated tests cover pure business logic and validation. Add integration tests with a disposable PostgreSQL database before production.

## 5. Pre-recording checklist

1. Run `npm install`, set `DATABASE_URL`, `npx prisma migrate deploy`, `npm run db:seed`, then `npm run dev`.
2. Confirm `/colleges` shows seeded results before recording.
3. Prepare two browser tabs: app and `prisma/schema.prisma` / `README.md`.
4. Use a JEE Main rank such as `25000`; the seeded range will produce results.
5. Do not use the word "real" for placement/cutoff data. Say "demo dataset".
6. Keep the video around 7–8 minutes. Speak slowly and demo actions while explaining their engineering purpose.

## 6. 30-second closing answer: "What did you build?"

"I built Campus Compass, a full-stack college discovery MVP using Next.js, TypeScript, PostgreSQL, and Prisma. The main features are API-backed college discovery with filters and pagination, detailed college profiles, validated comparison of up to three colleges, and an explainable rank predictor based on demo historical cutoff ranges. I focused on clean separation between route handlers, services, and database access, input validation with Zod, responsive decision-focused UI, and honest product limitations."
