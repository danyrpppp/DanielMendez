from rest_framework import permissions, viewsets

from .models import Dispute
from .serializers import DisputeSerializer


class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.select_related("client", "technician__user", "service", "arbiter").prefetch_related("evidence")
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        description = serializer.validated_data.get("description", "")
        summary = description[:280]
        if len(description) > 280:
            summary += "..."
        serializer.save(client=self.request.user, ai_summary=summary)
