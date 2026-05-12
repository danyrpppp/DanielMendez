# SubasTech Frontend

Next.js 15 dashboard foundation for SubasTech.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

The first screen presents the WhatsApp-first MVP flow and dashboard direction. Future iterations should add role-based routes for technicians, administrators and arbiters.


## Technician dashboard

Visit `/technician` to test the first authenticated technician workflow:

1. Register or create a user with `role=technician`.
2. Get a JWT access token from the backend `/api/auth/token/` endpoint.
3. Paste the token in the dashboard.
4. Complete onboarding and create services.


## Administrator dashboard

Visit `/admin` to test the first administrator workflow:

1. Register or create a user with `role=admin` or use a Django staff user.
2. Get a JWT access token from `/api/auth/token/`.
3. Paste the token in the dashboard.
4. Review metrics, alerts, technicians, services and disputes.
5. Verify/suspend/reactivate technicians.
6. Create categories and coverage zones.

Admin actions include technician moderation and catalog setup for categories/zones.


## Arbiter dashboard

Visit `/arbiter` to test dispute moderation:

1. Use a JWT token for `role=arbiter`, `role=admin`, or a staff user.
2. Load the dispute queue.
3. Review AI-assisted summary, classification and suggested priority.
4. Claim the case and register the human final decision.


## Login

Visit `/login` to authenticate against the Django JWT endpoints. The app stores the access/refresh token pair in localStorage and redirects users by role:

- technician -> `/technician`
- admin -> `/admin`
- arbiter -> `/arbiter`
- client -> `/`


## Mobile-first behavior

The dashboards include a mobile bottom navigation and card-based list views on small screens. Tables are still used on desktop, but technician services, admin technician moderation and arbiter dispute queues switch to touch-friendly cards on mobile.
