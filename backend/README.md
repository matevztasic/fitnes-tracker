Fitness Tracker
Opis

To je aplikacija za beleženje treningov in vaj.
Uporabnik si lahko ustvari račun, doda svoje vaje, dela treninge in spremlja napredek.

Glavna ideja projekta je bila, da imam neko enostavno aplikacijo, kjer lahko spremljam treninge in vidim svoj napredek (predvsem personal best).

Funkcionalnosti
registracija in login (JWT)
dodajanje vaj (exercises)
ustvarjanje treningov (workouts)
dodajanje vaj v trening (exercise entries)
beleženje:
sets
reps
weight
prikaz vseh vaj in treningov
Personal Best

Aplikacija sama izračuna personal best za vsako vajo:

najprej se gleda teža
če je teža enaka, se gledajo ponovitve (reps)
vedno je samo en personal best za posamezno vajo

Na frontendu se to prikaže z oznako PB.

Tehnologije
Backend
NestJS
Prisma
PostgreSQL
JWT
Frontend
React (Vite)
TypeScript
Axios
Kako zagnati projekt
Backend
cd backend
npm install
npm run start:dev

Ustvari .env datoteko:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitnes_tracker"
JWT_SECRET="secret"
PORT=3000
Frontend
cd frontend
npm install --legacy-peer-deps
npm run dev

Frontend dela na:
http://localhost:5173

Uporaba
najprej se registriraš ali prijaviš
dodaš vaje (npr. Bench Press)
ustvariš workout
v workout dodaš entry (sets, reps, weight)
aplikacija sama označi personal best
Struktura projekta
backend (NestJS + Prisma)
frontend (React)
PostgreSQL baza
Opombe
projekt je narejen kot del naloge na faksu
fokus je bil predvsem na backend logiki in povezavi s frontendom
UI je bolj osnovni, ampak funkcionalen

Avtor
Matevž Tasič

