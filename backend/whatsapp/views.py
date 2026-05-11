import os

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from recommendations.services import RecommendationRequest, recommend_services
from .ai import extract_intent


class WhatsAppWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "subastech-dev-token")
        if request.query_params.get("hub.verify_token") == verify_token:
            return Response(int(request.query_params.get("hub.challenge", "0")))
        return Response({"detail": "Invalid verification token"}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        message = self._extract_message_text(request.data)
        intent = extract_intent(message)
        recommendations = list(
            recommend_services(
                RecommendationRequest(
                    category=intent.get("category") or None,
                    location=intent.get("location") or None,
                    urgency=intent.get("urgency", "normal"),
                )
            )
        )
        return Response({"message": message, "intent": intent, "recommendations": recommendations})

    def _extract_message_text(self, payload: dict) -> str:
        if payload.get("message"):
            return str(payload["message"])
        try:
            return payload["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"]
        except (KeyError, IndexError, TypeError):
            return ""
