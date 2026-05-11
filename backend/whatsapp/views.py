import os

from django.http import HttpResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from recommendations.services import RecommendationRequest, recommend_services
from .ai import extract_intent
from .client import WhatsAppCloudClient


class WhatsAppWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "subastech-dev-token")
        if request.query_params.get("hub.verify_token") == verify_token:
            return HttpResponse(request.query_params.get("hub.challenge", ""), status=200)
        return Response({"detail": "Invalid verification token"}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        message = self._extract_message_text(request.data)
        sender = self._extract_sender(request.data)

        if not message:
            return Response({"detail": "No inbound text message found", "ignored": True}, status=status.HTTP_200_OK)

        intent = extract_intent(message)
        recommendations = list(
            recommend_services(
                RecommendationRequest(
                    category=intent.get("category") or None,
                    location=intent.get("location") or None,
                    urgency=intent.get("urgency", "normal"),
                    limit=3,
                )
            )
        )
        reply_text = build_recommendation_reply(intent, recommendations)
        send_result = None
        if sender:
            send_result = WhatsAppCloudClient().send_text(sender, reply_text)

        return Response(
            {
                "message": message,
                "sender": sender,
                "intent": intent,
                "recommendations": recommendations,
                "reply_text": reply_text,
                "outbound": send_result.__dict__ if send_result else None,
            }
        )

    def _extract_message_text(self, payload: dict) -> str:
        if payload.get("message"):
            return str(payload["message"])
        try:
            return payload["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"]
        except (KeyError, IndexError, TypeError):
            return ""

    def _extract_sender(self, payload: dict) -> str:
        if payload.get("from"):
            return str(payload["from"])
        try:
            return payload["entry"][0]["changes"][0]["value"]["messages"][0]["from"]
        except (KeyError, IndexError, TypeError):
            return ""


def build_recommendation_reply(intent: dict, recommendations: list[dict]) -> str:
    category = intent.get("category") or "servicio tecnico"
    location = intent.get("location") or "tu zona"

    if not recommendations:
        return (
            "Hola, soy SubasTech. Entendi que necesitas "
            f"{category} en {location}, pero aun no encontre tecnicos disponibles con esos filtros. "
            "Un asesor puede revisar tu caso o puedes intentar con una zona cercana."
        )

    lines = [
        "Hola, soy SubasTech. Estas son las mejores opciones que encontre:",
        "",
    ]
    for index, item in enumerate(recommendations, start=1):
        lines.extend(
            [
                f"{index}. {item['technician_name']} - {item['service_title']}",
                f"   Puntaje: {item['score']}/100 | Respuesta: {item['response_time_minutes']} min",
                f"   Precio base: ${item['base_price']}",
            ]
        )
    lines.extend(
        [
            "",
            "Responde con el numero del tecnico que prefieres o describe mas detalles del problema.",
        ]
    )
    return "\n".join(lines)
