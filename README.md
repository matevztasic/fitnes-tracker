# Fitness Tracker

Full-stack aplikacija za beleženje treningov in vaj. Uporabnik si ustvari račun, doda svoje vaje, ustvarja treninge in vanje vpisuje sete/ponovitve/težo. Aplikacija samodejno izračuna **personal best** za vsako vajo.

Projekt je narejen kot del naloge na faksu (višja strokovna šola). Fokus je bil predvsem na backend logiki in povezavi s frontendom — UI je namenoma osnoven, a funkcionalen.

## Funkcionalnosti

- registracija in prijava (JWT avtentikacija)
- dodajanje in brisanje vaj (*exercises*)
- ustvarjanje treningov (*workouts*)
- dodajanje vaj v trening z beleženjem setov, ponovitev in teže (*exercise entries*)
- samodejen izračun personal best za vsako vajo

## Tehnologije

| Sloj | Tehnologije |
|---|---|
| Backend | NestJS 11, Prisma 6, PostgreSQL, JWT (`@nestjs/jwt`, `passport-jwt`), bcrypt |
| Frontend | React 19, Vite, TypeScript, React Router 7, Axios |

## Arhitektura

Brskalnik (React SPA, Vite)
        │  axios + Bearer JWT
        ▼
NestJS API (Express)
  ├─ Auth
  ├─ Users
  ├─ Exercises
  ├─ Workouts
  └─ ExerciseEntries
        │  Prisma Client
        ▼
   PostgreSQL

Backend je razdeljen na pet neodvisnih Nest modulov. Vsak modul ima svoj `*.controller.ts` (HTTP sloj), `*.service.ts` (poslovna logika + Prisma klici) in DTO-je za validacijo vhodnih podatkov.

## Podatkovni model

Definiran v [`prisma/schema.prisma`](./prisma/schema.prisma).


Definiran v [`prisma/schema.prisma`](./prisma/schema.prisma).

- **User** — `id`, `email` (unikaten), `passwordHash`, `fullName`, `role` (privzeto `"user"`)
- **Exercise** — `id`, `name`, `description`, pripada enemu `User`-ju
- **Workout** — `id`, `title`, `notes`, `workoutDate`, pripada enemu `User`-ju
- **ExerciseEntry** — `sets`, `reps`, `weight`, `isPersonalBest`, pripada enemu `Workout`-u in eni `Exercise`-i

Vse relacije so `onDelete: Cascade` — izbris uporabnika, treninga ali vaje avtomatsko izbriše tudi vse odvisne zapise.

### Personal Best

Ob vsakem novem vnosu (`POST /exercise-entries`) se za to vajo ponovno izračuna personal best čez vse obstoječe vnose:

1. najprej se primerja teža (`weight`) — višja zmaga,
2. pri enaki teži zmagajo več ponovitve (`reps`),
3. vedno je označen samo en zapis kot `isPersonalBest` za posamezno vajo.

Na frontendu se to prikaže z značko **PB**.

## API pregled

Vsi zaščiteni endpointi zahtevajo `Authorization: Bearer <token>` header.

| Metoda | Pot | Zaščita | Opis |
|---|---|---|---|
| POST | `/auth/register` | — | registracija, vrne JWT |
| POST | `/auth/login` | — | prijava, vrne JWT |
| GET | `/auth/me` | JWT | vrne podatke iz tokena |
| GET | `/exercises` | JWT | seznam lastnih vaj |
| POST | `/exercises` | JWT | ustvari vajo |
| DELETE | `/exercises/:id` | JWT | izbriše vajo |
| GET | `/workouts` | JWT | seznam lastnih treningov (z entryji) |
| POST | `/workouts` | JWT | ustvari trening |
| POST | `/exercise-entries` | JWT | doda vnos v trening, preračuna PB |
| GET | `/exercise-entries/workout/:workoutId` | JWT | vnosi za en trening |

## Namestitev in zagon

### Predpogoji
- Node.js
- lokalna PostgreSQL instanca (ali Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`)

### Backend

```bash
cd backend
npm install

Ustvari backend/.env:

env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitnes_tracker"
JWT_SECRET="secret"
PORT=3000

npx prisma migrate dev   # uveljavi shemo na lokalni bazi
npm run start:dev        # http://localhost:3000

Frontend

cd frontend
npm install --legacy-peer-deps
npm run dev               # http://localhost:5173

▎ --legacy-peer-deps je potreben, ker so nekateri peer-dependency rangi v drevesu odvisnosti še vezani na starejšo verzijo Reacta kot je React 19.

Testiranje

cd backend
npm run test        # unit testi
npm run test:e2e     # end-to-end testi

Znane omejitve

Nekaj stvari, ki bi jih z več časa naredil drugače:

- DELETE /exercises/:id ne preverja lastništva vaje pred brisanjem.
- GET /users nima zaščite in vrača vse uporabnike (vključno z geselskim hashem) — namenjeno samo za razvoj, ne za produkcijo.
- ni endpointov za urejanje (update) obstoječih vaj/treningov/vnosov.
- role polje na uporabniku trenutno ni uporabljeno za avtorizacijo (temelj za prihodnjo funkcionalnost).
- token je shranjen v localStorage, kar je enostavno, a manj varno od httpOnly cookieja.

Avtor

Matevž Tasič
