# SubasTech Demo Guide

## 1. Prepare data

```bash
cd backend
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_demo_data
```

## 2. Start servers

```bash
scripts/run-backend.sh
scripts/run-frontend.sh
```

## 3. Open the app

- Frontend: http://localhost:3000
- Demo guide: http://localhost:3000/demo
- Backend health: http://localhost:8000/api/health/

## 4. Demo credentials

Password for all users: `Subastech123!`

| User | Role | Route |
| --- | --- | --- |
| demo_admin | Administrator | /admin |
| tech_carlos | Technician | /technician |
| demo_arbiter | Arbiter | /arbiter |

## 5. Suggested presentation flow

1. Start at `/demo` and explain the WhatsApp-first architecture.
2. Login as `demo_admin` and show platform metrics, technician verification and catalog setup.
3. Login as `tech_carlos` and show services plus leads.
4. Run a WhatsApp dry-run request:

```bash
curl -X POST http://localhost:8000/api/whatsapp/webhook/ \
  -H "Content-Type: application/json" \
  -d '{"from":"573001112233","message":"Necesito un electricista urgente en Riomar"}'
```

5. Create the lead by selecting option `1`:

```bash
curl -X POST http://localhost:8000/api/whatsapp/webhook/ \
  -H "Content-Type: application/json" \
  -d '{"from":"573001112233","message":"1"}'
```

6. Refresh `/technician` and show the new lead.
7. Login as `demo_arbiter` and show human-in-the-loop dispute review.

## 6. What to emphasize

- The client does not need a native app; WhatsApp is the mobile-first client channel.
- Dashboards are responsive web interfaces for technicians, administrators and arbiters.
- AI is controlled: it extracts intent and assists summaries, but business decisions remain deterministic or human-reviewed.
- The recommendation score is backend logic, not arbitrary AI output.
