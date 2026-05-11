from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from catalog.models import Category, Service, TechnicianProfile, Zone
from disputes.models import Dispute
from reputation.models import Rating


class AdminSummaryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        user_model = get_user_model()
        self.admin = user_model.objects.create_user(username="admin", password="Password123", role="admin")
        self.client_user = user_model.objects.create_user(username="client", password="Password123", role="client")
        self.tech_user = user_model.objects.create_user(
            username="tech",
            password="Password123",
            role="technician",
            first_name="Carlos",
            last_name="Mendoza",
        )
        category = Category.objects.create(name="Electrician", slug="electrician")
        zone = Zone.objects.create(name="Riomar", city="Barranquilla")
        profile = TechnicianProfile.objects.create(
            user=self.tech_user,
            is_verified=False,
            availability_status=TechnicianProfile.AvailabilityStatus.AVAILABLE,
            response_time_minutes=20,
            service_completion_rate=90,
        )
        profile.zones.add(zone)
        service = Service.objects.create(
            technician=profile,
            category=category,
            title="Instalacion electrica",
            description="Servicio residencial",
            base_price=80000,
        )
        Rating.objects.create(technician=profile, client=self.client_user, service=service, score=5)
        Dispute.objects.create(
            client=self.client_user,
            technician=profile,
            service=service,
            title="Trabajo incompleto",
            description="El servicio no quedo terminado.",
            priority="high",
        )

    def test_admin_role_can_read_summary(self):
        self.client.force_authenticate(self.admin)

        response = self.client.get("/api/admin/summary/")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["metrics"]["total_technicians"], 1)
        self.assertEqual(body["metrics"]["pending_verification"], 1)
        self.assertEqual(body["metrics"]["open_disputes"], 1)
        self.assertEqual(body["recent_technicians"][0]["name"], "Carlos Mendoza")
        self.assertTrue(body["alerts"])

    def test_non_admin_cannot_read_summary(self):
        self.client.force_authenticate(self.client_user)

        response = self.client.get("/api/admin/summary/")

        self.assertEqual(response.status_code, 403)
