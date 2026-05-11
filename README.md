# SubasTech

SubasTech is an AI-powered, WhatsApp-first platform for home technical services.

The current MVP direction is not a real-time auction system. The client experience starts in WhatsApp, where an AI-assisted intake flow extracts category, urgency and location. Django then applies deterministic business logic to filter and rank technicians.

## Product direction

- Clients use WhatsApp only.
- Technicians use a responsive web dashboard.
- Administrators use a responsive web dashboard.
- Arbiters use a responsive web dashboard with human-in-the-loop moderation.
- AI helps with controlled tasks such as category extraction, urgency detection, location extraction and dispute summaries.
- Recommendation scores are calculated in backend business logic, not by the AI model.

## Repository structure

```txt
frontend/   Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
backend/    Django, Django REST Framework, JWT auth, recommendation modules
```

## Backend modules

- `accounts`: users, roles and JWT-ready auth endpoints.
- `catalog`: categories, zones, technician profiles, services, photos and availability.
- `recommendations`: deterministic technician ranking engine.
- `whatsapp`: webhook entry point and controlled intent extraction placeholder.
- `reputation`: ratings and penalties.
- `disputes`: dispute records, evidence and AI summary placeholder.
- `notifications`: dashboard/WhatsApp/email notification records.

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

Open `http://localhost:8000/api/`.

> The cloud environment used for this first scaffold did not include `python3-venv`, so dependencies were installed with `pip --user` for validation. A standard local Python environment should use the virtualenv steps above.

## First API endpoints

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `GET /api/auth/me/`
- `GET /api/categories/`
- `GET /api/zones/`
- `GET /api/services/`
- `POST /api/recommendations/`
- `GET|POST /api/whatsapp/webhook/`

Example recommendation request:

```json
{
  "category": "electrician",
  "location": "Riomar",
  "urgency": "high",
  "limit": 5
}
```

## MVP build order

1. Seed categories and zones.
2. Build technician onboarding and service CRUD.
3. Connect WhatsApp Cloud API webhook.
4. Improve intent extraction with Gemini Flash or OpenRouter.
5. Build technician recommendation response templates for WhatsApp.
6. Add technician/admin/arbiter dashboard pages.
7. Expand dispute moderation and reputation effects.
