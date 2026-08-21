# Campus Compass

Campus Compass is a production-oriented college discovery MVP. It helps students search and filter colleges, inspect structured details, compare up to three institutions, and understand rank-based recommendations.

> The included college, review, placement, and cutoff records are generated demonstration data. Predictor output is not official admission advice.

## Features

- Server-filtered, paginated college discovery with search, location, type, rating, fee, course, and sorting support.
- Detail pages covering overview, courses, placements, historical cutoff snapshots, and database-backed reviews.
- API-backed 2–3 college comparison with duplicate, cardinality, and non-existent-college validation.
- Transparent predictor that classifies historical cutoff proximity as Safe, Moderate, or Ambitious.

## Architecture

`Next.js UI → Route Handlers → Services → Prisma → PostgreSQL`.

Route handlers validate untrusted input with Zod. Services own business rules and Prisma query composition. PostgreSQL is the source of truth; frontend components do not contain college data. This single Next.js deployment is intentionally simpler than microservices and is suitable for Vercel + Neon.

## Database

`College` has many `Course`, `Placement`, `Review`, and `Cutoff` records. Placement is yearly; cutoff is scoped to exam, category, course, and year. Indexes target name/location discovery, fee/rating sorting, and `(exam, closingRank)` predictor queries. `slug` is unique for stable public URLs.

## API

- `GET /api/colleges?search=nit&state=Delhi&minFee=50000&page=1&limit=12`
- `GET /api/colleges/:idOrSlug`
- `GET /api/colleges/compare?ids=college-a,college-b`
- `GET /api/predict?exam=JEE_MAIN&rank=25000`
- `GET|POST /api/colleges/:idOrSlug/reviews`

Success responses use `{ data, meta? }`; failures use `{ error: { code, message } }`. Validation errors return 400, missing records return 404, and unexpected failures return sanitized 500 responses.

## Predictor logic

For a historical closing rank `C` and a user rank `R` (lower is better): Safe if `R ≤ 0.85C`; Moderate if `R ≤ C`; Ambitious if `R ≤ 1.15C`; otherwise excluded. The model does not claim to account for counselling rounds, quotas, branch choices, or seat availability.

## Setup

Requirements: Node 20+, PostgreSQL (Neon supported).

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Set `DATABASE_URL` to a pooled or direct Neon PostgreSQL connection string as appropriate for Prisma migrations. Add `DATABASE_URL` to Vercel project environment variables, run migrations during deployment, and seed a non-production database before demoing.

## Quality and tradeoffs

`npm test` tests validation/pagination defaults and predictor boundary logic. The MVP does not include authentication or saved colleges, to keep focus on the four evaluated flows. Future work: authenticated saved lists, review moderation, category/course predictor controls, official source ingestion, full-text search, and analytics.
