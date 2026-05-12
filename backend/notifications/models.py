from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Channel(models.TextChoices):
        DASHBOARD = "dashboard", "Dashboard"
        WHATSAPP = "whatsapp", "WhatsApp"
        EMAIL = "email", "Email"

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=160)
    body = models.TextField()
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.DASHBOARD)
    metadata = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
